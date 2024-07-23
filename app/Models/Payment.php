<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;
use Carbon\Carbon;

class Payment extends Model
{
     use HasFactory, MediaManager, SoftDeletes;

    CONST PAYMENT_ATTACHMENTS = "payment_attachments";

    protected $fillable = [
        'asset_type_id','asset_model_id','asset_serial_number',
        'vendor_id','contractor_id','property_type_id',
        'property_id','area_id','sub_area_id',
        'tenant_id',
        'work_type_id',
        'notes','payment','payment_date',
        'brand','description','non_asset'
    ];

    public function property()
    {
        return $this->hasOne('App\Models\Property', 'id', 'property_id');
    }

    public function area()
    {
        return $this->hasOne('App\Models\Area', 'id', 'area_id');
    }

    public function asset_type()
    {
        return $this->hasOne('App\Models\AssetType', 'id', 'asset_type_id');
    }

    public function asset_model()
    {
        return $this->hasOne('App\Models\AssetModel', 'id', 'asset_model_id');
    }

    public function vendor()
    {
        return $this->hasOne('App\Models\Vendor', 'id', 'vendor_id');
    }

    public function contractor()
    {
        return $this->hasOne('App\Models\Contractor', 'id', 'contractor_id');
    }

    public function property_type()
    {
        return $this->hasOne('App\Models\PropertyType', 'id', 'property_type_id');
    }

    public function sub_area()
    {
        return $this->hasOne('App\Models\SubArea', 'id', 'sub_area_id');
    } 

    public function tenant()
    {
        return $this->hasOne('App\Models\Tenant', 'id', 'tenant_id');
    }

    public function work_type()
    {
        return $this->hasOne('App\Models\WorkType', 'id', 'work_type_id');
    }

    public function setPropertyIdAttribute($value)
    {
        $this->attributes['property_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setAreaIdAttribute($value)
    {
        $this->attributes['area_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setAssetTypeIdAttribute($value)
    {
        $this->attributes['asset_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setAssetModelIdAttribute($value)
    {
        $this->attributes['asset_model_id'] =  ($value == 'null') ? NULL :  $value;
    }

     public function setVendorIdAttribute($value)
    {
        $this->attributes['vendor_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setContractorIdAttribute($value)
    {
        $this->attributes['contractor_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setPropertyTypeIdAttribute($value)
    {
        $this->attributes['property_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setSubAreaIdAttribute($value)
    {
        $this->attributes['sub_area_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setTenantIdAttribute($value)
    {
        $this->attributes['tenant_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setWorkTypeIdAttribute($value)
    {
        $this->attributes['work_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setPaymentAttribute($value)
    {
        $this->attributes['payment'] =  ($value == 'null') ? NULL :  str_replace( ',', '', $value );
    }


    public function setPaymentDateAttribute($value)
    {
        $this->attributes['payment_date'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function setNotesAttribute($value)
    {
        $this->attributes['notes'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function getPaymentAttribute($value)
    {
        return  ($value) ? number_format($value, 2, '.', ',') : NULL;
    }

    public function getPaymentDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    }

     public static function format($num){
        return number_format($num, 2, '.', ',');
        return preg_replace("/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/i", "$1,", $num);
    }

}
