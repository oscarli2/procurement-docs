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
        Schema::create('rfq_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rfq_id')->constrained()->cascadeOnDelete();
            
            // Data copied directly from the PR
            $table->string('unit');
            $table->text('item_description');
            $table->integer('qty');
            $table->decimal('abc_per_item', 15, 2); // Approved Budget Contract (from PR unit cost)
            $table->decimal('total_abc', 15, 2);
            
            // Supplier Offer Data (Left blank initially, for future use)
            $table->string('statement_of_compliance')->nullable();
            $table->decimal('offer_per_item', 15, 2)->nullable();
            $table->decimal('total_offer', 15, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rfq_items');
    }
};
