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

class OrderController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware(['auth:sanctum']);
    // }
    public function store(OrderRequest $request)
    {
        DB::beginTransaction();

        try {
            // Hitung total amount dari item dan pekerjaan cetak
            $totalAmount = 0;

            // Buat order baru
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_date' => now(),
                'total_amount' => 0, // Di-update nanti setelah semua total harga dikalkulasi
                'status' => 'new',
            ]);
            if ($request->has('items')) {
            foreach ($request->items as $itemData) {
                $itemId = $itemData['item_id'] ?? null;
                if ($itemId) {
                    $item = Item::findOrFail($itemId);// Gunakan findOrFail untuk penanganan error
                    $quantity = $itemData['quantity'];
                    $price = $item->price;
                    $totalPrice = $price * $quantity;

                    // Simpan detail item ke dalam order_detail
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
          // Process print jobs
            if ($request->has('print_jobs')) {
                foreach ($request->print_jobs as $index => $printJobData) {
                    $price = $this->calculatePrice((object) $printJobData);
                    $quantity = $printJobData['number_of_copies'];
                    $totalPrice = $price * $quantity;

                    // Handle file uploads
                    $printFilePath = $this->handleFileUpload($request, "print_jobs.{$index}.print_file");
                    if (!$printFilePath) {
                        throw new \Exception('Print file is required');
                    }

                    $cdFilePath = null;
                    if (isset($printJobData['cd']) && $printJobData['cd'] == '1') {
                        $cdFilePath = $this->handleFileUpload($request, "print_jobs.{$index}.cd_file");
                    }

                    // Create print job first
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

                    // Then create order detail referencing the print job
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
            // Update total amount pada order
            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

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

            // Generate a unique filename
            $filename = uniqid() . '_' . $file->getClientOriginalName();

            // Store the file and get the path
            $path = $file->storeAs('uploads/print_jobs', $filename, 'public');

            if (!$path) {
                throw new \Exception("Failed to store file: {$key}");
            }

            // Return the full path that was stored
            return $path;
        }
        return null;
    }

    private function calculatePrice($data)
    {
        $basePrice = 0;
        $totalPrice = 0;

        // Contoh perhitungan harga berdasarkan paper size
        switch($data->paper_size) {
            case 'A4':
                $basePrice += 700;
                break; // Tambahkan break untuk mencegah fall-through
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
            $totalPrice += 25000; // Tambahan harga jika ada CD
        }

        // Hitung total berdasarkan jumlah halaman
        $totalPrice += $basePrice * $data->number_of_pages;

        return $totalPrice;
    }
    public function index(Request $request)
    {
        try {
            // Start with base query
            $query = Order::with(['orderDetails', 'orderDetails.item', 'orderDetails.printJob', 'user']);

            if(Auth::user()->hasRole('customer')) {
                // Filter by authenticated user
                $query->where('user_id', Auth::id());
            }

            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by date range if provided
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('order_date', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            // Filter by user if provided
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // Sort by column and direction
            $sortColumn = $request->get('sort_by', 'order_date');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortColumn, $sortDirection);

            // Get paginated results
            $perPage = $request->get('per_page', 10);
            $orders = $query->paginate($perPage);


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
                    ]
                ]
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
        // Validasi input status
        $request->validate([
            'status' => 'required|string|in:new,accepted,printing,printed,pickup_ready,canceled,finished,failed'
        ]);

        // Temukan order berdasarkan ID
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update status order
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully', 'order' => $order], 200);
    }
}
