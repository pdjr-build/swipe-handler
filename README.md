# swipe-handler

Library implementing __SwipeHandler__, a class supporting a simple, configurable,
swipe gesture handler.

__SwipeHandler__ attaches to an arbitrary collection of document elements called
_panels_ waiting for a swipe gesture on one or more associated _zones_ that
satisfies some defined _sensitivity_ threshold.

By default the system assumes that a _panel_ is its own _zone_ and uses a
default _sensitivity_ which gives a reasonable response for full screen
swipes.

When a swipe is detected the handler will perform some action: the built-in default
action just toggles the CSS class of _panels_ using a strategy which maintains the
idea of a 'selected' panel.  Swiping moves the selected panel forwards and backwards
through the _panel_ collection.  Other, or additional, actions can be implemented
by the host application and executed through a callback mechanism.

The _panel_ collection monitored by __SwipeHandler__ can be built at once or
incrementally allowing the handler to be used in both static and dynamic document
contexts.

## Instantiating and configuring SwipeHandler

__SwipeHandler__ is instantiated by a call to ```new SwipeHandler([options])```.
The _options_ argument is not required, but can be used to tailor the behaviour of
the handler to suit user requirements.  The following options properties are available.

__options.container__

A string selector (suitable for use with JavaScript's ```querySelection()``` function)
or a JS reference to a DOM element whose children constitute the swipe _panel_ collection.
If no container is specified, the default ```document.body``` will be used.  To disable
container-style processing, set this value to null.

The value supplied is used once during instantiation of the __SwipeHandler__ and use of
this option may be inapproprate if the host document is built dynamically or asynchronously.

Examples: { container: document.getElementById("swipeables") }, { container: null }.

__options.classname__

A string containing zero or more space-separated CSS class names which will be applied
to elements in the swipe collection.  If undefined, then the value "hidden" will be used.
To stop the handler from applying any class changes set this value to null or the empty
string.

Example: { classname: "redbackground flashbackground" }

__options.callback__

A boolean function which will be called after the swipe system detects a swipe, but before
it implements any changes to the DOM.  The callback function is passed an object of the form:

    ```{ startX: int, startY: int, endX: int, endY: int, elem: ref }```
    
containing the start end end positions of the detected swipe and a reference to the element
that triggered the response.  The callback can do whatever it likes, but should return true
if it requires the handler's default CSS manipulation to proceed, otherwise false.

__options.sdtags__

An array specifying _panel_ containers which will be assumed to hold a sub-document.  The
default value is [ 'object' ].

Sub-documents require special handling because the swipe detection zone cannot simply be
associate with the _panel_ root element, but must be placed in the contained document
context.  The swipe system asynchronously associates the _zone_ for a _panel_ tag in the
__options.sdtags__ list with the ```contentDocument.window``` element of the
sub-document.  Cross-origin security prevents the swipe system operating with sub-documents
that do not originate from the same domain as the parent document.

Example: { callback: function(o) { beep(); return(true); } }

__options.leftbutton__
__options.rightbutton__

A DOM element reference or a ```querySelection``` string to which the __SwipeHandler__ will
attach a click event handler to stand in lieu of swipe left and swipe right gestures.  These
options might be useful if your application supports interfaces without touch capability.

If your application provides buttons for non-swipe enabled interfaces, then these can be
linked through these properties.

Example: { leftbutton: document.getElementById('left-button'), rightbutton: 'right-button' }

__options.sensitivity__

An object of the form ```{ distance: pixels, interval: millis }``` which specifies the minimum
distance in pixels a touch must move to be considered a swipe and the maximum interval in
milliseconds between swipe initiation (touchstart) and completion (touchend).  The default value
is ```{ distance: 200, interval: 500 }```.

__options.debug__

A boolean value (default is false) indicating that diagnostic output should be written to
the console.
ion.
  
### A simple example

Using __SwipeHandler__ generally involves establishing a container <div> and placing
within it the document components that constitute the _panels_ which will be under
swipe system control.  Since the system default is to use ```document.body``` as the
default container, the simplest approach is something like this.
```
<html>
<head>
  <style>
    .panel { height: 100vh; width: 100vw; }
    .hidden { display: none; }
  </style>
  <body onLoad="new SwipeHandler();">
    <div class="panel">Page 1</div>
    <div class="panel">Page 2</div>
    <object class="panel" src="/some/document/"></object>
  </body>
</html>
```
The content of the _panel_ elements can be dynamic, but the _panel_ root elements (in
the example, the <div> and <object> elements) must be present when the browser triggers
the document loaded event.
    
If you need to add an element to the swipe system after the host document has loaded
then consider using the ```addPanel()``` method described below.

## Methods

### addPanel(panel, [zone])

Adds document element _panel_ to __SwipeHandler__'s panel collection.  If document element zone is specified then it is used as the gesture detection region for _panel_.  _panel_ and _zone_ can be specified by either a document reference or by a string suitable for use with the JS ```querySelection()``` function.      
```
<html>
<head>
  <style>
    .swipe-container { width: 100vw; height: 100vh; }
    .swipe-container div { height: 100%; width: 30%; background-color: red; }
    .grey-back { background-color: grey; }
  </style>
  <script>
  function build(sh) {
    for (var i = 0; i < 3; i++) {
      var p = document.createElement('div');
      document.getElementById('swipe-container').appendChild(p);
      sh.addPanel(p, document.body);
    }
  }
  </script>
  <body onLoad="build(new SwipeHandler({ container: '#swipe-container', classname: "grey-back"  })); ">
    <div id="swipe-container">
    </div>
  </body>
</html>
```
