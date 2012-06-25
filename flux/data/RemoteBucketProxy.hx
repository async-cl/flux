
package flux.data;

import flux.Core;
using flux.Mixin;
import flux.Data;

class RemoteBucketProxy  {

  var _bkt:Bucket<Dynamic>;
    
  public function new(bucket:Bucket<Dynamic>)  {
    _bkt = bucket;
  }
  
  public function insert(obj:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.insert(obj).deliver(cb);
  }
  
  public function update(obj:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.update(obj).deliver(cb);
  }
  
  public function delete(obj:Dynamic,cb:Either<String,Dynamic> ->Void):Void {
    _bkt.delete(obj).deliver(cb);
  }
   
  public function getByOid(id:Int,cb:Either<String,Dynamic>->Void):Void {
    _bkt.getByOid(id).deliver(cb);
  }
  
  public function deleteByOid(id:Int,cb:Either<String,Int>->Void):Void {
    _bkt.deleteByOid(id).deliver(cb);
  }
    
  public function where(where:String,cb:Either<String,Array<Dynamic>>->Void):Void {
    _bkt.where(where).deliver(cb);
  }
    
  public function find(query:Dynamic,cb:Either<String,Array<Dynamic>>->Void):Void {
      _bkt.find(query).deliver(cb);
  }

  public function link(bucketValue:BucketValue,parent:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.link(bucketValue,parent).deliver(cb);
  }
  
  public function linked<Q>(name:String,val:Dynamic,cb:Either<String,Option<Array<Q>>>->Void):Void {
    var b = _bkt.store().lookupBucket(name);
    switch(b) {
    case Some(bucket):
      _bkt.linked(bucket,val).deliver(cb);
    case None:
      cb(Left("Bucket doesn't exist: "+name));
    }
  }
  
 public function unlink(child:BucketValue,parent:Dynamic,cb:Either<String,Bool>->Void){
   _bkt.unlink(child,parent).deliver(cb);
  }
  
}