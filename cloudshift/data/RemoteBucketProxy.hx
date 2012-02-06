
package cloudshift.data;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Data;

class RemoteBucketProxy  {

  var _bkt:Bucket<Dynamic>;
  
  
  public function new(bucket:Bucket<Dynamic>)  {
    _bkt = bucket;
  }
  
  public function insert(obj:Dynamic,cb:Dynamic->Void):Void {
    _bkt.insert(obj).deliver(cb);
  }
  
  public function update(obj:Dynamic,cb:Dynamic->Void):Void {
    _bkt.update(obj).deliver(cb);
  }
  
  public function delete(obj:Dynamic,cb:Outcome<Dynamic>->Void):Void {
    _bkt.delete(obj).deliver(cb);
  }
   
  public function getByOid(id:Int,cb:Dynamic->Void):Void {
    _bkt.getByOid(id).deliver(cb);
  }
  
  public function deleteByOid(id:Int,cb:Outcome<Dynamic>->Void):Void {
    _bkt.deleteByOid(id).deliver(cb);
  }
    
  public function where(where:String,cb:Array<Dynamic>->Void):Void {
    _bkt.where(where).deliver(cb);
  }

  public function find(query:Dynamic,cb:Array<Dynamic>->Void):Void {
    _bkt.find(query).deliver(cb);
  }

  public function link(bucketValue:BucketValue,parent:Dynamic,cb:Outcome<Dynamic>->Void):Void {
      _bkt.link(bucketValue,parent).deliver(cb);
  }
  
  public function child(obj:Dynamic,cb:BucketValue->Void):Void {
    cb(_bkt.child(obj));
  }
  
  public function linked<Q>(name:String,val:Dynamic,cb:Array<Q>->Void):Void {
    var b = _bkt.store().lookupBucket(name);
    switch(b) {
    case Some(bucket):
      _bkt.linked(bucket,val).deliver(cb);
    case None:
      throw "don't have bucket "+name;
    }
  }
  
  public function unlink(child:BucketValue,parent:Dynamic,cb:Outcome<Dynamic>->Void){
    _bkt.unlink(child,parent).deliver(cb);
  }
  
  public function name(cb:String->Void):Void {
    cb(_bkt.name());
  }

}