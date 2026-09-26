<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'books';

    protected $fillable = [
        'judul',
        'pengarang',
        'gambar',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];
}