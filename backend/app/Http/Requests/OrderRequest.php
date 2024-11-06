<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
         return Auth::check();

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
        // Aturan untuk orderdetail
        'type' => 'required|in:print,item',

        // Aturan untuk print_jobs
        'print_jobs' => 'required_if:type,print|array',
        'print_jobs.*.cover_type' => 'nullable|string',
        'print_jobs.*.cover_color' => 'nullable|string',
        'print_jobs.*.paper_size' => 'required_with:print_jobs|string',
        'print_jobs.*.color_type' => 'required_with:print_jobs|string',
        'print_jobs.*.orientation' => 'required_with:print_jobs|string',
        'print_jobs.*.number_of_pages' => 'required_with:print_jobs|integer|min:1',
        'print_jobs.*.number_of_copies' => 'required_with:print_jobs|integer|min:1',
        'print_jobs.*.cd' => 'boolean',
        'print_jobs.*.notes' => 'nullable|string',
        'print_jobs.*.print_file' => 'required_with:print_jobs|file',
        'print_jobs.*.cd_file' => 'required_if:print_jobs.*.cd,true|file',

        // Aturan untuk items
        'items' => 'required_if:type,item|array',
        // 'items.*.item_id' => 'required_with:items|exists:items,id',
        'items.*.quantity' => 'required_with:items|integer|min:1',
        ];
    }
    public function messages()
{
    return [
        'type.required' => 'Tipe pesanan harus ditentukan',
        'type.in' => 'Tipe pesanan tidak valid',

        'print_jobs.required_if' => 'Data print jobs diperlukan untuk tipe pesanan print',
        'print_jobs.*.paper_size.required_with' => 'Ukuran kertas harus diisi',
        'print_jobs.*.paper_size.in' => 'Ukuran kertas tidak valid',
        'print_jobs.*.color_type.required_with' => 'Tipe warna harus diisi',
        'print_jobs.*.color_type.in' => 'Tipe warna tidak valid',
        'print_jobs.*.number_of_pages.required_with' => 'Jumlah halaman harus diisi',
        'print_jobs.*.number_of_pages.integer' => 'Jumlah halaman harus berupa angka',
        'print_jobs.*.number_of_pages.min' => 'Jumlah halaman minimal 1',
        'print_jobs.*.number_of_copies.required_with' => 'Jumlah salinan harus diisi',
        'print_jobs.*.number_of_copies.integer' => 'Jumlah salinan harus berupa angka',
        'print_jobs.*.number_of_copies.min' => 'Jumlah salinan minimal 1',
        'print_jobs.*.print_file.required_with' => 'File untuk dicetak harus diunggah',
        'print_jobs.*.print_file.file' => 'File tidak valid',
        'print_jobs.*.print_file.mimes' => 'Format file harus PDF, DOC, atau DOCX',
        'print_jobs.*.cd_file.required_if' => 'File CD harus diunggah jika opsi CD dipilih',

        'items.required_if' => 'Data items diperlukan untuk tipe pesanan item',
        'items.*.product_id.required_with' => 'ID produk harus diisi',
        'items.*.product_id.exists' => 'Produk tidak ditemukan',
        'items.*.quantity.required_with' => 'Jumlah item harus diisi',
        'items.*.quantity.integer' => 'Jumlah item harus berupa angka',
        'items.*.quantity.min' => 'Jumlah item minimal 1',
    ];
}
}
