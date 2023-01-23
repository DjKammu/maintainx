<?php
namespace App\Http\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use DB;

trait MediaManager {
     
    protected $docType = null;

    public function storeFile($input, $multiple = false, $nameInput = null,$nickNameInput = null){
    	 $fileArr = request()->{$input};
       $nameArr = request()->{$nameInput};
       $nickNameArr = request()->{$nickNameInput};

    	 if(!$multiple){
    	 	$mimeType =  $fileArr->getClientMimeType();
    	 	$name = ($nameArr) ?  $nameArr : @pathinfo($fileArr)['filename'].'_'.time();
        $nick_name = ($nickNameInput) ?  $nickNameInput : $name;   
    	 	$fileName = $this->uniqueFilename(\Str::slug($name).'.'. $fileArr->getClientOriginalExtension());
    	      $fileArr->storeAs($this->path, $fileName, 'media');
            $this->fileName = $fileName; 
            $this->mimeType = $mimeType; 
            $this->name = $name; 
            $this->nick_name = $nick_name; 
    	      $this->saveMedia();
    	 }else{

        foreach ($fileArr as $key => $file) {
          $mimeType =  $file->getClientMimeType();
          $name = (@$nameArr[$key]) ?  $nameArr[$key] : @pathinfo($file)['filename'].'_'.time();
          $nick_name = (@$nickNameArr[$key]) ?  $nickNameArr[$key] : $name ;
          $fileName = $this->uniqueFilename(\Str::slug($name).'.'. $file->getClientOriginalExtension());
              $file->storeAs($this->path, $fileName, 'media');
              $this->fileName = $fileName; 
              $this->mimeType = $mimeType; 
              $this->name = $name; 
              $this->nick_name = $nick_name; 
              $this->saveMedia();
        }
       }
    	return true;

    } 

    public function uniqueFilename($fileName){

      $exists = DB::table('media')
              ->where(['file_name' => $fileName])
              ->exists(); 
      return ($exists) ? time().$fileName : $fileName; 

    }

    public function saveMedia() {
        $class = get_class($this);
        $data['model_type'] = $class;
        $data['model_id']   = $this->id;
        $data['file_name']  = $this->fileName;
        $data['mime_type']  = $this->mimeType;
        $data['doc_type']   = $this->docType;
        $data['nick_name']  = $this->nick_name;
        $data['name'] = $this->name;
        $data['path'] = $this->path;
        DB::table('media')->insert($data);
         
        return true; 
    }
    public function buildQuery($where = []){
        $query = DB::table('media')
              ->where(['model_type' => get_class($this),
                'model_id' => $this->id])
              ->when($where, function ($q) use 
               ($where) {
                $q->where($where);
              });   

        return $query;     

    }

    public function getQuery($where = []){
        $files = $this->buildQuery($where)
            ->get();   
        return $files;     
    } 

    public function deleteQuery($where = []){
        $files = $this->buildQuery($where)
            ->delete();   
        return true;     
    }

    public function allMedia(){
          return $this->getQuery();   
    }
    public function getMedia($extesion = false){
         $files = $this->allMedia();
        
          $files = @$files->filter(function($file) use ($extesion){
              $file->path = $this->getFullPath($file,$extesion);
              return $file;
          });      
    	return ($files->count() == 1) ? $files->first() : ($files->count() == 0 ? null : $files) ;  
    }

    public function getMediaPath($extesion = false){
      $files =  $this->allMedia();
    
  	 $files = @$files->map(function($file) use ($extesion){
          return $file->path = $this->getFullPath($file,$extesion);
     }); 

	   return ($files->count() == 1) ? $files->first() : ($files->count() == 0 ? null : $files) ;  
    } 

    public function getMediaPathWithExtension(){
      return $this->getMediaPath(true);
    }

    public function getFullPath($file,$extesion = null){

      if($extesion){
         return [
               'file' => ($file) ?  asset($file->path.'/'.$file->file_name) : null ,
               'ext' => ($file) ?  @pathinfo($file->file_name)['extension']: null,
               'name' => ($file) ?  @$file->name  : null,
               'nick_name' => ($file && @$file->nick_name) ? @$file->nick_name : @$file->name               
             ];
      }

    	return ($file) ?  asset($file->path.'/'.$file->file_name) : null;
    }

    public function getPublicPath($file,$extesion = null){

      if($extesion){
         return [
               'file' => ($file) ?  asset($file->path.'/'.$file->file_name) : null ,
               'ext' => ($file) ?  @pathinfo($file->file_name)['extension']: null,
               'name' => ($file) ?  @$file->name  : null,
               'nick_name' => ($file && @$file->nick_name) ? @$file->nick_name : @$file->name               
             ];
      }

      return ($file) ?  public_path($file->path.'/'.$file->file_name) : null;
    }

    public function deleteFile($file = null){
       $where = ($file && is_array($file))  ? $file : ( (is_string($file)) ? ['file_name' => $file] : [] );
       $files = $this->getQuery($where); 
      
       foreach ($files as $key => $file) {
             $dFile = $file->path = $this->getPublicPath($file);
             @unlink($dFile);
       }

       $this->deleteQuery($where);

       return true; 

    }

    public function toPath($path){

    	   if(!\File::exists(public_path().$path)) {
    			  \File::makeDirectory(public_path().'/'.$path, $mode = 0777, true, true);
    			}
           $this->path = $path; 
    	    return $this;
    }

    public function docType($type){
        $docType = null;
        if($type){
        	$docType = DocumentType::firstOrCreate(
    			    ['name' => $type],
    			    ['account_number' => DocumentType::max('account_number') + 100 , 
    			      'slug' => \Str::slug($type)]
    			);
    			$docType = $docType->id;
        }
    
    	$this->docType = $docType;
       return $this;

    }


}