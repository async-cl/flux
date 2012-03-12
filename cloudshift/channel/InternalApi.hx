
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.channel.Flow;

interface MessageQ {
  function append(pkt:Dynamic):Void;
  function setFlusher(cb:MessageQ->Bool):Void;
  function sessID():String;
  function deQueue():Array<Dynamic>;
}

interface ConduitSession {
  function append(pkt:Dynamic):Void;
  function flusher(flush:MessageQ->Bool):Void;
  function subscriptions():Hash<Void->Void>;
  function shutDown():Void;
  var lastConnection(default,default):Float;
  var sessID(default,default):String;
}

class InternalApi {}

