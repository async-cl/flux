
package flux.sys;

import flux.Core;
import flux.Sys;
using flux.Mixin;

import js.Node;

class ReadStreamImpl extends flux.core.ObservableImpl<SysReadStreamEvents>, implements SysReadStream {
  
  var _readStream:NodeReadStream;

  public var readable(getReadable,null):Bool;
  
  public function new(rs:NodeReadStream) {
    super();
    _readStream = rs;
    _readStream.addListener(NodeC.EVENT_STREAM_DATA,function(d) {
        notify(Data(new String(d)));
      });
    _readStream.addListener(NodeC.EVENT_STREAM_END,function() {
        notify(End);
      });
    _readStream.addListener(NodeC.EVENT_STREAM_ERROR,function(exception) {
        notify(SysReadStreamEvents.Error(new String(exception)));
      });
    _readStream.addListener(NodeC.EVENT_STREAM_CLOSE,function() {
        notify(SysReadStreamEvents.Close);
      });
  }

  function getReadable() {
    return _readStream.readable;
  }

  public function pause():Void {
    _readStream.pause();
  }
  public function resume():Void {
    _readStream.resume();
  }
  public function destroy():Void {
    _readStream.destroy();
  }
  public function destroySoon():Void {
    _readStream.destroySoon();
  }
  public function setEncoding(enc:String) {
    _readStream.setEncoding(enc);
  }
  public function pipe(dest:SysWriteStream,?opts:{end:Bool}) {
    _readStream.pipe(dest.getNodeWriteStream(),opts);
  }

  public function getNodeReadStream() {
    return _readStream;
  }
  
}