<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class Property extends Model
{
     use HasFactory, MediaManager; 
     CONST LAYOUT_ATTACHMENTS = "layout_attachments";

      protected $fillable = [
        'name', 'address', 'city',
        'state', 'zip', 'phone_number','notes','property_type_id'
    ];
     
    public function users()
    {
        return $this->belongsToMany(User::class, 'property_users')->withTimestamps();
    }

    public function property_type()
    {
        return $this->hasOne('App\Models\PropertyType', 'id', 'property_type_id');
    }

    public function setPropertyTypeIdAttribute($value)
    {
         return ($value == 'null') ? NULL :  $value; 
    }
}
