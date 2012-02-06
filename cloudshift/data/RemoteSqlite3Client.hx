/**
   Author: Ritchie Turner, cloudshift.cl
   Licence: 
**/

package cloudshift.data;

import cloudshift.Core;
import cloudshift.Data;
using cloudshift.Mixin;

private class BucketProxy extends haxe.remoting.AsyncProxy<cloudshift.data.RemoteBucketProxy> { }

class RemoteSqlite3Client implements Store {
  var _url:String;
  var _ready:Future<Store>;
  var _proxy:BucketProxy;
  
  public function new(ready:Future<Store>,url:String) {
    _url = url;
    _ready = ready;
    ready.resolve(this);
  }

  public function bucket<T>(bucketName:String):Future<Outcome<Bucket<T>>> {
    var p = Core.promise();
    new RemoteBucket(p,bucketName,_url);
    return p;
  }
  
  public function hash<T>(bucketName:String):Future<Outcome<BHash<T>>> {
    var prm = Core.promise();   
    new RemoteHash(prm,bucketName,_proxy);
    return prm;
  }
  
  public function name():String {
    throw "name not implemented";
    return null;
  }

  public function lookupBucket<T>(name:String) {
    throw "lookupBucket not implemented";
    return null;
  }
}

private class RemoteBucket<T> implements Bucket<T> {
  var _name:String;
  var _ready:Future<Outcome<Bucket<T>>>;
  var _proxy:BucketProxy;
  
  public function new(ready:Future<Outcome<Bucket<T>>>,name:String,url:String) {
    _name = name;
    _ready = ready;

    if (!url.endsWith("/")) url += "/";
        
    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(url+name);
    cnx.setErrorHandler( function(err) trace("Error : "+Std.string(err)) );
    _proxy = new BucketProxy(cnx.Store);
    var forTyper:Bucket<T> = this;
    ready.resolve(Right(forTyper));
  }

  public function store() {
    return null;
  }

  public function insert(obj:T):Future<T> {
    var prm = Core.promise();
    _proxy.insert(obj,function(obj) {
        prm.resolve(obj);
      });
    return prm;
  }
  
  public function update(obj:T):Future<T> {
     var prm = Core.promise();
    _proxy.update(obj,function(obj) {
        prm.resolve(obj);
      });
    return prm;
  }
  
  public function delete(obj:T):Future<Outcome<T>> {
     var prm = Core.promise();
    _proxy.delete(obj,function(outcome) {
        prm.resolve(outcome);
      });
    return prm;
  }
   
  public function getByOid(id:Int):Future<Outcome<T>> {
     var prm = Core.promise();
    _proxy.getByOid(id,function(obj) {
        prm.resolve(obj);
      });
    return prm;
  }
  
  public function deleteByOid(id:Int):Future<Outcome<T>> {
    var prm = Core.promise();
    _proxy.getByOid(id,function(obj) {
        prm.resolve(obj);
      });
    return prm;
  }
  
  public function indexer(name:String,cb:Indexer<T>,?typeHint:String,?unique:Bool):Future<Outcome<T>> {
    throw "RemoteBucket doesn't support indexers";
    return null;
  }

  public function index():Future<Outcome<T>> {
    throw "RemoteBucket doesn't support indexers";
    return null;
  }
  
  public function where(where:String):Future<Array<T>> {
    var prm = Core.promise();
    _proxy.where(where,function(a:Array<Dynamic>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function find(query:Dynamic):Future<Array<T>> {
    var prm = Core.promise();
    _proxy.find(query,function(a:Array<Dynamic>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function link(bucketValue:BucketValue,obj:T):Future<Outcome<T>> {
    var p = Core.promise();
    return p;
  }
  
  public function child(obj:Dynamic):BucketValue {
    //_proxy.child(obj
    return null;
  }
  
  public function linked<Q>(bucket:Bucket<Q>,val:T):Future<Array<Q>> {
    var prm = Core.promise();
    _proxy.linked(bucket.name(),val,function(a:Array<Dynamic>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function unlink(child:BucketValue,parent:T):Future<Outcome<T>> {
    var p = Core.promise();
    return p;
  }
  
  public function name():String {
    return _name;
  }

}

private class RemoteHash<T> implements BHash<T> {

  var _ready:Future<Outcome<BHash<T>>>;
  var _name:String;
  var _proxy:BucketProxy;
  
  public function new(ready:Future<Outcome<BHash<T>>>,name:String,proxy:BucketProxy) {
    _ready = ready;
    _name = name;
    _proxy = proxy;
  }
  public function get(key:String):Future<Outcome<T>> {
    var prm = Core.promise();
    return prm;
  }
  
  public function set(key:String,val:T):Future<Outcome<T>> {
    var prm = Core.promise();
    return prm;
  }
  
  public function remove(key:String):Future<Bool> {
    var prm = Core.promise();
    return prm;
  }
  
  public function keys(?like:String):Future<Option<Array<String>>> {
    var prm = Core.promise();
    return prm;
  }
  
  public function values(?like:String):Future<Option<Array<T>>> {
    var prm = Core.promise();
    return prm;
  }

}
