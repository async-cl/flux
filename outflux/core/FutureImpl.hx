
package outflux.core;

// snarfed from stax

import outflux.Core;
using outflux.Mixin;

class FutureImpl<T> implements Future<T> {
  var _listeners: Array<T -> Void>;
  var _result: T;
  var _isSet: Bool;
  var _isCanceled: Bool;
  var _cancelers: Array<Void -> Bool>;
  var _canceled: Array<Void -> Void>;
  var _combined:Int;

  public function new() {
    _listeners  = [];
    _result     = null;
    _isSet      = false;
    _isCanceled = false;
    _cancelers  = [];
    _canceled   = [];
    _combined   = 0;
  }

  /** Creates a "dead" future that is canceled and will never be delivered. */
  public static function dead<T>(): Future<T> {
    var prm = new FutureImpl();
    prm.cancel();
    return prm;
  }
  
  /** Delivers the value of the future to anyone awaiting it. If the value has
   * already been delivered, this method will throw an exception.
   */
  public function resolve(t: T): Future<T> {
    return if (_isCanceled) this;
    else if (_isSet) Mixin.error("Future already delivered");
    else {
      _result = t;
      _isSet  = true;

      for (l in _listeners) l(_result);

      _listeners = [];

      this;
    }
  }

  /** Installs the specified canceler on the future. Under ordinary
   * circumstances, the future will not be canceled unless all cancelers
   * return true. If the future is already done, this method has no effect.
   * <p>
   * This method does not normally need to be called. It's provided primarily
   * for the implementation of future primitives.
   */
  public function allowCancelOnlyIf(f: Void -> Bool): Future<T> {
    if (!isDone()) _cancelers.push(f);

    return this;
  }

  /** Installs a handler that will be called if and only if the future is
   * canceled.
   * <p>
   * This method does not normally need to be called, since there is no
   * difference between a future being canceled and a future taking an
   * arbitrarily long amount of time to evaluate. It's provided primarily
   * for implementation of future primitives to save resources when it's
   * explicitly known the result of a future will not be used.
   */
  public function ifCanceled(f: Void -> Void): Future<T> {
    if (isCanceled()) f();
    else if (!isDone()) _canceled.push(f);

    return this;
  }

  /** Attempts to cancel the future. This may succeed only if the future is
   * not already delivered, and if all cancel conditions are satisfied.
   * <p>
   * If a future is canceled, the result will never be delivered.
   *
   * @return true if the future is canceled, false otherwise.
   */
  public function cancel(): Bool {
    return if (isDone()) false;   // <-- Already done, can't be canceled
    else if (isCanceled()) true;  // <-- Already canceled, nothing to do
    else {                        // <-- Ask to see if everyone's OK with canceling
      var r = true;

      for (canceller in _cancelers) r = r && canceller();

      if (r) {
        // Everyone's OK with canceling, mark state & notify:
        forceCancel();
      }

      r;
    }
  }

  /** Determines if the future is "done" -- that is, delivered or canceled.
   */
  public function isDone(): Bool {
    return isDelivered() || isCanceled();
  }

  /** Determines if the future is delivered.
   */
  public function isDelivered(): Bool {
    return _isSet;
  }

  /** Determines if the future is canceled.
   */
  public function isCanceled(): Bool {
    return _isCanceled;
  }

  /** Delivers the result of the future to the specified handler as soon as it
   * is delivered.
   */
  public function deliver(f: T -> Void): Future<T> {
    if (isCanceled()) return this;
    else if (isDelivered()) f(_result);
    else _listeners.push(f);

    return this;
  }
  
  /** Uses the specified function to transform the result of this future into
   * a different value, returning a future of that value.
   * <p>
   * urlLoader.load("image.png").map(function(data) return new Image(data)).deliverTo(function(image) imageContainer.add(image));
   */
  public function map<S>(f: T -> S): Future<S> {
    var fut = new FutureImpl();

    deliver(function(t: T) { fut.resolve(f(t)); });
    ifCanceled(function() { fut.forceCancel(); });

    return fut;
  }
  
  public function then<S>(f: Future<S>): Future<S> {
    return f;
  }

  /** Maps the result of this future to another future, and returns a future
   * of the result of that future. Useful when chaining together multiple
   * asynchronous operations that must be completed sequentially.
   * <p>
   * <pre>
   * <code>
   * urlLoader.load("config.xml").flatMap(function(xml){
   *   return urlLoader.load(parse(xml).mediaUrl);
   * }).deliverTo(function(loadedMedia){
   *   container.add(loadedMedia);
   * });
   * </code>
   * </pre>
   */
  public function flatMap<S>(f: T -> Future<S>): Future<S> {
    var fut  = new FutureImpl();

    deliver(function(t: T) {
      f(t).deliver(function(s: S) {
        fut.resolve(s);
      }).ifCanceled(function() {
        fut.forceCancel();
      });
    });

    ifCanceled(function() { fut.forceCancel(); });

    return fut;
  }


  /** Returns a new future that will be delivered only if the result of this
   * future is accepted by the specified filter (otherwise, the new future
   * will be canceled).
   */
  public function filter(f: T -> Bool): Future<T> {
    var fut = new FutureImpl();

    deliver(function(t: T) { if (f(t)) fut.resolve(t); else fut.forceCancel(); });

    ifCanceled(function() fut.forceCancel());

    return fut;
  }


  /** Retrieves the value of the future, as an option.
   */
  public function value(): Option<T> {
    return if (_isSet) Some(_result) else None;
  }

  public function toOption(): Option<T> {
    return value();
  }

  public function toArray(): Array<T> {
    return value().toArray();
  }

  private function forceCancel(): Future<T> {
    if (!_isCanceled) {
      _isCanceled = true;

      for (canceled in _canceled) canceled();
    }

    return this;
  }
  
  public static function create<T>(): Future<T> {
    return new FutureImpl<T>();
  }  
}