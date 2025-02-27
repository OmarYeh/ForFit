<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['country', 'city', 'phone']);
        });
    }
    
};
