
package cloudshift;

import cloudshift.Core;

import cloudshift.Http;
import cloudshift.Remote;
import cloudshift.data.RemoteBucketProxy;

typedef Serializer = {
  var serialize:Dynamic->String;
  var deSerialize:String->Dynamic;
}

interface Store {
  function bucket<T>(bucketName:String,?serialize:Serializer):Outcome<String,Bucket<T>>;
  function hash<T>(bucketName:String,?serialize:Serializer):Outcome<String,BHash<T>>;
  function name():String;
  function lookupBucket<T>(bucketName:String):Option<Bucket<T>>;
}

interface Bucket<T> {
  function insert(obj:T):Outcome<String,T>;
  function update(obj:T):Outcome<String,T>;
  function delete(obj:T):Outcome<String,T>;

  function getByOid(id:Int):Outcome<String,T>;
  function deleteByOid(id:Int):Outcome<String,Int>;

  function indexer(name:String,cb:Indexer<T>,?typeHint:String,?unique:Bool):Outcome<String,Bool>;
  function index():Outcome<String,Bool>;
  function where(where:String):Outcome<String,Array<T>>;
  function find(query:Dynamic):Outcome<String,Array<T>>;

  function link(bucketValue:BucketValue,obj:T):Outcome<String,Bool>;
  function child(obj:Dynamic):BucketValue;
  function linked<Q>(bucket:Bucket<Q>,val:T):Outcome<String,Option<Array<Q>>>;
  function unlink(child:BucketValue,parent:T):Outcome<String,Bool>;

  function store():Store;
  function name():String;
}

typedef BucketValue = { bucket:String,oid:Dynamic };

interface BHash<T> {
  function get(key:String):Outcome<String,T>;
  function set(key:String,val:T):Outcome<String,T>;
  function remove(key:String):Outcome<String,String>;
  function keys(?like:String):Outcome<String,Array<String>>;
  function values(?like:String):Outcome<String,Array<T>>;
}

typedef Indexer<T> = T->Dynamic;

enum StoreKind {
  SQLITE(name:String);
  REMOTESQLITE(url:String);
}


class Data {
  public static function store<T>(kind:StoreKind):Outcome<String,Store> {
    var p = Core.outcome();
    switch(kind) {
    case SQLITE(name):
      new cloudshift.data.Sqlite3Store(p,name);
    case REMOTESQLITE(url):
      new cloudshift.data.RemoteSqlite3Client(p,url);
    }
    return p;
  }

  public static function serve<T>(http:HttpServer,bucket:Bucket<T>,url:String) {
    var rem = Remote.provider("Store",new RemoteBucketProxy(bucket));
    http.handler(new EReg(url,""),rem.httpHandler);
  }

  public static function jsonSerializer():Serializer {
    return { serialize:Core.stringify,deSerialize:Core.parse};
  }

  public static function haxeSerializer():Serializer {
    return {serialize:haxe.Serializer.run,deSerialize:haxe.Unserializer.run};
  }
  
  public static function oid(pkt:Dynamic):Null<Int> {
    return Reflect.field(pkt,"__oid");
  }

  
}
