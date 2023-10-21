<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class Area extends Model
{
     use HasFactory, MediaManager; 

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
          $this->attributes['property_id'] =  ($value == 'null') ? NULL :  $value;
	}
    
    
}
 