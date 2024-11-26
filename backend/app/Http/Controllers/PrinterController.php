<?php

namespace App\Http\Controllers;

use App\Models\Printer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PrinterController extends Controller
{
    // Menampilkan daftar printer dan print job
    public function printindex()
    {
        $printers = Printer::with('printJob')->get();
        return response()->json($printers);
    }
    public function Index()
    {
        return Printer::all();
    }


    // Menyimpan printer baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $printer = Printer::create($request->all());
        return response()->json($printer, 201);
    }

    // Menampilkan printer berdasarkan ID
    public function show($id)
    {
        $printer = Printer::with('printJob')->findOrFail($id);
        return response()->json($printer);
    }

    // Memperbarui data printer
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'print_job_id' => 'nullable|exists:print_jobs,print_job_id',
        ]);

        $printer = Printer::findOrFail($id);
        $printer->update($request->all());

        return response()->json($printer);
    }

    // Menghapus printer
    public function destroy($id)
    {
        $printer = Printer::findOrFail($id);
        $printer->delete();

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
