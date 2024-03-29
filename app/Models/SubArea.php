<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class SubArea extends Model
{
    use HasFactory, MediaManager, SoftDeletes;
    CONST AREA_LAYOUT_ATTACHMENTS = "area_layout_attachments";

    protected $fillable = [
        'name', 
        'property_id',
        'area_id',
        'notes'
    ];

    public function property()
    {
        return $this->hasOne('App\Models\Property', 'id', 'property_id');
    }

    public function area()
    {
        return $this->hasOne('App\Models\Area', 'id', 'area_id');
    }

    public function asset()
    {
        return $this->belongsTo('App\Models\AssetModel', 'id', 'sub_area_id');
    }

    public function payment()
    {
        return $this->belongsTo('App\Models\Payment', 'id', 'sub_area_id');
    }

    public function setPropertyIdAttribute($value)
    {
         $this->attributes['property_id'] =  ($value == 'null') ? NULL :  $value;
    }

    public function setAreaIdAttribute($value)
    {
        $this->attributes['area_id'] =  ($value == 'null') ? NULL :  $value;
    }
}
