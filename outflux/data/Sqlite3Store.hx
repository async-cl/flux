
package outflux.data;

import outflux.Core;
import outflux.Data;
import outflux.externs.Sqlite3;

using outflux.Mixin;

import js.Node;

class Sqlite3Store implements Store {

  var _db:Database;
  var _name:String;
  var _indexString:String;
  var _buckets:Hash<Bucket<Dynamic>>;
  
  public function new(prm:Outcome<String,Store>,name:String) {
    _name = name;
    _db = new Database(name);
    _buckets = new Hash();

    _db.run("create table if not exists __links(ch_bkt text, ch_oid int,p_bkt text,p_oid int);",function(err) {
        if (err != null) 
          prm.resolve(Left("can't create __links for store:"+name));

        prm.resolve(Right(cast this));
      });
  }

  public function bucket<T>(bucketName:String,?serialize:Serializer):Outcome<String,Bucket<T>> {
    var p = Core.outcome();
    _db.run("create table if not exists "+bucketName+" (__obj text);",function(err) {
        if (err != null) {
          Left("can't create bucket:"+bucketName+"->"+err);
          return;
        }
        
        var b:Bucket<T> = new outflux.data.Sqlite3Bucket(this,bucketName,serialize);
        _buckets.set(bucketName,b);
        p.resolve(Right(b));
      });
    return p;
  }

  public function hash<T>(bucketName:String,?serializer:Serializer):Outcome<String,BHash<T>> {
    var p = Core.outcome();
    _db.run("create table if not exists " + bucketName + " (__hash text primary key unique,obj text);",function(err) {
        if (err != null) {
          p.resolve(Left("can't create hash bucket:"+bucketName+"->"+err));
          return;
        }
        
        var bh:BHash<T> = new outflux.data.Sqlite3BHash(this,bucketName,serializer);
        p.resolve(Right(bh));
      });
    return p;
  }

  public function lookupBucket<T>(name:String):Option<Bucket<T>> {
    return cast _buckets.getOption(name);
  }
  
  public function name():String {
    return _name;
  }

  public function db():Database {
    return _db;
  }

}