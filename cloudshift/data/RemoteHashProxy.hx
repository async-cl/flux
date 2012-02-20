package cloudshift.data;

import cloudshift.Core;
import cloudshift.Data;

class RemoteHashProxy {

  var _hash:BHash<Dynamic>;
    
  public function new(hash:BHash<Dynamic>)  {
    _hash = hash;
  }

  public function get(key:String,cb:Either<String,Dynamic>->Void) {
    _hash.get(key)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function set(key:String,val:Dynamic,cb:Either<String,Dynamic>->Void) {
    _hash.set(key,val)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function remove(key:String,cb:Either<String,String>->Void) {
    _hash.remove(key)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function keys(?like:String,cb:Either<String,Array<String>>->Void) {
    _hash.keys(like)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function values(?like:String,cb:Either<String,Array<Dynamic>>->Void) {
    _hash.values(like)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }

}