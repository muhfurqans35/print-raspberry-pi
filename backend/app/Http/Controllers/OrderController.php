<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PrintJob;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class OrderController extends Controller
{
    private function clearOrderCache()
    {
        // Get all cache keys that start with 'orders:'
        $keys = Cache::get('order_cache_keys', []);

        // Clear each cached query
        foreach ($keys as $key) {
            Cache::forget($key);
        }

        // Clear the cache keys tracker
        Cache::forget('order_cache_keys');
    }

    private function addOrderCacheKey($key)
    {
        $keys = Cache::get('order_cache_keys', []);
        if (!in_array($key, $keys)) {
            $keys[] = $key;
            Cache::put('order_cache_keys', $keys, now()->addDays(1));
        }
    }

    public function store(OrderRequest $request)
    {
        DB::beginTransaction();

        try {

            $totalAmount = 0;

            // Buat order baru
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_date' => now(),
                'total_amount' => 0,
                'status' => 'new',
            ]);
            if ($request->has('items')) {
            foreach ($request->items as $itemData) {
                $itemId = $itemData['item_id'] ?? null;
                if ($itemId) {
                    $item = Item::findOrFail($itemId);
                    $quantity = $itemData['quantity'];
                    $price = $item->price;
                    $totalPrice = $price * $quantity;

                    OrderDetail::create([
                        'order_id' => $order->order_id,
                        'product_type' => 'item',
                        'item_id' => $item->item_id,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total_price' => $totalPrice,
                    ]);

                    $totalAmount += $totalPrice;
                    }
                }
            }

            if ($request->has('print_jobs')) {
                foreach ($request->print_jobs as $index => $printJobData) {
                    $price = $this->calculatePrice((object) $printJobData);
                    $quantity = $printJobData['number_of_copies'];
                    $totalPrice = $price * $quantity;


                    $printFilePath = $this->handleFileUpload($request, "print_jobs.{$index}.print_file");
                    if (!$printFilePath) {
                        throw new \Exception('Print file is required');
                    }

                    $cdFilePath = null;
                    if (isset($printJobData['cd']) && $printJobData['cd'] == '1') {
                        $cdFilePath = $this->handleFileUpload($request, "print_jobs.{$index}.cd_file");
                    }

                    $printJob = PrintJob::create([
                        'print_file_path' => $printFilePath,
                        'cover_type' => $printJobData['cover_type'] ?? null,
                        'cover_color' => $printJobData['cover_color'] ?? null,
                        'paper_size' => $printJobData['paper_size'] ?? 'A4',
                        'color_type' => $printJobData['color_type'],
                        'number_of_pages' => $printJobData['number_of_pages'],
                        'number_of_copies' => $printJobData['number_of_copies'],
                        'orientation' => $printJobData['orientation'] ?? 'portrait',
                        'price' => $price,
                        'cd' => $printJobData['cd'] ?? false,
                        'cd_file_path' => $cdFilePath,
                        'notes' => $printJobData['notes'] ?? null,
                    ]);


                    OrderDetail::create([
                        'order_id' => $order->order_id,
                        'product_type' => 'print',
                        'print_job_id' => $printJob->print_job_id,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total_price' => $totalPrice
                    ]);

                    $totalAmount += $totalPrice;
                }
            }
            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

            $this->clearOrderCache();

            return response()->json($order->load('orderDetails'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Order creation failed:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
            return response()->json(['error' => 'Order creation failed', 'message' => $e->getMessage()], 500);
        }
    }

    private function handleFileUpload($request, $key)
    {
        if ($request->hasFile($key)) {
            $file = $request->file($key);
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads/print_jobs', $filename, 'public');

            if (!$path) {
                throw new \Exception("Failed to store file: {$key}");
            }
            return $path;
        }
        return null;
    }

    private function calculatePrice($data)
    {
        $basePrice = 0;
        $totalPrice = 0;


        switch($data->paper_size) {
            case 'A4':
                $basePrice += 700;
                break;
            case 'A4s':
                $basePrice += 800;
                break;
            case 'F4':
                $basePrice += 1000;
                break;
        }

        switch($data->color_type) {
            case 'black_white':
                $basePrice += 0;
                break;
            case 'color':
                $basePrice += 2000;
                break;
        }

        switch ($data->cover_type) {
            case 'soft_cover':
                $totalPrice += 15000;
                break;
            case 'hard_cover':
                $totalPrice += 40000;
                break;
            case 'plastik':
                $totalPrice += 15000;
                break;
            case 'spiral_kawat':
                $totalPrice += 30000;
                break;
            case 'spiral_plastik':
                $totalPrice += 20000;
                break;
        }

        if ($data->cd) {
            $totalPrice += 25000;
        }

        $totalPrice += $basePrice * $data->number_of_pages;

        return $totalPrice;
    }
    public function index(Request $request)
    {
        try {

            $cacheKey = 'orders:' . md5(serialize($request->all()));

            $this->addOrderCacheKey($cacheKey);

            $orders = Cache::remember($cacheKey,300, function () use ($request) {
                $query = Order::with(['orderDetails', 'orderDetails.item', 'orderDetails.printJob', 'user']);

                if (Auth::user()->hasRole('customer')) {
                    $query->where('user_id', Auth::id());
                }

                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }

                if ($request->has('start_date') && $request->has('end_date')) {
                    $query->whereBetween('order_date', [
                        $request->start_date,
                        $request->end_date
                    ]);
                }

                if ($request->has('user_id')) {
                    $query->where('user_id', $request->user_id);
                }

                $sortColumn = $request->get('sort_by', 'order_date');
                $sortDirection = $request->get('sort_direction', 'desc');
                $query->orderBy($sortColumn, $sortDirection);

                $perPage = $request->get('per_page', 10);

                return $query->paginate($perPage);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'orders' => $orders->items(),
                    'pagination' => [
                        'current_page' => $orders->currentPage(),
                        'from' => $orders->firstItem(),
                        'last_page' => $orders->lastPage(),
                        'per_page' => $orders->perPage(),
                        'to' => $orders->lastItem(),
                        'total' => $orders->total(),
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Order index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

     public function updateStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|string|in:new, processing, paid, pickup_ready, finished, canceled, failed'
        ]);

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        $this->clearOrderCache();

        return response()->json(['message' => 'Order status updated successfully', 'order' => $order], 200);
    }
    public function destroy($orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Hapus OrderDetails yang terkait dengan order
        $order->orderDetails()->each(function ($orderDetail) {
            // Hapus PrintJob terkait dengan OrderDetail
            if ($orderDetail->printJob) {
                $orderDetail->printJob->delete(); // Menghapus PrintJob secara manual
            }

            // Hapus OrderDetail
            $orderDetail->delete();
        });

        // Hapus order itu sendiri
        $order->delete();

        // Hapus cache setelah order dihapus
        $this->clearOrderCache();

        return response()->json(['message' => 'Order and related data deleted successfully'], 200);
    }


}
