<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function single(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'folder' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $folder = $request->folder ?? 'uploads';
        $path = $file->store($folder, 's3');

        return $this->success([
            'path' => $path,
            'url' => Storage::disk('s3')->url($path),
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ], 'File uploaded successfully', 201);
    }

    public function multiple(Request $request)
    {
        $request->validate([
            'files.*' => 'required|file|max:10240',
            'folder' => 'nullable|string',
        ]);

        $folder = $request->folder ?? 'uploads';
        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store($folder, 's3');
            $uploaded[] = [
                'path' => $path,
                'url' => Storage::disk('s3')->url($path),
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ];
        }

        return $this->success($uploaded, 'Files uploaded successfully', 201);
    }

    public function presignedUrl(Request $request)
    {
        $request->validate([
            'file_name' => 'required|string',
            'folder' => 'nullable|string',
            'expires_in' => 'nullable|integer|min:1|max:60', // minutes
        ]);

        $folder = $request->folder ?? 'uploads';
        $fileName = $request->file_name;
        $expiresIn = $request->expires_in ?? 5; // default 5 minutes

        $path = $folder.'/'.$fileName;
        $url = Storage::disk('s3')->temporaryUrl($path, now()->addMinutes($expiresIn));

        return $this->success([
            'url' => $url,
            'path' => $path,
            'expires_at' => now()->addMinutes($expiresIn)->toIso8601String(),
        ], 'Presigned URL generated');
    }

    public function destroy($id)
    {
        // This would need a file tracking table
        // For now, just return success
        return $this->success(null, 'File deletion endpoint - implement file tracking');
    }
}
