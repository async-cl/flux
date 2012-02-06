package cloudshift.sys;

import cloudshift.Core;
import cloudshift.Sys;
import js.Node;
using cloudshift.Mixin;


class Events extends cloudshift.core.ObservableImpl<SysEvents> {
  
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
