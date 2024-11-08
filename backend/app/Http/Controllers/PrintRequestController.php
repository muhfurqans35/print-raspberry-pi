<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PrintRequestController extends Controller
{
    public function submitPrint(Request $request)
    {
        $validated = $request->validate([
            'printer_id' => 'required|exists:printers,printer_id',
            'print_job_id' => 'required|exists:print_jobs,print_job_id',
        ]);

        // Kirim request ke API server Go yang menjalankan CUPS
        $response = Http::post('http://raspberry-pi-ip:8080/print', $validated);

        if ($response->successful()) {
            return response()->json(['message' => 'Print request submitted successfully']);
        }

        return response()->json(['message' => 'Failed to submit print request'], 500);
    }
}

