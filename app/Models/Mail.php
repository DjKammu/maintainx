<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    CONST RC  =  "rc";
    CONST CC  =  "cc";
    CONST BCC = "bcc";

    protected $fillable = [
        'email', 
        'to_type'
    ];


     public static function insert($data,$where = []){

        $insert = Mail::UpdateOrCreate(
            $where, $data
          );

        return $insert;
    }

    // public static function bulkInsert($data,$where = []){

    // 	 foreach ($ccs as $key => $cc) {
    //          Mail::UpdateOrCreate(
    //             ['email' => $recipient],
    //             ['email' => $recipient, 'to_type' => Mail::CC ]
    //           );
    //       }

    //     $insert = Mail::UpdateOrCreate(
    //         $where, $data
    //       );

    //     return $insert;
    // }
}
