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
        'state', 'zip', 'phone_number','notes'
    ];
     
    public function users()
    {
        return $this->belongsToMany(User::class, 'property_users')->withTimestamps();
    }
}
