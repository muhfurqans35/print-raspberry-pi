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
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id'); // Primary key
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Reference to users table
            $table->enum('product_type', ['print', 'item']); // Indicates whether it's a print job or an item

            // Two separate foreign keys
            $table->unsignedBigInteger('print_job_id')->nullable(); // Foreign key to print_jobs
            $table->unsignedBigInteger('item_id')->nullable(); // Foreign key to items

            $table->integer('quantity'); // Quantity of the product
            $table->decimal('price', 10, 2); // Price for the quantity added to the cart
            $table->timestamps(); // Created at and updated at timestamps

            // Adding foreign key constraints
            $table->foreign('print_job_id')->references('print_job_id')->on('print_jobs')->onDelete('cascade');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
