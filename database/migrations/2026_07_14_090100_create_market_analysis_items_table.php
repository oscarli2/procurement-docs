<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_analysis_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('market_analysis_id')->constrained()->cascadeOnDelete();
            $table->string('unit')->nullable();
            $table->text('item_description');
            $table->decimal('qty', 12, 2)->nullable();
            $table->decimal('supplier_price', 12, 2)->nullable();
            $table->unsignedSmallInteger('markup_amount')->nullable();
            $table->decimal('adjusted_price', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_analysis_items');
    }
};