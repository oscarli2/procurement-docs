<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('market_analyses', function (Blueprint $table) {
            if (! Schema::hasColumn('market_analyses', 'company_name')) {
                $table->string('company_name')->nullable()->after('date');
            }

            if (! Schema::hasColumn('market_analyses', 'address')) {
                $table->string('address')->nullable()->after('company_name');
            }

            if (! Schema::hasColumn('market_analyses', 'bir_registration')) {
                $table->string('bir_registration')->nullable()->after('address');
            }

            if (! Schema::hasColumn('market_analyses', 'philgeps')) {
                $table->string('philgeps')->nullable()->after('bir_registration');
            }

            if (! Schema::hasColumn('market_analyses', 'contact_person')) {
                $table->string('contact_person')->nullable()->after('philgeps');
            }

            if (! Schema::hasColumn('market_analyses', 'mobile_no')) {
                $table->string('mobile_no')->nullable()->after('contact_person');
            }

            if (! Schema::hasColumn('market_analyses', 'signature')) {
                $table->string('signature')->nullable()->after('mobile_no');
            }
        });

        Schema::table('market_analysis_items', function (Blueprint $table) {
            if (! Schema::hasColumn('market_analysis_items', 'qty')) {
                $table->decimal('qty', 12, 2)->nullable()->after('item_description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('market_analyses', function (Blueprint $table) {
            $columns = ['company_name', 'address', 'bir_registration', 'philgeps', 'contact_person', 'mobile_no', 'signature'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('market_analyses', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('market_analysis_items', function (Blueprint $table) {
            if (Schema::hasColumn('market_analysis_items', 'qty')) {
                $table->dropColumn('qty');
            }
        });
    }
};