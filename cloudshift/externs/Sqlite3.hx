package cloudshift.externs;

typedef Sqlite3Err= String;

import js.Node;

class Sqlite3 {

  static var sqlite3:Dynamic;
  
  public static function __init__() {
    sqlite3 = Node.require('sqlite3');
  }
}

@:native("cloudshift.externs.Sqlite3.sqlite3.Database") extern class Database  {

  public function new(fileName:String,?mode:Int,?cb:Sqlite3Err->Void):Void;
  public function run(sql:String,?param:Dynamic,?cb:Sqlite3Err->Void):Void;
  public function each(sql:String,?param:Dynamic,?cb:Sqlite3Err->Dynamic->Void,?complete:Void->Void):Void;
  public function get(sql:String,?param:Dynamic,?cb:Sqlite3Err->Void):Void;
  public function exec(sql:String,?param:Dynamic,?cb:Sqlite3Err->Void):Void;
  public function serialize(?cb:Void->Void):Void;
  
}