<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class Property extends Model
{
     use HasFactory, MediaManager, SoftDeletes;
     
     CONST LAYOUT_ATTACHMENTS = "layout_attachments";
     CONST ALL = "all";

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

    public function area()
    {
        return $this->belongsTo('App\Models\Area','id','property_id');
    }

    public function setPropertyTypeIdAttribute($value)
    {
        $this->attributes['property_type_id'] =  ($value == 'null') ? NULL :  $value;
    }
}
