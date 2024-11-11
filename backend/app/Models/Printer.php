<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Printer extends Model
{
    use HasFactory;

    protected $primaryKey = 'printer_id'; // Menentukan primary key

    protected $fillable = ['name'];

    public function printJobs()
    {
        return $this->belongsToMany(PrintJob::class, 'printer_print_job', 'printer_id', 'print_job_id');
    }
}
