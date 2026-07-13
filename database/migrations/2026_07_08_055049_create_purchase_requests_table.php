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
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            
            // Header Info
            $table->string('entity_name')->default('DEPARTMENT OF THE INTERIOR & LOCAL GOVERNMENT Region 08');
            $table->string('office_section')->nullable();
            $table->string('pr_no')->nullable(); 
            $table->string('responsibility_center_code')->nullable();
            $table->date('date')->nullable();
            
            // Footer Info
            $table->text('purpose')->nullable();
            
            // Signatories
            $table->string('requested_by_name')->nullable();
            $table->string('requested_by_designation')->nullable();
            $table->string('approved_by_name')->nullable();
            $table->string('approved_by_designation')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
