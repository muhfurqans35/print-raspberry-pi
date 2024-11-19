<?php

namespace App\Models;

use App\Models\User;
use App\Models\OrderDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id',
        'order_date',
        'total_amount',
        'status',
    ];
    // relasi untuk satu order hanya punya satu user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // relasi untuk satu order punya banyak order detail
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
}
