<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserManagementStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Sesuaikan dengan kebijakan akses
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'subdistrict' => 'nullable|string|max:255',
            'postcode' => 'nullable|string|max:10',
        ];
    }
}
