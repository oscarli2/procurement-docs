<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('market_analysis_items', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('market_analysis_id');
        });

        Schema::table('purchase_request_items', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('purchase_request_id');
        });

        Schema::table('rfq_items', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('rfq_id');
        });

        Schema::table('ppmp_items', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('ppmp_id');
        });

        foreach (['market_analysis_items', 'purchase_request_items', 'rfq_items', 'ppmp_items'] as $table) {
            $rows = DB::table($table)->orderBy('id')->get();
            $groups = $rows->groupBy(fn ($row) => match ($table) {
                'market_analysis_items' => $row->market_analysis_id,
                'purchase_request_items' => $row->purchase_request_id,
                'rfq_items' => $row->rfq_id,
                'ppmp_items' => $row->ppmp_id,
            });

            foreach ($groups as $items) {
                foreach ($items->values() as $index => $item) {
                    DB::table($table)
                        ->where('id', $item->id)
                        ->update(['sort_order' => $index]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::table('market_analysis_items', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('purchase_request_items', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('rfq_items', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        Schema::table('ppmp_items', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
