
package cloudshift;

import cloudshift.Core;
using cloudshift.Mixin;

import cloudshift.sys.WriteStreamImpl;
import cloudshift.sys.ReadStreamImpl;

import js.Node;

enum SysEnc {
  ASCII;
  UTF8;
  BINARY;
  BASE64;
}

enum SysEvents {
  ProcessExit;
  ProcessUncaughtException(ex:Dynamic);
  SigInt(s:Int);
}

enum SysWriteStreamEvents {
  Drain;
  Error(e:String);
  Close;
  Pipe(src:SysReadStream);
}

enum SysReadStreamEvents {
  Data(d:String);
  Error(e:String);
  End;
  Close;
  Fd;
}

enum SysChildProcessEvents {
  Exit(code:Int,signal:Int);
}

typedef SysChildExit = {code:Int,stderr:String};

interface SysChildProcess implements Observable<SysChildProcessEvents> {
  var stdin(getStdIn,null):SysWriteStream;
  var stdout(getStdOut,null):SysReadStream;
  var stderr(getStdErr,null):SysReadStream;
  var pid(getPid,null):Int;
  function kill(signal:String):Void;
}

interface SysWriteStream implements Observable<SysWriteStreamEvents> {
  var writeable(getWriteable,null):Bool;
  function write(d:String,?enc:String,?fd:Int):Bool;
  function end(?s:String,?enc:String):Void;
  function getNodeWriteStream():NodeWriteStream;
}

interface SysReadStream implements Observable<SysReadStreamEvents> {
  var readable(getReadable,null):Bool;
  function pause():Void;
  function resume():Void;
  function destroy():Void;
  function destroySoon():Void;
  function setEncoding(enc:String):Void;
  function pipe(dest:SysWriteStream,?opts:{end:Bool}):Void;
  function getNodeReadStream():NodeReadStream;
}

class Sys {

  static var _events = new cloudshift.sys.Events();
  static var _proc:NodeProcess = Node.process;
  static var _os:NodeOs = Node.os;
  static var _child:NodeChildProcessCommands = Node.childProcess;
  
  public static function events() {
    return _events;
  }
  
  public static function argv() {
    return _proc.argv;
  }

  public static function stdout():SysWriteStream {
    return new WriteStreamImpl(_proc.stdout);
  }

  public static function stdin():SysReadStream {
    return new ReadStreamImpl(_proc.stdin);
  }

  public static function stderr():SysWriteStream {
    return new WriteStreamImpl(_proc.stderr);
  }

  public static function
  createWriteStream(path,?opt:WriteStreamOpt):SysWriteStream {
    return WriteStreamImpl.createWriteStream(path,opt);
  }
  
  public static function env() {
    return _proc.env;
  }

  public static function pid() {
    return _proc.pid;
  }

  public static function title() {
    return _proc.title;
  }

  public static function arch() {
    return _proc.arch;
  }

  public static function platform() {
    return _proc.platform;
  }

  public static function installPrefix() {
    return _proc.installPrefix;
  }

  public static function execPath() {
    return _proc.execPath;
  }

  public static function version() {
    return _proc.version;
  }

  public static function versions() {
    return _proc.versions;
  }
  
  public static function memoryUsage():{rss:Int,vsize:Int,heapUsed:Int,heapTotal:Int} {
    return _proc.memoryUsage();
  }
  
  public static function nextTick(fn:Void->Void) {
    _proc.nextTick(fn);
  }
  
  public static function exit(code:Int) {
    _proc.exit(code);
  }
  
  public static function cwd() {
    return _proc.cwd();
  }
  
  public static function getuid():Int {
    return _proc.getuid();
  }
  
  public static function getgid():Int {
    return _proc.getgid();
  }
  
  public static function setuid(u:Int) {
    _proc.setuid(u);
  }
  
  public static function setgid(g:Int) {
    _proc.setgid(g);
  }
  
 public static function umask(?m:Int):Int {
    return _proc.umask(m);
  }
  
  public static function chdir(d:String) {
    _proc.chdir(d);
  }
  
  public static function kill(pid:Int,?signal:String) {
    _proc.kill(pid,signal);
  }
  
  public static function uptime():Int {
    return _proc.uptime();
  }
 
  public static function hostname():String {
    return _os.hostname();
  }
  
  public static function type():String {
    return _os.type();
  }
  
  public static function release():String {
    return _os.release();
  }
  
  public static function osUptime():Int {
    return _os.uptime();
  }
  
  public static function loadavg():Array<Float> {
    return _os.loadavg();
  }
  
  public static function totalmem():Int {
    return _os.totalmem();
  }
  
