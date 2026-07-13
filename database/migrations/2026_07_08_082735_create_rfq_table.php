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
        Schema::create('rfqs', function (Blueprint $table) {
            $table->id();
            // This links the RFQ directly to the approved PR!
            $table->foreignId('purchase_request_id')->constrained()->cascadeOnDelete(); 
            
            // Header Info
            $table->string('mode_of_procurement')->nullable();
            $table->string('rfq_no')->nullable(); // Blank for future use
            $table->date('date')->nullable();
            
            // Supplier Info (Left blank when generating the initial form)
            $table->string('company_name')->nullable();
            $table->string('address')->nullable();
            $table->string('philgeps_registration_no')->nullable();
            
            // Deadlines & Signatories
            $table->dateTime('submission_deadline')->nullable();
            $table->string('authorized_signatory')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rfqs');
    }
};
