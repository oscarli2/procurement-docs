<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('market_analyses', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('date');
            $table->string('address')->nullable()->after('company_name');
            $table->string('bir_registration')->nullable()->after('address');
            $table->string('philgeps')->nullable()->after('bir_registration');
            $table->string('contact_person')->nullable()->after('philgeps');
            $table->string('mobile_no')->nullable()->after('contact_person');
            $table->string('signature')->nullable()->after('mobile_no');
        });

        Schema::table('market_analysis_items', function (Blueprint $table) {
            $table->decimal('qty', 12, 2)->nullable()->after('item_description');
        });
    }

    public function down(): void
    {
        Schema::table('market_analyses', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'address',
                'bir_registration',
                'philgeps',
                'contact_person',
                'mobile_no',
                'signature',
            ]);
        });

        Schema::table('market_analysis_items', function (Blueprint $table) {
            $table->dropColumn('qty');
        });
    }
};