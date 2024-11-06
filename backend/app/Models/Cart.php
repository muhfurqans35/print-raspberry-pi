<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $primaryKey = 'cart_id';

    protected $fillable = ['user_id', 'product_type', 'print_job_id', 'item_id', 'quantity', 'price'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

   // Fungsi untuk relasi dengan PrintJob
   public function printJob()
   {
       return $this->belongsTo(PrintJob::class, 'print_job_id', 'print_job_id');
   }

   // Fungsi untuk relasi dengan Item
   public function item()
   {
       return $this->belongsTo(Item::class, 'item_id', 'item_id');
   }

   // Custom accessor untuk mendapatkan produk berdasarkan product_type
   public function getProductAttribute()
   {
       if ($this->product_type === 'print' && $this->print_job_id) {
           return $this->printJob; // Mengembalikan instance PrintJob
       } elseif ($this->product_type === 'item' && $this->item_id) {
           return $this->item; // Mengembalikan instance Item
       }

       return null; // Jika tidak ada product yang cocok
   }
}
