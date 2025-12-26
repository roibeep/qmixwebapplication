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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Yes/No Questions (q1-q4)
            $table->string('q1'); // yes or no
            $table->string('q2'); // yes or no
            $table->string('q3'); // yes or no
            $table->string('q4'); // yes or no
            
            // Rating Questions (q5-q6)
            $table->integer('q5'); // 1-5 rating
            $table->integer('q6'); // 1-5 rating
            
            // Essay Questions (q7-q10) - NOW REQUIRED
            $table->text('q7'); // Required
            $table->text('q8'); // Required
            $table->text('q9'); // Required
            $table->text('q10'); // Required
            
            // Status and metadata
            $table->string('status')->default('pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};