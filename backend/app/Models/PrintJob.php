<?php

namespace App\Models;

use App\Models\OrderDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrintJob extends Model
{
    use HasFactory;

    protected $primaryKey = 'print_job_id';

    protected $fillable = [
        'print_file_path',
        'cover_type',
        'cover_color',
        'paper_size',
        'color_type',
        'number_of_pages',
        'number_of_copies',
        'orientation',
        'cd',
        'cd_file_path',
        'notes',
        'price',
    ];

    // relasi untuk satu print job hanya punya satu order detail
    public function orderDetail()
    {
        return $this->hasOne(OrderDetail::class, 'print_job_id');
    }
    // Relasi Many-to-Many dengan Printer
    public function printers()
    {
        return $this->belongsToMany(Printer::class, 'printer_print_job', 'print_job_id', 'printer_id');
    }
}
