

class RewriteAsync {

  static var re = ~/(this\.__cnx\.resolve.*?)\.call\(\[(.*?),(.*?)\],null/g;
  
  static function main() {
#if nodejs
    var
      file = js.Node.process.argv[2],
      content = Std.string(js.Node.fs.readFileSync(file));

    js.Node.fs.writeFileSync(file,replace(content));
#elseif neko
    var
      file = Sys.args()[0],
      content = replace(sys.io.File.getContent(file));

    sys.io.File.saveContent(file,content);
#end
    Sys.println("tweaking async in "+file);
  }

  static function replace(content) {
    return re.replace(content,'$1.call([$2],$3') ;
  }
  
}