<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Exception;

class ProfileController extends Controller
{
    public function update(ProfileRequest $request): JsonResponse
    {
        $user = Auth::user();

        try {
            // Update profile data first
            $user->update([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'address' => $request->input('address'),
                'province' => $request->input('province'),
                'city' => $request->input('city'),
                'district' => $request->input('district'),
                'subdistrict' => $request->input('subdistrict'),
                'postcode' => $request->input('postcode'),
                'phone' => $request->input('phone'),
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');

                // Validasi tipe file untuk memastikan hanya gambar yang diterima
                if (!$file->isValid() || !in_array($file->extension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                    return response()->json(['error' => 'File harus berupa gambar dengan ekstensi jpg, jpeg, png, atau gif.'], 422);
                }

                // Delete old image if exists
                if ($user->image) {
                    Storage::disk('public')->delete($user->image);
                }

                // Store the new image with a unique filename
                $imagePath = $file->storeAs('images', uniqid() . '.' . $file->extension(), 'public');

                Log::info('Image stored at path:', [$imagePath]);

                // Save the image path to the user model
                $user->update(['image' => $imagePath]);
            }

            // Handle password update if provided
            if ($request->filled('password')) {
                $user->update(['password' => bcrypt($request->input('password'))]);
            }

            return response()->json(['message' => 'Profile updated successfully.']);

        } catch (Exception $e) {
            Log::error('Failed to update profile:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update profile. Please try again later.'], 500);
        }
    }
}
