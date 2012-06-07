package outflux.sys;

import outflux.Core;
import outflux.Sys;
import js.Node;
using outflux.Mixin;

class Events extends outflux.core.ObservableImpl<SysEvents> {
  
  public function new() {
    super();
    
    Node.process.addListener(NodeC.EVENT_PROCESS_EXIT,function() {
        notify(ProcessExit);
      });

    Node.process.addListener(NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION,function(ex) {
        notify(ProcessUncaughtException(ex));
      });
  }
}
