<?php

namespace App\Http\Controllers;

use App\Models\Printer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class PrinterController extends Controller
{
    public function Index()
    {
        $cacheKey = 'printers:all';
        $printers = Cache::remember($cacheKey, 600, function () {
            return Printer::all();
        });
        return response()->json($printers);
    }


    // Menyimpan printer baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $printer = Printer::create($request->all());
        Cache::forget('printers:all');
        return response()->json($printer, 201);
    }

    // Memperbarui data printer
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $printer = Printer::findOrFail($id);
        $printer->update($request->all());
        Cache::forget('printers:all');

        return response()->json($printer);
    }

    // Menghapus printer
    public function destroy($id)
    {
        $printer = Printer::findOrFail($id);
        $printer->delete();
        Cache::forget('printers:all');

        return response()->json(null, 204);
    }

    public function updateStatus()
    {
        try {
            // Kirim permintaan ke Go untuk mendapatkan status printer
            $response = Http::get('http://192.168.1.31:8080/get-printer-status'); // URL Go Anda

            if ($response->successful()) {
                $printerStatus = $response->json();
                return response()->json([
                    'message' => 'Printer status fetched successfully',
                    'data' => $printerStatus,
                ]);
            }

            return response()->json([
                'error' => 'Failed to fetch printer status from Go',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error communicating with Go backend',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
