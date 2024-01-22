<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'preferenceable_id', 'preferenceable_type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function preferenceable()
    {
        return $this->morphTo();
    }
}