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
        Schema::create('ppmps', function (Blueprint $table) {
            $table->id();
            $table->integer('fiscal_year')->nullable();
            $table->string('end_user')->nullable();
            $table->string('prepared_by_name')->nullable();
            $table->string('prepared_by_designation')->nullable();
            $table->string('submitted_by_name')->nullable();
            $table->string('submitted_by_designation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmps');
    }
};
