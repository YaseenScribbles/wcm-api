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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->foreignId('sale_id');
            $table->foreignId('cloth_id');
            $table->foreignId('color_id');
            $table->double('weight');
            $table->double('actual_weight');
            $table->double('rate');
            $table->double('amount');
            $table->integer('s_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
