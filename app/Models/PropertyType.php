<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'slug', 
        'account_number'
    ];


    public function property()
    {
        return $this->hasOne('App\Models\Property','id');
    }
}
