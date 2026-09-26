<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'nim',
        'nama',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}