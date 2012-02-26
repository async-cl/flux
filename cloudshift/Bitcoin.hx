
package cloudshift;

import cloudshift.Core;
import cloudshift.Http;
using cloudshift.Mixin;
import js.Node;

typedef RpcErr = {
    var code:Int;
    var message:String;
};

typedef RpcResult = {
    var result:Dynamic;
    var error:RpcErr;
    var id:String;
}

typedef BtcAccount = String;
typedef BtcAddress = String;
typedef BtcTxnID = String;
typedef BtcAccounts = Array<{account:BtcAccount,balance:Float}>;    
typedef BtcResponse<T> = Outcome<String,{id:String,result:T}>;

typedef BtcDetails = {
    var account:String;
    var address:String;
    var category:String;
    var amount:Float;
}

typedef BtcTxn = {
    var amount:Float;
    var confirmations:Int;
    var txid:String;
    var time:String;
    var details:Array<BtcDetails>;
}
    
typedef BtcInfo = {
    var version:String;
    var balance:Float;
    var blocks:Int;
    var connections:Int;
    var proxy:String;
    var generate:Bool;
    var genproclimit:Int;
    var difficulty:Float;
    var hashespersec:Int;
    var testnet:Bool;
    var keypoololdest:Int;
    var keypoolsize:Int;
    var paytxfee:Int;
    var errors:String;
}

typedef BtcMemPool = {
    var version:String;
    var previousblockhash:String;
    var transactions:Dynamic;
    var coinbasevalue:Int;
    var time:Int;
    var bits:String;
}

typedef BtcReceivedAccount = {
    var account:BtcAccount;
    var amount:Float;
    var confirmations:Int;
}

typedef BtcReceivedAddress = { > BtcReceivedAccount,
    var address:BtcAddress;
}

class Bitcoin {

  static var id=0;
  var _user:String;
  var _pass:String;
  var _url:String;
  
  public function new(host:String,port=8332,user:String,pass:String) {
    _url = Std.format("http://$host:$port/");
    trace("url = "+_url);
    _user = user;
    _pass = pass;
  }
  
  function
  jsonrpc(method:String,params:Array<Dynamic>):BtcResponse<Dynamic> {
    var
      oc = Core.outcome(),
      req = Core.stringify({method:method,params:params,id:Std.string(id++)}),
      headers = {};

    Reflect.setField(headers,"Content-Length",req.length);

    var buff = new NodeBuffer(_user + ":" + _pass).toString('base64');
    var auth = 'Basic ' + buff;
      
    Reflect.setField(headers,'Authorization',auth);

    Http.post(_url,req,false,headers)
      .onError(function(err) {
          oc.resolve(Left(err));
        })
      .deliver(function(jsonResult) {
            var res:RpcResult = Core.parse(jsonResult);
            if (res.error == null)
              oc.resolve(Right({id:res.id,result:res.result}));
            else
              oc.resolve(Left(res.error.message));
        });
    return oc;
  }
  
  public function
  backupWallet(destination:String):BtcResponse<Dynamic> {
    return jsonrpc("backupwallet",[destination]);
  }

  public function
  encryptWallet(passphrase:String):BtcResponse<Dynamic> {
    return jsonrpc("encryptwallet",[passphrase]);
  }

  public function
  account(bitcoinaddress:String):BtcResponse<BtcAccount> {
    return cast jsonrpc("getaccount",[bitcoinaddress]);
  }

  public  function
  accountAddress(account:BtcAccount):BtcResponse<BtcAddress> {
    return cast jsonrpc("getaccountaddress",[account]);
  }

  public  function
  addressesByAccount(account:String):BtcResponse<Array<BtcAddress>> {
    return cast jsonrpc("getaddressesbyaccount",[account]);
  }

  public function
  balance(?account:String,minconf=1):BtcResponse<Float> {
    var acc = (account != null) ? [account,minconf] : [];
    return cast jsonrpc("getbalance",acc);
  }

  public function
  transaction(txid:String):BtcResponse<BtcTxn> {
    return cast jsonrpc("gettransaction",[txid]);
  }

  public function
  blockCount():BtcResponse<Int> {
    return cast jsonrpc("getblockcount",[]);
  }

  public  function
  connectionCount():BtcResponse<Int> {
    return cast jsonrpc("getconnectioncount",[]);
  }

  public  function
  difficulty():BtcResponse<Int> {
    return cast jsonrpc("getdifficulty",[]);
  }

  public function
  generate():BtcResponse<Bool> {
    return cast jsonrpc("getgenerate",[]);
  }

  public function
  hashesPerSec():BtcResponse<Int> {
    return cast jsonrpc("gethashespersec",[]);
  }
  
  public function
  accounts(minconf=10):Outcome<String,BtcAccounts> {
    var oc = Core.outcome();
    jsonrpc("listaccounts",[minconf]).deliver(function(res) {
        var a:BtcAccounts = [];
        for (f in Reflect.fields(res.result))
          a.push({account:f,balance:Reflect.field(res.result,f)});
        oc.resolve(Right(a));
      });
    return oc;
  }
  
  public function
  transactions(account:BtcAccount,count=10,from=0):BtcResponse<Dynamic> {
    return cast jsonrpc("listtransactions",[account,count,from]);
  }

