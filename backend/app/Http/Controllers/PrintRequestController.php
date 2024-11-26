<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Printer;
use App\Models\PrintJob;
use Illuminate\Support\Facades\Log;

class PrintRequestController extends Controller
{
    public function submitPrint(Request $request)
    {
        // Validasi input printer_id dan print_job_id
        $validated = $request->validate([
            'printer_id' => 'required|exists:printers,printer_id',
            'print_job_id' => 'required|exists:print_jobs,print_job_id',
        ]);

        try {
            // Ambil data printer dan print job berdasarkan id
            $printer = Printer::findOrFail($validated['printer_id']);
            $printJob = PrintJob::findOrFail($validated['print_job_id']);

            // Membentuk path file dari storage public
            $filePath = storage_path('app/public/' . $printJob->print_file_path);

            // Pastikan file ada
            if (!file_exists($filePath)) {
                return response()->json([
                    'message' => 'Print file not found',
                    'file_path' => $filePath
                ], 404);
            }

            // Cek MIME type file
            $mimeType = mime_content_type($filePath);
            $allowedMimeTypes = [
                'application/pdf',
                'text/plain'
            ];

            if (!in_array($mimeType, $allowedMimeTypes)) {
                return response()->json([
                    'message' => 'Unsupported file type',
                    'mime_type' => $mimeType
                ], 415);
            }

            // Persiapkan data untuk request API Go
            $dataToSend = [
                'printer_name' => $printer->name,
                'file_path' => $printJob->print_file_path,
                'copies' => (int)($printJob->copies ?? 1),
                'paper_size' => $printJob->paper_size ?? 'A4',
                'orientation' => $printJob->orientation ?? 'portrait',
                'color_mode' => $printJob->color_mode ?? 'color',
            ];

            // Kirim request ke Go API server dengan timeout yang lebih pendek
            $response = Http::timeout(5)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json'
                ])
                ->post(config('printing.go_api_url', 'http://192.168.1.31:8080/api/print'), $dataToSend);

            // Log response dari Go server
            Log::info('Go server response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                // Update status print job menjadi processing
                $printJob->update([
                    'status' => 'processing',
                    'submitted_at' => now(),
                ]);

                return response()->json([
                    'message' => 'Print request submitted successfully',
                    'status' => 'processing',
                    'job_id' => $printJob->print_job_id,
                    'printer' => $printer->name
                ]);
            }

            return response()->json([
                'message' => 'Failed to submit print request',
                'error' => $response->body()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Print submission error', [
                'error' => $e->getMessage(),
                'print_job_id' => $printJob->print_job_id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error processing print request',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
