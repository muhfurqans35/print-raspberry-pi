<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Exception;

class FileController extends Controller
{
    public function preview(Request $request)
    {
        try {
            $request->validate([
                'path' => 'required|string'
            ]);

            // Clean and decode the path
            $filePath = $this->cleanPath($request->query('path'));

            // Security check
            if (!$this->isPathAllowed($filePath)) {
                return response()->json([
                    'message' => 'Access denied to this file location'
                ], 403);
            }

            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'message' => 'File not found: ' . $filePath
                ], 404);
            }

            $mimeType = Storage::disk('public')->mimeType($filePath);

            if ($this->isPreviewable($mimeType)) {
                $file = Storage::disk('public')->get($filePath);

                return Response::make($file, 200, [
                    'Content-Type' => $mimeType,
                    'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
                ]);
            }

            return response()->json([
                'filename' => basename($filePath),
                'size' => Storage::disk('public')->size($filePath),
                'mime_type' => $mimeType,
                'message' => 'This file type cannot be previewed directly'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error processing file: ' . $e->getMessage()
            ], 500);
        }
    }

    public function download(Request $request)
    {
        try {
            $request->validate([
                'path' => 'required|string'
            ]);

            // Clean and decode the path
            $filePath = $this->cleanPath($request->query('path'));

            if (!$this->isPathAllowed($filePath)) {
                return response()->json([
                    'message' => 'Access denied to this file location'
                ], 403);
            }

            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'message' => 'File not found: ' . $filePath
                ], 404);
            }

            $filename = basename($filePath);

            return Storage::disk('public')->download($filePath, $filename, [
                'Cache-Control' => 'no-cache'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error downloading file: ' . $e->getMessage()
            ], 500);
        }
    }

    private function cleanPath($path)
    {
        $path = urldecode($path);
        $path = preg_replace('/^2F/', '', $path);
        $path = preg_replace('#/+#', '/', $path);
        return trim($path, '/');
    }

    private function isPathAllowed($path)
    {
        $allowedPaths = [
            'print_jobs',
            'uploads',
            'public/documents',
            'uploads/print_jobs',
            'storage',
        ];

        foreach ($allowedPaths as $allowedPath) {
            if (str_starts_with($path, $allowedPath)) {
                return true;
            }
        }

        return false;
    }

    private function isPreviewable($mimeType)
    {
        $previewableMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
            'text/plain',
            'text/csv',
            'text/html',
            'application/json'
        ];

        return in_array($mimeType, $previewableMimeTypes);
    }
}
