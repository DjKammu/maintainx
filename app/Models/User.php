<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Gate;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function leads()
    {
        return $this->hasMany('App\Models\Lead', 'user_id', 'id');
    }


    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_users')->withTimestamps();
    }
   
    /**
     * Checks if User is Admin.
     */
     
     public function isAdmin(){
        return (auth()->user()->id == 1) ?? false;
     }

     /**
     * Checks if User has access to $permissions.
     */
    public function hasAccess(string $permissions) : bool
    {
        // check if the permission is available in any role
        foreach ($this->roles as $role) {
            if($role->hasAccess($permissions)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if the user belongs to role.
     */
    public function inRole(string $roleSlug)
    {
        return $this->roles()->where('slug', $roleSlug)->count() == 1;
    }

    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_users')->withTimestamps();
    }

    public static function  userProperties(){
       $user = auth()->user();
       
       if(Gate::allows('administrator') || $user->is_all == Property::ALL) {
             return;
       }
       
       $properties = $user->properties()->pluck('properties.id')->toArray();

       return  ($properties) ? $properties : [0];

    }

    public static function propertyBelongsToUser($id){
        $properties = self::userProperties();
        return in_array($id, $properties);
    }
}
