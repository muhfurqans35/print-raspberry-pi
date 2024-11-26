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
        Schema::create('printer_print_job', function (Blueprint $table) {
            $table->id('print_id');
            $table->foreignId('printer_id')->constrained('printers', 'printer_id')->onDelete('cascade');
            $table->foreignId('print_job_id')->constrained('print_jobs', 'print_job_id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('printer_print_job');
    }
};
