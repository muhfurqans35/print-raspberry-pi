<?php
namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class ItemController extends Controller
{
    public function index()
    {
        $cacheKey = 'items_all';

        // Cek cache, jika tidak ada baru ambil dari database
        $items = Cache::remember($cacheKey, now()->addMinutes(30), function () {
            return Item::all();
        });

        return response()->json($items, 200);
    }

    public function store(ItemRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = $imagePath;
        }

        $item = Item::create($validatedData);

        // Setelah item baru dibuat, hapus cache yang ada
        Cache::forget('items_all'); // Hapus cache semua item

        return response()->json($item, 201);
    }

    public function update(ItemRequest $request, $id)
    {
        $item = Item::findOrFail($id);
        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = $imagePath;
        }

        $item->update($validatedData);

        // Setelah item diperbarui, hapus cache yang ada
        Cache::forget('items_all'); // Hapus cache semua item

        return response()->json($item, 200);
    }

    public function show($id)
    {
        $item = Item::findOrFail($id);
        return response()->json($item, 200);
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }
        $item->delete();

        // Setelah item dihapus, hapus cache yang ada
        Cache::forget('items_all'); // Hapus cache semua item

        return response()->json(null, 204);
    }
}
