<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class Contractor extends Model
{
    use HasFactory, MediaManager, SoftDeletes;

    CONST CONTRACTOR_ATTACHMENTS = "contractor_attachments";

    protected $fillable = [
        'company_name', 'name', 'address', 'city',
        'state', 'zip', 'phone_number','email',
        'notes'
    ];
}
