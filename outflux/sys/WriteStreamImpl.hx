
package outflux.sys;

import outflux.Core;
import outflux.Sys;
using outflux.Mixin;


import js.Node;

class WriteStreamImpl extends outflux.core.ObservableImpl<SysWriteStreamEvents> ,implements SysWriteStream {

  var _writeStream:NodeWriteStream;
  
  public function new(s:NodeWriteStream) {
    super();
    _writeStream = s;
    
    _writeStream.addListener(NodeC.EVENT_STREAM_DRAIN,function() {
        notify(Drain);
      });
    _writeStream.addListener(NodeC.EVENT_STREAM_ERROR,function(ex) {
        notify(SysWriteStreamEvents.Error(new String(ex)));
      });
    _writeStream.addListener(NodeC.EVENT_STREAM_CLOSE,function() {
        notify(SysWriteStreamEvents.Close);
      });
    _writeStream.addListener(NodeC.EVENT_STREAM_PIPE,function(src) {
        notify(Pipe(new ReadStreamImpl(src)));
      });
    
  }
  
  public var writeable(getWriteable,null):Bool;

  function getWriteable() {
    return _writeStream.writeable;
  }
  
  public function write(d:String,?enc:String,?fd:Int):Bool {
    return _writeStream.write(d,enc,fd);
  }
  
  public function end(?s:String,?enc:String):Void {
    _writeStream.end(s,enc);
  }

  public function getNodeWriteStream() {
    return _writeStream;
  }

  public static function createWriteStream(path:String,?options:WriteStreamOpt) {
    return new WriteStreamImpl(Node.fs.createWriteStream(path,options));
  }
}