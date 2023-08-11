<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

     protected $fillable = [
        'name', 
        'property_id'
    ];

    public function property()
    {
        return $this->hasOne('App\Models\Property', 'id', 'property_id');
    }
    
    public function setPropertyIdAttribute($value)
	{
		 return ($value == 'null') ? NULL :  $value; 
	}
    
    
}
 