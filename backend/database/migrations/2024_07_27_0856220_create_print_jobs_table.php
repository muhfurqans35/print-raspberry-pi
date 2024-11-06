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
        Schema::create('print_jobs', function (Blueprint $table) {
            $table->id('print_job_id');
            $table->string('print_file_path', 255);
            $table->enum('cover_type', ['plastik', 'soft_cover', 'spiral_kawat', 'spiral_plastik', 'hard_cover'])->nullable();
            $table->string('cover_color', 50)->nullable();
            $table->enum('paper_size', ['A4s','A4','F4'])->nullable();
            $table->enum('color_type', ['color', 'black_white'])->default('black_white');
            $table->integer('number_of_pages')->default(1);
            $table->integer('number_of_copies')->default(1);
            $table->enum('orientation', ['portrait', 'landscape'])->default('portrait');
            $table->integer('price')->unsigned();
            $table->boolean('cd')->nullable(false);
            $table->string('cd_file_path', 255)->nullable();
            $table->string('notes', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('print_jobs');
    }
};
