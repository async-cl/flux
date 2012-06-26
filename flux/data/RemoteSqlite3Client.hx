/**
   Author: Ritchie Turner, flux.cl
   Licence: 
**/

package flux.data;

using flux.Core;
import flux.Data;

private class BucketProxy extends haxe.remoting.AsyncProxy<flux.data.RemoteBucketProxy> { }
private class HashProxy extends haxe.remoting.AsyncProxy<flux.data.RemoteHashProxy> { }

class RemoteSqlite3Client implements Store {
  var _url:String;
  var _ready:Outcome<String,Store>;
  
  public function new(ready:Outcome<String,Store>,url:String) {
    _url = (url.endsWith("/")) ? url : url + "/" ;
    _ready = ready;
    ready.resolve(Right(cast this));
  }

  public function bucket<T>(bucketName:String,?serialize:Serializer):Outcome<String,Bucket<T>> {
    var p = Core.outcome();
    new RemoteBucket(p,bucketName,_url+bucketName);
    return p;
  }

  public function hash<T>(hashName:String,?serialize:Serializer):Outcome<String,BHash<T>> {
    var prm = Core.outcome();   
    new RemoteHash(prm,hashName,_url+hashName);
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
  var _ready:Outcome<String,Bucket<T>>;
  var _proxy:BucketProxy;
  
  public function new(ready:Outcome<String,Bucket<T>>,name:String,url:String) {
    _name = name;
    _ready = ready;

    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(url);
    cnx.setErrorHandler( function(err) Core.error("Error : "+Std.string(err)) );
    _proxy = new BucketProxy(cnx.Store);
    var forTyper:Bucket<T> = this;
    ready.resolve(Right(forTyper));
  }

  public function store() {
    return null;
  }

  public function insert(obj:T):Outcome<String,T> {
    var prm = Core.outcome();
    _proxy.insert(obj,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function update(obj:T):Outcome<String,T> {
     var prm = Core.outcome();
    _proxy.update(obj,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function delete(obj:T):Outcome<String,T> {
     var prm = Core.outcome();
    _proxy.delete(obj,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
   
  public function getByOid(id:Int):Outcome<String,T> {
     var prm = Core.outcome();
    _proxy.getByOid(id,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function deleteByOid(id:Int):Outcome<String,Int> {
    var prm = Core.outcome();
    _proxy.getByOid(id,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function indexer(name:String,cb:Indexer<T>,?typeHint:String,?unique:Bool):Outcome<String,Bool> {
    throw "RemoteBucket doesn't support indexers";
    return null;
  }

  public function index():Outcome<String,Bool> {
    throw "RemoteBucket doesn't support indexers";
    return null;
  }
  
  public function where(where:String):Outcome<String,Array<T>> {
    var prm = Core.outcome();
    _proxy.where(where,function(a:Either<String,Array<Dynamic>>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function find(query:Dynamic):Outcome<String,Array<T>> {
    var prm = Core.outcome();
    _proxy.find(query,function(a:Either<String,Array<Dynamic>>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function link(bucketValue:BucketValue,obj:T):Outcome<String,Bool> {
    var p = Core.outcome();
    return p;
  }
  
  public function linked<Q>(bucket:Bucket<Q>,val:T):Outcome<String,Option<Array<Q>>> {
    var prm = Core.outcome();
    _proxy.linked(bucket.name(),val,function(a:Either<String,Option<Array<Q>>>) {
        prm.resolve(cast a);
      });
    return prm;
  }
  
  public function unlink(child:BucketValue,parent:T):Outcome<String,Bool> {
    var p = Core.outcome();
    _proxy.unlink(child,parent,function(a:Either<String,Bool>) {
        p.resolve(a);
      });
    return p;
  }

  public function child(child:Dynamic):BucketValue {
    return {bucket:name(),oid:Data.oid(child)};
  }
  
  public function name():String {
    return _name;
  }

}

private class RemoteHash<T> implements BHash<T> {

  var _ready:Outcome<String,BHash<T>>;
  var _name:String;
  var _proxy:HashProxy;
  
  public function new(ready:Outcome<String,BHash<T>>,name:String,url:String) {
    _ready = ready;
    _name = name;
    
     var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(url);
     cnx.setErrorHandler( function(err) Core.error(Std.string(err)) );
     _proxy = new HashProxy(cnx.Hash);
    var forTyper:BHash<T> = this;
    ready.resolve(Right(forTyper));
  }
  
  public function get(key:String):Outcome<String,T> {
    var prm = Core.outcome();
    _proxy.get(key,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function set(key:String,val:T):Outcome<String,T> {
    var prm = Core.outcome();
    _proxy.set(key,val,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function remove(key:String):Outcome<String,String> {
    var prm = Core.outcome();
    _proxy.remove(key,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function keys(?like:String):Outcome<String,Array<String>> {
    var prm = Core.outcome();
    _proxy.keys(like,function(either) {
        prm.resolve(either);
      });
    return prm;
  }
  
  public function values(?like:String):Outcome<String,Array<T>> {
    var prm = Core.outcome();
    _proxy.keys(like,function(either) {
        prm.resolve(cast either);
      });
    return prm;
  }

}
