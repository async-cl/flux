
package cloudshift.data;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Data;

class RemoteBucketProxy  {

  var _bkt:Bucket<Dynamic>;
    
  public function new(bucket:Bucket<Dynamic>)  {
    _bkt = bucket;
  }
  
  public function insert(obj:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.insert(obj)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function update(obj:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.update(obj)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function delete(obj:Dynamic,cb:Either<String,Dynamic> ->Void):Void {
    _bkt.delete(obj)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
   
  public function getByOid(id:Int,cb:Either<String,Dynamic>->Void):Void {
    _bkt.getByOid(id)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function deleteByOid(id:Int,cb:Either<String,Int>->Void):Void {
    _bkt.deleteByOid(id)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
    
  public function where(where:String,cb:Either<String,Array<Dynamic>>->Void):Void {
    _bkt.where(where)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
    
  public function find(query:Dynamic,cb:Either<String,Array<Dynamic>>->Void):Void {
      _bkt.find(query)
        .onError(function(e) { cb(Left(e)); })
        .deliver(function(v) { cb(Right(v)); });
  }

  public function link(bucketValue:BucketValue,parent:Dynamic,cb:Either<String,Dynamic>->Void):Void {
    _bkt.link(bucketValue,parent)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
  public function linked<Q>(name:String,val:Dynamic,cb:Either<String,Option<Array<Q>>>->Void):Void {
    var b = _bkt.store().lookupBucket(name);
    switch(b) {
    case Some(bucket):
      _bkt.linked(bucket,val)
        .onError(function(e) { cb(Left(e)); })
        .deliver(function(v) { cb(Right(v)); });
    case None:
      cb(Left("Bucket doesn't exist: "+name));
    }
  }
  
 public function unlink(child:BucketValue,parent:Dynamic,cb:Either<String,Bool>->Void){
    _bkt.unlink(child,parent)
      .onError(function(e) { cb(Left(e)); })
      .deliver(function(v) { cb(Right(v)); });
  }
  
}