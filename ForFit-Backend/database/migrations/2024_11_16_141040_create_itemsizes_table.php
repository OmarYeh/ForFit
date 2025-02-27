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
        Schema::create('itemsizes', function (Blueprint $table) {
            $table->id();
            $table->string('garment_type');
            $table->string('size_label');
            $table->float('chest_size')->nullable();
            $table->float('waist')->nullable();
            $table->float('hip')->nullable();
            $table->float('height')->nullable();
            $table->float('length')->nullable();
            $table->float('neck_size')->nullable();
            $table->float('sleeve_length')->nullable();
            $table->float('shoulder_width')->nullable();
            $table->float('inseam_length')->nullable();
            $table->float('leg_opening')->nullable();
            $table->float('bust')->nullable();
            $table->float('waist_to_hem')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item-sizes');
    }
};
