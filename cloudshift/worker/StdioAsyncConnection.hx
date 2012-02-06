/*
 * Copyright (c) 2005-2008, The haXe Project Contributors
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE HAXE PROJECT CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE HAXE PROJECT CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */
package cloudshift.worker;

import haxe.remoting.AsyncConnection;

class StdioAsyncConnection implements AsyncConnection, implements Dynamic<AsyncConnection> {

	var __data : { write:String->Void, error : Dynamic -> Void,callbacks:IntHash<Dynamic->Void> };
	var __path : Array<String>;
  static var cbID:Int = 0;

	public function new(data,path) {
		__data = data;
		__path = path;
	}

	public function resolve( name ) : AsyncConnection {
		var c = new StdioAsyncConnection(__data,__path.copy());
		c.__path.push(name);
		return c;
	}

	public function setErrorHandler(h) {
		__data.error = h;
	}

	public function call( params : Array<Dynamic>, ?onResult : Dynamic -> Void ) {
    // assume my onResult is never null
    cbID++;
    __data.callbacks.set(cbID,onResult);

    var s = new haxe.Serializer();
		s.serialize(__path);
		s.serialize(params);
    s.serialize(cbID);
    __data.write(s.toString());
    
	}

	public static function workerConnect( write:String->Void,callbacks:IntHash<Dynamic->Void> ) {
		return new StdioAsyncConnection({ write:write, error : function(e) { throw e; },callbacks:callbacks},[]);
	}

}
