package cloudshift.data;

import cloudshift.Core;
import cloudshift.Data;

class RemoteHashProxy {

  var _hash:BHash<Dynamic>;
    
  public function new(hash:BHash<Dynamic>)  {
    _hash = hash;
  }

  public function get(key:String,cb:Either<String,Dynamic>->Void) {
    _hash.get(key).deliver(cb);
  }
  
  public function set(key:String,val:Dynamic,cb:Either<String,Dynamic>->Void) {
    _hash.set(key,val).deliver(cb);
  }
  
  public function remove(key:String,cb:Either<String,String>->Void) {
    _hash.remove(key).deliver(cb);
  }
  
  public function keys(?like:String,cb:Either<String,Array<String>>->Void) {
    _hash.keys(like).deliver(cb);
  }
  
  public function values(?like:String,cb:Either<String,Array<Dynamic>>->Void) {
    _hash.values(like).deliver(cb);
  }

}