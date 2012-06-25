
package flux.data;

import flux.Core;
import flux.Data;
import flux.externs.Sqlite3;

class Sqlite3BHash<T> implements BHash<T>  {
  var _db:Database;
  var _table:String;
  var _serialize:Dynamic->String;
  var _deserialize:String->Dynamic;

  public function new(store:Sqlite3Store,name:String,?serialize:Serializer) {
    _db = store.db();
    _table = name;

    if (serialize == null) 
      serialize = Data.jsonSerializer();
    
    _serialize = serialize.serialize;
    _deserialize= serialize.deSerialize;

  }
  
  public function set(key:String,val:T):Outcome<String,T> {
    var
      p = Core.outcome(),
      obj = _serialize(val),
      ins = 'insert or replace into ';
    
    _db.run(ins + _table + "(__hash,obj) values(?,?)",[key,obj],function(err) {
        p.resolve((err != null) ? Left(err) : Right(val));
      });

    return p;
  }

  public function get(key):Outcome<String,T> {
    var p = Core.outcome();
    _db.get("select obj from "+_table+" where __hash='"+key+"'",function(err,obj) {
        p.resolve((err != null) ? Left(err) : Right(_deserialize(new String(obj.obj))));
      });    
    return p;
  }

  public function remove(key:String):Outcome<String,String> {
    var p = Core.outcome();
    _db.serialize(function() {
        _db.run("delete from "+_table+" where __hash='"+key+"'",function(err,obj) {
            p.resolve((err != null) ? Left(err) : Right(key));
          });
      });
    return p;
  }

  public function keys(?like:String):Outcome<String,Array<String>> {
    var
      p = Core.outcome(),
      keys = [],
      where = (like == null) ? "" : " where __hash GLOB '"+like+"'";
    _db.each("select __hash from "+_table+where,[],function(err,row) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        keys.push(row.__hash);
      },function() {
        p.resolve(Right(keys));
      });
    
    return p;  
  }

  public function values(?like:String):Outcome<String,Array<T>> {
    var
      p = Core.outcome(),
      vals = [],
      where = (like == null) ? "" : " where __hash GLOB '"+like+"'";
    _db.each("select obj from "+_table+where,[],function(err,row) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        vals.push(_deserialize(row.obj));
      },function() {
        p.resolve(Right(vals));
      });
    
    return p;  
  }

}