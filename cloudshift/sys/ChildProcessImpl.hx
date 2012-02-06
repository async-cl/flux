

package cloudshift.sys;

import cloudshift.Core;
import cloudshift.Sys;

import cloudshift.core.ObservableImpl;
using cloudshift.Mixin;

import js.Node;

class ChildProcessImpl extends ObservableImpl<SysChildProcessEvents>, implements SysChildProcess  {
  
  public var stdin(getStdIn,null):SysWriteStream;
  public var stdout(getStdOut,null):SysReadStream;
  public var stderr(getStdErr,null):SysReadStream;
  public var pid(getPid,null):Int;
  
  var _childProc:NodeChildProcess;
  var _stdin:SysWriteStream;
  var _stdout:SysReadStream;
  var _stderr:SysReadStream;
  
  
  public function new(cp:NodeChildProcess) {
    super();
    _childProc = cp;
    _stdin = new WriteStreamImpl(cp.stdin);
    _stdout = new ReadStreamImpl(cp.stdout);
    _stderr = new ReadStreamImpl(cp.stderr);

    _childProc.addListener(NodeC.EVENT_PROCESS_EXIT,function(code,sig) {
        notify(Exit(code,sig));
      });

  }
  
  function getStdIn() {
    return _stdin;
  }

  function getStdOut() {
    return _stdout;
  }

  function getStdErr() {
    return _stderr;
  }

  function getPid() {
    return _childProc.pid;
  }
   
  public function kill(signal:String) {
    // _childProc.kill(signal);
  }

  public static function
  spawn(command: String,args: Array<String>,?options: Dynamic ) : Outcome<String,SysChildProcess> {
    var oc = Core.outcome();
    var forTyper:SysChildProcess = new ChildProcessImpl(Node.childProcess.spawn(command,args,options));
    oc.resolve(Right(forTyper));
    return oc;
  }

  public static 
  function exec(command: String,?options:Dynamic,?cb: SysChildProcess->Void):Outcome<SysChildExit,String> {
    var
      oc = Core.outcome(),
      child = Node.childProcess.exec(command,options,function(err,so,se) {
        if (err != null) {
              oc.resolve(Left({code:err.code,stderr:new String(se)}));
          } else {
              oc.resolve(Right(new String(so)));
          }
      });

    if (cb != null)
      cb(new ChildProcessImpl(child));
    
    return oc;
  }


  public static 
  function execFile(command: String,?options:Dynamic,?cb: SysChildProcess->Void):Outcome<SysChildExit,String> {
    var
      oc = Core.outcome(),
      child = Node.childProcess.execFile(command,options,function(err,so,se) {
          if (err != null) {
              oc.resolve(Left({code:err.code,stderr:new String(se)}));
          } else {
              oc.resolve(Right(new String(so)));
          }
      });
    
    if (cb != null)
      cb(new ChildProcessImpl(child));
    
    return oc;
  }

}