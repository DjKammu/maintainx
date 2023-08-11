<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;
    

    CONST PROPERTY     = 'Property';
    CONST CONTRACTOR  = 'Contractor';
    CONST VENDOR  = 'Vendor';
    CONST AREA  = 'Area';

    protected $fillable = [
        'name', 
        'slug', 
        'account_number'
    ];

    public static $notEditable = [
      self::PROPERTY , self::CONTRACTOR, self::VENDOR,
       self::AREA
    ];
}
