<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class Vendor extends Model
{
     use HasFactory, MediaManager, SoftDeletes; 

    CONST VENDOR_ATTACHMENTS = "vendor_attachments";

    protected $fillable = [
        'company_name', 'name', 'address', 'city',
        'state', 'zip', 'phone_number','email',
        'notes'
    ];
}
