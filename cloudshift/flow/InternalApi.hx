
package cloudshift.flow;

import cloudshift.Core;
import cloudshift.Flow;

typedef SessionQueue = {sID:String,queue:Void->Array<Dynamic>};

interface MessageQ {
  function append(pkt:Dynamic):Void;
  function setFlusher(cb:SessionQueue->Bool):Void;
  function startFlushing(sessID:String):Void;
  function stopFlushing():Void;
}

interface ConduitSession {
  function append(pkt:Dynamic):Void;
  function flusher(flush:SessionQueue->Bool):Void;
  function subscriptions():Hash<Void->Void>;
  function shutDown():Void;
  var lastConnection(default,default):Float;
  var sessID(default,default):String;
}

class InternalApi {}

