<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'published_at', 'source_id', 'category_id', 'author_id'];

    public function source()
    {
        return $this->belongsTo(Source::class, 'source_id');
    }

    // Relationship with Category model
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Relationship with Author model
    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }
}