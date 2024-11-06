<?php

namespace App\Models;

use App\Models\Item;
use App\Models\Order;
use App\Models\PrintJob;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_detail_id';

    protected $fillable = [
        'order_id',
        'product_type',
        'item_id',
        'print_job_id',
        'quantity',
        'price',
        'total_price',
    ];
    // relasi untuk satu order detail hanya punya satu order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    // relasi untuk satu order detail hanya punya satu print job
    public function printJob()
    {
        return $this->belongsTo(PrintJob::class, 'print_job_id');
    }

    // relasi untuk satu order detail hanya punya satu item
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
