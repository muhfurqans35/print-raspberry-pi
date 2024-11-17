<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
    public function index()
    {
        return response()->json(Item::all(), 200);
    }

    public function store(ItemRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = $imagePath;
        }

        $item = Item::create($validatedData);
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
        return response()->json(null, 204);
    }
}
