<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'url'];

    public function articles()
    {
        return $this->hasMany(Article::class, 'source_id');
    }
}