  public static function freemem():Int {
    return _os.freemem();
  }
  
  public static function cpus():Int {
    return _os.cpus();
  }
  
  public static function networkInterfaces():Dynamic {
    return _os.networkInterfaces();
  }

  public static function
  spawn(command: String,?args: Array<String>,?options: Dynamic ) : Outcome<String,SysChildProcess> {
    if (args == null)
      args =[];
    return cloudshift.sys.ChildProcessImpl.spawn(command,args,options);
  }

  public static function
  exec(command: String,?options:Dynamic,?cb:SysChildProcess->Void):Outcome<SysChildExit,String>{
    return cloudshift.sys.ChildProcessImpl.exec(command,options,cb);
  }

  public static function
  execFile(command: String,?options:Dynamic,?cb:SysChildProcess->Void):Outcome<SysChildExit,String> {
    return cloudshift.sys.ChildProcessImpl.execFile(command,options,cb);
  }

  
  public static function getEnc(enc:SysEnc):String {
    if (enc == null)
      return NodeC.UTF8;
    
    return switch(enc) {
    case ASCII: NodeC.ASCII;
    case UTF8: NodeC.UTF8;
    case BINARY:NodeC.BINARY;
    case BASE64: NodeC.BASE64;
    }
  }

  // Async FS calls

    /**
     Checks to see if a file exists.
     @param path to file
     @return Left(path) if does not exist, Right(path) if does exist
  **/
  public static function exists(path:String):Outcome<String,String> {
    var prm = Core.outcome();
    Node.path.exists(path,function(exists) {
        prm.resolve((exists) ? Right(path) : Left(path));
      });
    return prm;
  }
  
