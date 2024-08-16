<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;
use Carbon\Carbon;

class Document extends Model
{
     use HasFactory, MediaManager, SoftDeletes;

     CONST DOCUMENTS = "documents_attachments";

     CONST DOCUMENTS_TYPE = "documents";

    protected $fillable = [
        'document_type_id','asset_type_id', 'brand', 'serial_number', 'model_number',
        'description', 'install_date', 'registration_date','manufactare_date',
        'coverage_term', 'coverage_type', 'start_date', 'end_date',
        'dealer_name', 'property_type_id', 'property_id','area_id',
        'sub_area_id','tenant_id','vendor_id', 'asset_model_id'
    ];

    
    // public function property()
    // {
    //     return $this->hasOne('App\Models\Property', 'id', 'property_id');
    // }

    // public function area()
    // {
    //     return $this->hasOne('App\Models\Area', 'id', 'area_id');
    // }

    public function asset_type()
    {
        return $this->hasOne('App\Models\AssetType', 'id', 'asset_type_id');
    }

    public function asset_model()
    {
        return $this->hasOne('App\Models\AssetModel', 'id', 'asset_model_id');
    }

    public function document_type()
    {
        return $this->hasOne('App\Models\DocumentType', 'id', 'document_type_id');
    } 

    // public function property_type()
    // {
    //     return $this->hasOne('App\Models\PropertyType', 'id', 'property_type_id');
    // }

    // public function sub_area()
    // {
    //     return $this->hasOne('App\Models\SubArea', 'id', 'sub_area_id');
    // } 

    public function tenant()
    {
        return $this->hasOne('App\Models\Tenant', 'id', 'tenant_id');
    }

    public function vendor()
    {
        return $this->hasOne('App\Models\Vendor', 'id', 'vendor_id');
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

    public function setPropertyTypeIdAttribute($value)
    {
        $this->attributes['property_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setDocumentTypeIdAttribute($value)
    {
        $this->attributes['document_type_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setSubAreaIdAttribute($value)
    {
        $this->attributes['sub_area_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setTenantIdAttribute($value)
    {
        $this->attributes['tenant_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setInstallDateAttribute($value)
    {
        $this->attributes['install_date'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function setRegistrationDateAttribute($value)
    {
        $this->attributes['registration_date'] =  ($value == 'null') ? NULL :  $value;
    } 

   public function setManufactareDateAttribute($value)
    {
        $this->attributes['manufactare_date'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function setStartDateAttribute($value)
    {
        $this->attributes['start_date'] =  ($value == 'null') ? NULL :  $value;
    } 

   public function setEndDateAttribute($value)
    {
        $this->attributes['end_date'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function setVendorIdAttribute($value)
    {
        $this->attributes['vendor_id'] =  ($value == 'null') ? NULL :  $value;
    }
    
    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] =  ($value == 'null') ? NULL :  $value;
    }
    
    public function setSerialNumberAttribute($value)
    {
        $this->attributes['serial_number'] =  ($value == 'null') ? NULL :  $value;
    } 
    
    public function setModelNumberAttribute($value)
    {
        $this->attributes['model_number'] =  ($value == 'null') ? NULL :  $value;
    } 

    public function getInstallDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    } 

    public function getRegistrationDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    }

    public function getManufactareDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    } 

    public function getStartDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    }

    public function getEndDateAttribute($value)
    {
        return  ($value) ? Carbon::parse($value)->format('m-d-Y') : NULL;
    }
}
