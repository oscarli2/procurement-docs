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
        Schema::create('ppmp_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppmp_id')->constrained('ppmps')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->string('type')->nullable();
            $table->string('quantity')->nullable();
            $table->string('size')->nullable();
            $table->string('mode')->nullable();
            $table->string('pre_procurement')->nullable();
            $table->string('start')->nullable();
            $table->string('end')->nullable();
            $table->string('delivery')->nullable();
            $table->string('source')->nullable();
            $table->string('budget')->nullable();
            $table->string('supporting')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp_items');
    }
};