  /**
     renames a file
     @param path to original file
     @param path to new file
     @return Either an error message (left) or the new file name (right)
  **/
  public static function rename(from:String,to:String):Outcome<String,String> {
    var prm = Core.outcome();
    Node.fs.rename(from,to,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(to));
      });
    return prm;
  }


  /**
     Stat a file.
     @param path to stat
     @return Left(error msg), Right({path:String,stat:NodeStat})
  **/ 
  public static function stat(path:String):Outcome<String,{path:String,stat:NodeStat}>{
    var prm = Core.outcome();
    Node.fs.stat(path,function(err,stat) {
        prm.resolve((err != null) ? Left(err) : Right({path:path,stat:stat}));
      });
    return prm;
  }
  
  public static function lstat(path:String):Outcome<String,NodeStat>{
    var prm = Core.outcome();
    Node.fs.lstat(path,function(err,stat) {
        prm.resolve((err != null) ? Left(err) : Right(stat));
      });
    return prm;
  }
  
  public static function fstat(fd:Int):Outcome<String,NodeStat>{
    var prm = Core.outcome();
      Node.fs.fstat(fd,function(err,stat) {
        prm.resolve((err != null) ? Left(err) : Right(stat));
      });  
    return prm;
  }

  /**
     links a file,
     @param
     @return either an error msg or the dstPath on success
  **/
  public static function link(srcPath:String,dstPath:String):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.link(srcPath,dstPath,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(dstPath));
      });
    return prm;
  }


  /**
     deletes a file
     @param
     @return an error message (left) or the srcPath (right)
  **/
  public static function unlink(srcPath:String):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.unlink(srcPath,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(srcPath));
      });
    return prm;
  }
  
  public static function symlink(linkData:Dynamic,path:String):Outcome<String,Dynamic>{
    var prm = Core.outcome();
    Node.fs.symlink(linkData,path,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(true));
      });
    return prm;
  }
  
  public static function readlink(path:String):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.readlink(path,function(err,s) {
        prm.resolve((err != null) ? Left(err) : Right(s));
      });
    return prm;
  }
  
  public static function realpath(path:String):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.realpath(path,function(err,s) {
        prm.resolve((err != null) ? Left(err) : Right(s));
      });
    return prm;
  }
  
  public static function chmod(path:String,mode:Int):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.chmod(path,mode,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(path));
      });
    return prm;
  }
  
  public static function fchmod(fd:Int,mode:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.fchmod(fd,mode,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(fd));
      });  
    return prm;
  }
  
  public static function chown(path:String,uid:Int,gid:Int):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.chown(path,uid,gid,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(path));
      });  
    return prm;
  }
  
  public static function rmdir(path:String):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.rmdir(path,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(path));
      });  
    return prm;
  }

  public static function mkdir(path:String,mode:Int):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.mkdir(path,mode,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(path));
      });  
    return prm;
  }

  /**
     read directory contents
     @param path to directory to read
     @return an error message (left) or an array of strings (right)
  **/
  public static function readdir(path:String):Outcome<String,Array<String>>{
    var prm = Core.outcome();
    Node.fs.readdir(path,function(err,fileNames) {
        prm.resolve((err != null) ? Left(err) : Right(fileNames));
      });
    return prm;
  }

  /**
     close a file handle
     @param fd a file handle
     @return an error message (left) or the file handle (right)
  **/
  public static function close(fd:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.close(fd,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(fd));
      });
    return prm;
  }

  /**
     open a file
     @param
     @return an error message (left) or the file handle (right)
  **/
  public static function open(path:String,flags:String,mode:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.open(path,flags,mode,function(err,i) {
        prm.resolve((err != null) ? Left(err) : Right(i));
      });
    return prm;
  }

  /**
     write to a file handle
     @param
     @return an error message (left) or the new position (right)
  **/
  public static function write(fd:Int,bufOrStr:Dynamic,offset:Int,length:Int,position:Null<Int>):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.write(fd,bufOrStr,offset,length,position,function(err,i) {
        prm.resolve((err != null) ? Left(err) : Right(i));
      });
    return prm;
  }

  /**
     read from a file handle
     @param
     @return an error message (left) or the new position (right)
  **/
  public static function read(fd:Int,buffer:NodeBuffer,offset:Int,length:Int,position:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.read(fd,buffer,offset,length,position,function(err,i,nb) {
        prm.resolve((err != null) ? Left(err) : Right(i));
      });
    return prm;
  }

  /**
     truncate file to len
     @param
     @return an error message (left) or the new len (right)
  **/
  public static function truncate(fd:Int,len:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.truncate(fd,len,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(len));
      });
    return prm;
  }

  /**
     read a file as a string
     @param
     @return an error message (left) or the contents of the file (right)
  **/
  public static function readFile(path:String,?enc:SysEnc):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.readFile(path,Sys.getEnc(enc),function(err,s) {
        prm.resolve((err != null) ? Left(err) : Right(new String(s)));
      });
    return prm;
  }

  /**
     Write a string to a file
     @param
     @return an error message (left) or the filename (right)
  **/
  public static function writeFile(fileName:String,contents:String,?enc:SysEnc):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.writeFile(fileName,contents,Sys.getEnc(enc),function(err) {
          prm.resolve((err != null) ? Left(err) : Right(fileName));
      });
    return prm;
  }
  
  public static function utimes(path:String,atime:Dynamic,mtime:Dynamic):Outcome<String,String>{
    var prm = Core.outcome();
    Node.fs.utimes(path,atime,mtime,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(path));
      });
    return prm;
  }
  
  public static function futimes(fd:Int,atime:Dynamic,mtime:Dynamic):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.futimes(fd,atime,mtime,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(fd));
      });
    return prm;
  }
  
  public static function fsync(fd:Int):Outcome<String,Int>{
    var prm = Core.outcome();
    Node.fs.fsync(fd,function(err) {
        prm.resolve((err != null) ? Left(err) : Right(fd));
      });
    return prm;
  }

  public static function watchFile(fileName:String,?options:NodeWatchOpt,listener:NodeStat->NodeStat->Void){
    Node.fs.watchFile(fileName,options,listener);
  }
  
  public static function unwatchFile(fileName:String){
    Node.fs.unwatchFile(fileName);
  }
  
  public static function watch(fileName:String,?options:NodeWatchOpt,listener:String->String):Outcome<String,NodeFSWatcher>{
    var prm = Core.outcome();
    try {
      var w = Node.fs.watch(fileName,options,listener);
      prm.resolve((w == null) ? Left("can't create readStream") : Right(w));
    } catch(ex:Dynamic) {
      prm.resolve(Left(ex));
    }
    return prm;
  }
  
  public static function nodeReadStream(path:String,?options:ReadStreamOpt):Outcome<String,NodeReadStream>{
    var prm = Core.outcome();
    try {
      var rs = Node.fs.createReadStream(path,options);
      prm.resolve((rs == null) ? Left("can't create readStream") : Right(rs));
    } catch(ex:Dynamic) {
      prm.resolve(Left(ex));
    }
    return prm;
  }

  public static function nodeWriteStream(path:String,?options:WriteStreamOpt):Outcome<String,NodeWriteStream>{
    var prm = Core.outcome();
    try {
      var ws = Node.fs.createWriteStream(path,options);
      prm.resolve((ws == null) ? Left("can't create writeStream") : Right(ws));
    } catch(ex:Dynamic) {
      prm.resolve(Left(ex));
    }
    return prm;
  }

 
  
}


