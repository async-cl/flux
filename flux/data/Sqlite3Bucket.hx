
package flux.data;

import flux.externs.Sqlite3;

import js.Node;
import flux.Core;
import flux.Data;

using flux.Mixin;

class Sqlite3Bucket<T> implements Bucket<T> {  
  var _store:Sqlite3Store;
  var _db:Database;
  var _table:String;
  var _indexers:Hash<Indexer<T>>;
  var _serialize:Dynamic->String;
  var _deserialize:String->Dynamic;
  
  public function new(store:Sqlite3Store,table:String,?serialize:Serializer) {
    _store = store;
    _db = store.db();
    _table = table;
    _indexers = new Hash() ;

    if (serialize == null) 
      serialize = Data.jsonSerializer();
    
    _serialize = serialize.serialize;
    _deserialize= serialize.deSerialize;
  }

  public function
  store():Store {
    return _store;
  }
  
  public function
  indexer(name:String,indexer:Indexer<T>,typeHint="text",unique=false):Outcome<String,Bool> {
    var prm = Core.outcome();
    _indexers.set(name,indexer);
    addField(_table,name,typeHint,unique).deliver(function(fieldAdded) {
        switch(fieldAdded) {
        case Left(msg):
          if (msg.indexOf("duplicate column") == -1) {
            throw msg;
          }
          prm.resolve(Right(true));
        case Right(_):
          addPhysicalIndex(_table,name,unique).deliver(function(added) {
              switch(added) {
              case Left(msg):
                prm.resolve(Left(msg));
              case Right(_):
                prm.resolve(Right(true));
              }
            });
        }
      });
    return prm;
  }

  function
  addField(table:String,name:String,typeHint:String,unique:Bool):Future<Either<String,Bool>> {
    var prm = Core.future();
    _db.exec("alter table "+table+" add "+name+" "+typeHint,function(err) {
        prm.resolve((err != null) ? Left(new String(err)) : Right(true));
      });
    return prm;
  }
  
  function
  addPhysicalIndex(table:String,name:String,unique:Bool):Future<Either<String,Bool>> {
    var
      prm = Core.future(),
      createIndex = "create "+ ((unique) ? "unique" : "") + " index if not exists ",
      indexName = "i_"+table+"_"+name;
    
    _db.run(createIndex+indexName +" on "+table+" ("+name+")",function(err) {
        prm.resolve((err != null) ? Left(new String(err)) : Right(true));
      });
    return prm;
  }

  public function index():Outcome<String,Bool> {
    var prm = Core.outcome();
    _db.serialize(function() {
        var sql = 'select rowid,__obj from '+_table;
        
        _db.each(sql,[],function(err,row) {
            if (err != null) {
              prm.resolve(Left(new String(err)));
              return;
            }

            var o:T = _deserialize(new String(row.__obj));

            reindexObj(o,row.rowid,function(b) {
                trace("indexed:"+row.rowid);
              });
          },function() {
            prm.resolve(Right(true));
          });
      });

    return prm;
  }
                 
  function indexSingle(name:String,p:Future<Either<String,String>>) {
    _db.serialize(function() {
        var
          sql = 'select rowid,__obj from '+_table +' where '+name+' is null',
          indexer = _indexers.get(name);
        
        _db.each(sql,[],function(err,row) {
            if (err != null) {
              trace("error creatig index:"+err);
              p.resolve(Left(new String(err)));
              return;
            }
            
            var
              o:T = _deserialize(new String(row.__obj)),
              indexVal = indexer(o),
              update = "update "+_table+" set "+name+" = '"+ indexVal+"' where rowid="+row.rowid;
            
            if (indexVal != null) {
              _db.exec(update,function(err) {
                  if (err != null) {
                    trace("update err:"+err);
                    p.resolve(Left(new String(err)));
                  }
                });
            }                    
          },function() {
            p.resolve(Right(name));
          });
      });
  }
  
