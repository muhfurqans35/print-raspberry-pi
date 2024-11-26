<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id('order_detail_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->enum('product_type', ['print', 'item']);
            $table->unsignedBigInteger('print_job_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->integer('quantity');
            $table->decimal('price', 12);
            $table->decimal('total_price', 12);
            $table->timestamps();
            $table->foreign('print_job_id')->references('print_job_id')->on('print_jobs')->onDelete('set null');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
