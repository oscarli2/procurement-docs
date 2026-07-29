<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE ppmp_items MODIFY size TEXT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE ppmp_items MODIFY size VARCHAR(255) NULL');
    }
};
