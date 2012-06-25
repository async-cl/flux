
package flux.io;

import flux.Core;
import flux.Io;

using flux.Mixin;

import js.Node;

class ProcessImpl implements IoProcess {

  public var part_:Part_<Dynamic,ProcessEvents,Dynamic>;
  var proc:NodeProcess;
  
  public function new() {
    proc = Node.process;
    
    part_ = Core.part(this);

    Node.process.addListener(NodeC.EVENT_PROCESS_EXIT,function() {
        notify(ProcessExit);
      });

    Node.process.addListener(NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION,function(ex) {
        notify(ProcessUncaughtException(ex));
      });
  }

  public var stdout(getStdout,null):IoWriteStream;
  public var stdin(getStdin,null):IoReadStream;
  public var stderr(getStderr,null):IoWriteStream;
  public var argv(getArgv,null):Array<String>;
  public var env(getEnv,null):Dynamic;
  public var pid(getPid,null):Int;
  public var title(getTitle,null):String;
  public var arch(getArch,null):String;
  public var platform(getPlatform,null):String;
  public var installPrefix(getInstallPrefix,null):String;
  public var execPath(getExecPath,null):String;
  public var version(getVersion,null):String;
  public var versions(getVersions,null):Dynamic;

  function getArgv() {
    return proc.argv;
  }

  function getStdout() {
    return new WriteStreamImpl();
  }

  function getStdin() {
    return new ReadStreamImpl();
  }

  function getStderr() {
    return new WriteStreamImpl();
  }

  function getEnv() {
    return Node.process.env;
  }

  function getPid() {
    return Node.process.pid;
  }

  function getTitle() {
    return Node.process.title;
  }

  function getArch() {
    return Node.process.arch;
  }

  function getPlatform() {
    return Node.process.platform;
  }

  function getInstallPrefix() {
    return Node.process.installPrefix;
  }

  function getExecPath() {
    return Node.process.execPath;
  }

  function getVersion() {
    return Node.process.version;
  }

  function getVersions() {
    return Node.process.versions;
  }
  
  public function memoryUsage():{rss:Int,vsize:Int,heapUsed:Int,heapTotal:Int} {
    return proc.memoryUsage();
  }
  
  public function nextTick(fn:Void->Void) {
    proc.nextTick(fn);
  }
  
  public function exit(code:Int) {
    proc.exit(code);
  }
  
  public function cwd() {
    return proc.cwd();
  }
  
  public function getuid():Int {
    return proc.getuid();
  }
  
  public function getgid():Int {
    return proc.getgid();
  }
  
  public function setuid(u:Int) {
    proc.setuid(u);
  }
  
  public function setgid(g:Int) {
    proc.setgid(g);
  }
  
 public function umask(?m:Int):Int {
    return proc.umask(m);
  }
  
  public function chdir(d:String) {
    proc.chdir(d);
  }
  
  public function kill(pid:Int,?signal:String) {
    proc.kill(pid,signal);
  }
  
  public function uptime():Int {
    return proc.uptime();
  }
 
  
}