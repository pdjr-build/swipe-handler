# swipe-handler

Library implementing __SwipeHandler__, a class supporting a simple, configurable,
swipe gesture handler.

__SwipeHandler__ attaches to an arbitrary ordered collection of document elements
called _panels_ waiting for a swipe gesture on one or more associated _zones_ that
satisfies some defined _sensitivity_ threshold.

__SwipeHanler__ applies a unary current selection model to the _panel_ collection
and initially identifies the first element as the _selected panel_.  


By default the system assumes that a _panel_ is its own _zone_ and uses a
default _sensitivity_ which gives a reasonable response for full screen
swipes.

When a valid swipe is detected the handler will perform some action: the built-in
default action is toggles the CSS class of _panels_ using a strategy which maintains the
idea of a 'selected' panel.  Swiping moves the selected panel forwards and backwards
through the _panel_ collection.  Other, or additional, actions can be implemented
by the host application and executed through a callback mechanism.

The _panel_ collection monitored by __SwipeHandler__ can be built at once or
incrementally allowing the handler to be used in both static and dynamic document
contexts.

## Instantiating and configuring SwipeHandler

__SwipeHandler__ is instantiated by a call to ```new SwipeHandler([options])```.
The optional _options_ object is not required, but can be used to tailor the behaviour
of the handler.  The following _options_ properties are available.

__container__

A JS DOM element reference or a string selector expression suitable for use with JavaScript's
```querySelection()``` function: the children of the resolved DOM element constitute the
swipe handler's _panel_ collection.  The supplied value is used once during instantiation
of the __SwipeHandler__ and use of this option may be inapproprate if the host document
is built dynamically or asynchronously.

If no container is specified, the default ```document.body``` will be used.

Setting this value to ```null``` will disable container-based construction of the _panel_
collection.

Examples: { container: document.getElementById("swipeables") }, { container: null }.

__classname__

A string giving a CSS class names which will be applied by __SwipeHandler__ exclusively
to the member of the _panel_ collection which is currently selected.

If undefined, then the value ```swipe-selected``` will be used.

Setting this value to null or to the empty string will stop the handler from applying
any changes to the DOM when a swipe is detected, but management of the current selection
will continue and any configured callback function will be executed.

Example: { classname: "flash" }

__callback__

A boolean function which will be called after the swipe system detects a swipe, but before
it implements any changes to the DOM.  The callback function is passed an object of the form:

    ```{ startX: int, startY: int, endX: int, endY: int, elem: ref }```
    
containing the start end end positions of the detected swipe and a reference to the element
that triggered the response.  The callback can do whatever it likes, but should return true
if it requires the handler's default CSS manipulation to proceed, otherwise false.

__sdtags__

An array specifying document tag names which contain sub-documents.

If undefined, then the value ```[ 'object', 'iframe' ]``` will be used.

Sub-documents require special handling because the swipe detection zone cannot simply be
associate with the _panel_ root element, but must be placed in the contained document
context.  The swipe system asynchronously associates the _zone_ for a _panel_ with a
root tag in __sdtags__ with the ```contentDocument.window``` element of the panel root.
Note that cross-origin security restrictions prevents the swipe system operating directly
on sub-documents that do not originate from the same domain as the parent document: the
situation is easily dealt with by wrapping the sub-document element in ```<div>```.

Example: { callback: function(o) { beep(); return(true); } }

__leftbutton__
__rightbutton__

A DOM element reference or a ```querySelection``` string to which the __SwipeHandler__ will
attach a click event handler to stand in lieu of swipe left and swipe right gestures.  These
options might be useful if your application supports interfaces without touch capability.

If your application provides buttons for non-swipe enabled interfaces, then these can be
linked through these properties.

Example: { leftbutton: document.getElementById('left-button'), rightbutton: 'right-button' }

__sensitivity__

An object of the form ```{ distance: pixels, interval: millis }``` which specifies the minimum
distance in pixels a touch must move to be considered a swipe and the maximum interval in
milliseconds between swipe initiation (touchstart) and completion (touchend).  The default value
is ```{ distance: 200, interval: 500 }```.

__debug__

A boolean value (default is false) indicating that diagnostic output should be written to
the console.
ion.
  
### A simple example

Using __SwipeHandler__ generally involves establishing a container <div> and placing
within it the document components that constitute the _panels_ which will be under
swipe system control.  Since the system default is to use ```document.body``` as the
default container, the simplest approach is something like this.
```
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>SwipeHandler Example 1</title>
  <script type="text/javascript" src="lib/swipe-handler/SwipeHandler.js"></script>
  <style>
    .panel { height: 100vh; width: 100vw; display: none; align-items: center; justify-content: center; }
    .swipehandler-selected { display: flex; }
  </style>
  <body onLoad="new SwipeHandler();">
    <div class="panel">Page 1</div>
    <div class="panel">Page 2</div>
    <div class="panel">
        <object src="https://www.google.com/" />
    </div>
  </body>
</html>
```
The content of the _panel_ elements can be dynamic, but the _panel_ root elements (in
the example, the ```<div>``` elements) must be present when the browser triggers the
document loaded event.
    
If you need to add an element to the swipe system after the host document has loaded
then consider using the ```addPanel()``` method described below.

## Methods

### addPanel(panel, [zone])

Adds document element _panel_ to __SwipeHandler__'s panel collection.  If document element zone is specified then it is used as the gesture detection region for _panel_.  _panel_ and _zone_ can be specified by either a document reference or by a string suitable for use with the JS ```querySelection()``` function.      
```
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>SwipeHandler Example 2</title>
  <script type="text/javascript" src="lib/swipe-handler/SwipeHandler.js"></script>
  <style>
    #swipe-container { display: table; width: 100%; min-height: 200px; }
    #swipe-zone { width: 100%; min-height: 100px; text-align: center; line-height: 100px; background-color: blue; }
    .swipe-panel { display: table-cell; text-align: center; line-height: 200px; border: white solid 3px; background-color: grey; }
    .swipehandler-selected { background-color: red; }
  </style>
  <script>
  function build(sh) {
    for (var i = 0; i < 3; i++) {
      var p = document.createElement('div');
      p.className = 'swipe-panel';
      p.appendChild(document.createTextNode("Panel " + i));
      document.getElementById('swipe-container').appendChild(p);
      sh.addPanel(p, document.getElementById('swipe-zone'));
    }
  }
  </script>
</head>
<body onLoad="build(new SwipeHandler({ container: '#swipe-container' })); ">
  <div id='swipe-container'></div>
  <div id='swipe-zone'>SWIPE HERE</div>
</body>
</html>
```