  public function
  info():BtcResponse<BtcInfo> {
    return cast jsonrpc("getinfo",[]);
  }

  public function
  memoryPool(?data:Dynamic):BtcResponse<BtcMemPool> {
    var p = (data != null) ? [data] : [];
    return cast jsonrpc("getmemorypool",p);
  }

  /**
     Returns a new bitcoin address for receiving payments. If [account] is
     specified (recommended), it is added to the address book so payments received
     with the address will be credited to [account].  public
  */
  function newAddress(?account:BtcAccount):BtcResponse<BtcAddress> {
    var p = (account !=null) ? [account] : [];
    return cast jsonrpc("getnewaddress",p);
  }

  /**
     Returns the total amount received by addresses with [account] in transactions
     with at least [minconf] confirmations. If [account] not provided return will
     include all transactions to all accounts. (version 0.3.24-beta)
  */
  public function
  receivedByAccount(?account:BtcAccount,minConf=1):BtcResponse<Float> {
    var p = (account != null) ? [account,minConf] : [];
    return cast jsonrpc("getreceivedbyaccount",p);
  }


  /**
     Returns the total amount received by <bitcoinaddress> in transactions with at
     least [minconf] confirmations. While some might consider this obvious, value
     reported by this only considers *receiving* transactions. It does not check
     payments that have been made *from* this address. In other words, this is not
     "getaddressbalance". Works only for addresses in the local wallet, external
     addresses will always show 0.
  */
  public function
  receivedByAddress(?address:BtcAddress,minConf=1):BtcResponse<Float> {
    var p = (address != null) ? [address,minConf] : [];
    return cast jsonrpc("getreceivedbyaddress",p);
  }

  public function
  listReceivedByAccount(minConf=1,includeEmpty=false):BtcResponse<Array<BtcReceivedAccount>> {
    return cast jsonrpc("listreceivedbyaccount",[minConf,includeEmpty]);
  }

  public function
  listReceivedByAddress(minConf=1,includeEmpty=false):BtcResponse<Array<BtcReceivedAddress>> {
    return cast jsonrpc("listreceivedbyaddress",[minConf,includeEmpty]);
  }


  /* CHECK */
  public function
  transactionsSinceBlock(?blockId:String,targetConfirmations=1):BtcResponse<Array<BtcTxn>> {
    var p = (blockId != null) ? [blockId,targetConfirmations] : [];
    return cast jsonrpc("listsinceblock",[blockId,targetConfirmations]);
  }

  public function
  move(from:BtcAccount,to:BtcAccount,amount:Float,minConf=1,?comment:String):BtcResponse<Dynamic> {
    return cast jsonrpc("move",[from,to,amount,minConf,comment]);
  }

  public function
  sendFrom(fromAccount:BtcAccount,to:BtcAddress,amount:Float,minConf=1,?comment:String,?commentTo:String):BtcResponse<BtcTxnID> {
    return cast jsonrpc("sendfrom",[fromAccount,to,amount,minConf,comment,commentTo]);
  }

  public function
  sendMany(fromAccount:BtcAccount,many:Dynamic,minConf=1,?comment:String):BtcResponse<BtcTxnID> {
    return cast jsonrpc("sendmany",[fromAccount,many,minConf,comment]);
  }

  public function
  sendToAddress(address:BtcAddress,amount:Float,minConf=1,?comment:String,?commentTo:String):BtcResponse<BtcTxnID> {
    return cast jsonrpc("sendtoaddress",[address,amount,minConf,comment,commentTo]);
  }

  /**
     Sets the account associated with the given address. Assigning address that
     is already assigned to the same account will create a new address
     associated with that account.
   */
  public function
  setAccount(bitcoinAddress:BtcAddress,account:BtcAccount) {
    return jsonrpc("setaccount",[bitcoinAddress,account]);
  }

  public function
  setGenerate(generate:Bool,genProcLimit=-1) {
    return jsonrpc("setgenerate",[generate,genProcLimit]);
  }

  public function
  signMessage(address:BtcAddress,message:String) {
    return jsonrpc("signmessage",[address,message]);
  }

  public function
  setTxFee(amount:Float) {
    return jsonrpc("settxfee",[amount]);
  }

  public function
  stop() {
    return jsonrpc("stop",[]);
  }

  public function
  validateAddress(address:BtcAddress) {
    return jsonrpc("validateaddress",[address]);
  }

  public function
  verifyMessage(address:BtcAddress,signature:Dynamic,message:Dynamic) {
    return jsonrpc("verifymessage",[address,signature,message]);
  }


  /**
     Removes the wallet encryption key from memory, locking the wallet. After
     calling this method, you will need to call walletpassphrase again before being
     able to call any methods which require the wallet to be unlocked.  public
     function
  */
  walletLock() {
    return jsonrpc("walletlock",[]);
  }

  /**
     Stores the wallet decryption key in memory for <timeout> seconds.
   */
  public function
  walletPassPhrase(passphrase:String,timeout:Int) {
    return jsonrpc("walletpassphrase",[passphrase,timeout]);
  }

  public function
  walletChangePassPhrase(oldpp:String,newpp:String) {
    return jsonrpc("walletchangepassphrase",[oldpp,newpp]);
  }
  
}