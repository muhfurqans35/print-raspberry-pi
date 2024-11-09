<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Printer;
use App\Models\PrintJob;

class PrintRequestController extends Controller
{
    public function submitPrint(Request $request)
    {
        // Validasi data yang diterima
        $validated = $request->validate([
            'printer_id' => 'required|exists:printers,printer_id',
            'print_job_id' => 'required|exists:print_jobs,print_job_id',
        ]);

        // Ambil data printer berdasarkan ID
        $printer = Printer::find($validated['printer_id']);

        // Ambil data print job berdasarkan ID
        $printJob = PrintJob::find($validated['print_job_id']);

        // Pastikan data printer dan print job ditemukan
        if (!$printer || !$printJob) {
            return response()->json(['message' => 'Printer or Print Job not found'], 404);
        }

        // Persiapkan data untuk dikirim ke server Go
        $dataToSend = [
            'printer_name' => $printer->name,
            'file_path' => $printJob->file_path, // Path file yang diambil dari tabel print_jobs
            'copies' => $printJob->copies,
            'paper_size' => $printJob->paper_size,
            'orientation' => $printJob->orientation,
            'color_mode' => $printJob->color_mode,
        ];

        // Kirim request ke API server Go yang menjalankan CUPS
        $response = Http::post('http://192.168.1.31:8080/api/print', $dataToSend);

        // Cek apakah request berhasil
        if ($response->successful()) {
            return response()->json(['message' => 'Print request submitted successfully']);
        }

        // Jika gagal, beri response error
        return response()->json(['message' => 'Failed to submit print request'], 500);
    }
}
