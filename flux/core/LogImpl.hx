
package flux.core;


#if (!macro && nodejs)
import js.Node;
#end

class LogImpl {

  static function
  format(type,msg,cat,?inf:haxe.PosInfos) {
    var pos = "";
    if (inf != null) {
      if (inf.fileName != "Log.hx")
        pos = inf.fileName +":"+inf.lineNumber;
    }

    var d = Date.now();
    var category = if (cat != "") "|"+cat else cat;
    
    var time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    return "[" + pos + "|" + time + "|"+type+category+"]"  +Std.string(msg);
  }

  static function myTrace(v : Dynamic, ?inf : haxe.PosInfos) {
    debug(v,"",inf);
  }
  
  public static function
  init(?fileName:String) {
    //    haxe.Log.trace = myTrace;
#if (!macro && nodejs)
    if ( fileName != null) {
      logFileFD = Node.fs.openSync(fileName,"a+",438);
    } else
      logFileFD = -1;
#end
  }
  
#if (!macro && nodejs)
  static var logFileFD:Int = -1;

  static function
  write(msg,type) {
    if (msg != null) {
      if (logFileFD != -1) {
        var b = new NodeBuffer(msg+"\n",NodeC.UTF8);
        Node.fs.write(logFileFD,b,0,b.length,null);
      }
      else {
      #if js
        untyped __js__("console.log(msg)");
      #end
      }
    }
  }

#else

  static function
  write(msg,type) {
  #if js
    if (msg != null)
      switch(type) {
        case "info":
        untyped __js__("console.info(msg)");
      case "warn":
        untyped __js__("console.warn(msg)");
      case "error":
        untyped __js__("console.error(msg)");
      case "debug":
        untyped __js__("console.debug(msg)");
      default:
        untyped __js__("console.log(msg)");
      }
   #else
    Sys.println(msg);
   #end
  }

#end

  inline static function
  doTrace(type:String,category:String,msg:Dynamic,?inf:haxe.PosInfos) {
    if (type == "error") {
      var stack = haxe.Stack.toString(haxe.Stack.exceptionStack());
      if (stack.length == 0)
        stack = "No haXe stack trace available";
      msg = msg + "\n"+stack;
    }
    write(format(type,msg,category,inf),type);
  }
  
  static public function
  info(msg:Dynamic,category="",?inf:haxe.PosInfos) {
    doTrace("info",category,msg,inf);
  }

  static public function
  warn(msg:Dynamic,category="",?inf:haxe.PosInfos) {
    doTrace("warn",category,msg,inf);
  }

  static public function
  error(msg:Dynamic,category="",?inf:haxe.PosInfos) {
    doTrace("error",category,msg,inf);
  }

  static public function
  debug(msg:Dynamic,category="",?inf:haxe.PosInfos) {
    doTrace("debug",category,msg,inf);
  }

}