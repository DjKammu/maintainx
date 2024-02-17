<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;
    
    CONST ACTIVE = '1';
    
    protected $fillable = [
        'name', 
        'slug', 
        'account_number',
        'property_type_id', 
        'property_id', 
        'area_id',
        'sub_area_id',
        'active'
    ];

    public function property_type()
    {
        return $this->hasOne('App\Models\PropertyType', 'id', 'property_type_id');
    }

    public function property()
    {
        return $this->hasOne('App\Models\Property', 'id', 'property_id');
    }

    public function area()
    {
        return $this->hasOne('App\Models\Area', 'id', 'area_id');
    }

    public function sub_area()
    {
        return $this->hasOne('App\Models\SubArea', 'id', 'sub_area_id');
    }

    public function setPropertyTypeIdAttribute($value)
    {
        $this->attributes['property_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setPropertyIdAttribute($value)
    {
         $this->attributes['property_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setAreaIdAttribute($value)
    {
        $this->attributes['area_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setSubAreaIdAttribute($value)
    {
        $this->attributes['sub_area_id'] =  ($value == 'null') ? NULL :  $value;
    }
}
