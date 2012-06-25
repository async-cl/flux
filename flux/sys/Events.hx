package flux.sys;

import flux.Core;
import flux.Sys;
import js.Node;
using flux.Mixin;

class Events extends flux.core.ObservableImpl<SysEvents> {
  
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
