
package outflux;

import js.Node;
using StringTools;

using outflux.Mixin;
import outflux.core.Context;

class Worker extends Context {
  
  static public var __callbacks: IntHash<Dynamic->Void> = new IntHash();
  static var re = ~/^([0-9]*?)>/;
  
  public function new() {
    super();
    
    var workerID = Type.getClassName(Type.getClass(this));
    var process = Node.process;

    addObject(workerID.replace(".","_"),this);
    process.stdin.resume();
   
    process.stdin.on("data",function(data) {
        var pkts = splitPkts(new String(data));
        for (p in pkts)  {
          processRequest(p,this,function(serialized) {
              process.stdout.write(serialized.length+">"+serialized);
            });
        }
      });
  }
  
  public static function
  run(kls:Class<Dynamic>) {

    var workers = Node.process.argv.filter(function(arg) {
        return arg.startsWith("csw-");
      });

    if (workers.length == 0) {
      Type.createInstance(kls,[]);
    } else {
      var workerSpec = workers[0];
      var spl = workerSpec.split("-");
      try {
        Type.createInstance(Type.resolveClass(spl[1]),[]);
      } catch(ex:Dynamic) {
        trace(ex);
      }
    }
  }
  
  public static function
  create(kls:Class<Dynamic>) {
    var
      workerID = Type.getClassName(kls),
      id = genID(),
      runThis = Node.process.argv.concat(["csw-"+workerID+"-"+id]);

    runThis.shift();
    
    var proc = Node.childProcess.spawn("node",runThis);
    try {      
      proc.stdout.on("data",function(data) {
          var pkts = splitPkts(new String(data));
          for (p in pkts) {
            var ok = true;
            var ret;
            try {
              if( p.substr(0,3) != "hxr" ) throw "Invalid response : '"+p+"'";
              var s = new haxe.Unserializer(p.substr(3));
              ret = s.unserialize();
              var cbID = s.unserialize();
              if (cbID != -1) {
                __callbacks.get(cbID)(ret);
              }
              
            } catch( err : Dynamic ) {
              ret = null;
              ok = false;
              trace("err:"+new String(err));
            }
          }
        });
    } catch(ex:Dynamic) {
      trace("got exception spawning:"+ex);
    }

    var write = function(s:String) {
        proc.stdin.write(s.length+">"+s);
    }
    
    return outflux.worker.StdioAsyncConnection.workerConnect(write,__callbacks);
  }

  static function
  splitPkts(str:String) {
    var pkts =[];
    while (re.match(str)) {
      var
        len = re.matched(1),
        skip = len.length + 1,
        val = Std.parseInt(len);
      
      pkts.push(str.substr(skip,val));
      str = str.substr(skip+val);
    }
    return pkts;
  }
  
  public static inline function
  genID():String {
    return Std.string(Math.floor(Math.random() * 1e10));
  }

  public static function
  processRequest( requestData : String, ctx : Context,cb:String->Void )  {
		try {
			var u = new haxe.Unserializer(requestData);
			var path = u.unserialize();
			var args:Array<Dynamic> = u.unserialize();
      var cbID:Int = u.unserialize();
      
      args.push(function(data) {
          var s = new haxe.Serializer();
          s.serialize(data);
          s.serialize(cbID);
          cb( "hxr" + s.toString());
        });

			ctx.call(path,args);
    } catch( e : Dynamic ) {
      var s = new haxe.Serializer();
      s.serializeException(e);
      cb("hxr" + s.toString());
    }
  }


}