  public function update(o:T):Outcome<String,T> {
    var
      rowId = Data.oid(o);

    if (rowId == null)
      throw "can't update an object with no oid";

    var
      p = Core.outcome(),
      indexVals = indexUpdate(o),
      obj = _serialize(o),
      sql = "update "+_table+" set __obj = '" + obj + "'"+indexVals+" where rowID="+rowId;

    _db.run(sql,function(err) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        p.resolve(Right(o));
      });
    return p;
  }
  
  function indexUpdate(o:T):String {
    var clause = [];
    for (k in _indexers.keys()) {
      var indexVal = _indexers.get(k)(o);
      if (indexVal != null)
        clause.push(k + "=" +"'"+indexVal+"'");
    }
    return if (clause.length  == 0) ""  else  "," + clause.join(",");
  }

  public function insert(o:T):Outcome<String,T> {
    var
      p = Core.outcome(),
      indexVals = indexInsert(o);

    _db.run('insert into '+_table+indexVals,_serialize(o),function(err) {
        if (err != null) {
          p.resolve(Left(err));
          return;
        }

        var rowId = untyped __js__("this.lastID");
        Reflect.setField(o,"__oid",rowId);
        p.resolve(Right(o));
        
      });
    return p;
  }

  function indexInsert(o:T):String {
    var values = [], keys = [];
    for (k in _indexers.keys()) {
      var indexVal = _indexers.get(k)(o);
      if (indexVal != null)  {
        if (Std.is(indexVal,"Float"))
          values.push(indexVal);
        else
            values.push("'"+indexVal+"'");
        keys.push(k);
      }
    }

    return if (keys.length == 0) "(__obj) values (?)"
      else "( __obj," + keys.join(",") + ") values (?,"+values.join(",") + ")";
  }

  public function delete(o:T):Outcome<String,T> {
    var prm:Outcome<String,T> = Core.outcome();
    deleteByOid(Data.oid(o)).deliver(function(e:Either<String,Int>) {
        switch(e) {
        case Right(i):
          prm.resolve(Right(o));
        case Left(err):
          prm.resolve(Left(err));
        }
      });
    return prm;
  }
  
  public function getByOid(id:Int):Outcome<String,T> {
    var p = Core.outcome();
    _db.get('select __obj from '+_table+' where rowid='+id,function(err,row) {

        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }

        var o:T = _deserialize(new String(row.__obj));
        Reflect.setField(o,"__oid",id);
        p.resolve(Right(o));
      });
    
    return p;
  }

  public function deleteByOid(oid:Int):Outcome<String,Int> {
    var p = Core.outcome();
     if (oid != null) {
      _db.run("delete from "+_table+' where rowid='+oid,function(err) {
          p.resolve((err != null) ? Left(new String(err)) : Right(oid));
        });
    }
    return p;
  }

  function reindexObj(o:T,rowId:Int,cb:Bool->Void) {
    var clause = [];
    for (k in _indexers.keys()) {
      var indexVal = _indexers.get(k)(o);
      if (indexVal != null)
        clause.push(k + "=" +"'"+indexVal+"'");
    }

    if (clause.length > 0) {
      var sql = "update "+_table+" set "+clause.join(",")+" where rowid="+rowId; 
      _db.exec(sql,function(err) {
          if (err != null) {
            trace("update err:"+err);
          trace(sql);
          cb(false);
          return;
          }
          cb(true);
        });
    } else
      cb(false);
  } 

  public function where(where:String):Outcome<String,Array<T>> {
    var
      p = Core.outcome(),
      results = [],
      sql = 'select rowid,__obj from '+_table +' where '+where;
    
    _db.each(sql,[],function(err,row) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }

        var o = _deserialize(new String(row.__obj));
        Reflect.setField(o,"__oid",row.rowid);
        results.push(o);
      },function() {
        p.resolve(Right(results));
      });
    return p;
  }

  public function find(query:Dynamic):Outcome<String,Array<T>> {
    var clause = [];
    for (f in Reflect.fields(query)) {
      var val = Reflect.field(query,f);
      clause.push(f+"='"+val+"'");
    }
    trace("clause = "+clause.join(" and "));
    return where(clause.join(" and "));
  }

  public function link(child:BucketValue,parent:T):Outcome<String,Bool> {
    var
      p = Core.outcome(),
      parentOid = Data.oid(parent),
      linkFld = "__link_"+_table,
      vals = "'"+child.bucket+"'"+","+child.oid+",'"+_table+"',"+parentOid,
      sql = "insert into __links(ch_bkt,ch_oid,p_bkt,p_oid) values("+vals+")";

    if (parentOid == null) throw "parentOid can't be null when linking";
    
    //trace(sql);
    
    _db.run(sql,function(err) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        p.resolve(Right(true));
      });
    return p;
  }

  public function linked<Q>(bucket:Bucket<Q>,val:T):Outcome<String,Option<Array<Q>>> {
    var
      p = Core.outcome(),
      parentOid = Data.oid(val),
      results = [],
      sql = Std.format("select __obj from ${bucket.name()} where rowid in (select ch_oid from __links where p_oid=$parentOid and p_bkt='$_table');");

    //if (parentOid == null) throw "parentOid can't be null when getting linked";

    trace(sql);
    
    _db.each(sql,[],function(err,row) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        
        results.push(_deserialize(row.__obj));
      },function() {
          p.resolve((results.length > 0) ? Right(Some(results)) : Right(None));
      });
    return p;
  }

  public function unlink(child:BucketValue,parent:T):Outcome<String,Bool> {
    var
      p = Core.outcome(),
      parentOid = Data.oid(parent),
      sql = "delete from __links where p_oid="+parentOid+" and ch_oid="+child.oid+" and p_pkt='"+_table+"' and ch_bkt='"+child.bucket+"'";

    if (parentOid == null) throw "parentOid can't be null when getting linked";

    _db.run(sql,function(err) {
        if (err != null) {
          p.resolve(Left(new String(err)));
          return;
        }
        
        p.resolve(Right(true));
      });

    return p;
  }
                         
  public function name():String {
    return _table;
  }

  public function child(child:Dynamic):BucketValue {
    return {bucket:name(),oid:Data.oid(child)};
  }
  
}