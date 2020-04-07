# swipe-handler

Library implementing __SwipeHandler__, a class supporting a simple, configurable,
swipe gesture handler.

__SwipeHandler__ monitors an arbitrary collection of document elements for swipe
gestures.  The handler provides built-in support for toggling CSS classes in
response to a swipe and implements a callback mechanism which can be used by
the host application alongside or instead of this default behaviour.

The document element collection monitored by __SwipeHandler__ can be built at once
or incrementally allowing the handler to be used in both static and dynamic document
contexts.

__SwipeHandler__ is instantiated by a call to ```new SwipeHandler([options])```.
The _options_ argument is not required, but can be used to tailor the behaviour of
the handler to suit user requirements.  The following options properties are available.

__options.container__

A string selector (suitable for use with JavaScript's ```querySelection()``` function)
or a JS reference to a DOM element whose children constitute the swipe collection.  The
value supplied is used once during instantiation of the __SwipeHandler__ and use of this
setting may be inapproprate if the host document is built dynamically or asynchronously.

Examples: { container: document.body }, { container: "#swipeables" }.

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

Example: { callback: function(o) { beep(); return(true); } }

__options.leftbutton__
__options.rightbutton__

A DOM element reference or a ```querySelection``` string to which the __SwipeHandler__ will
attach a click event handler to stand in lieu of swipe left and swipe right gestures.  These
options might be useful if your application supports interfaces without touch capability.

If your application provides buttons for non-swipe enabled interfaces, then these can be
linked through these properties.

Example: { leftbutton: document.getELementById('left-button'), rightbutton: 'right-button' }

__options.sensitivity__

An object of the form ```{ distance: pixels, interval: millis }``` which specifies the minimum
distance in pixels a touch must move to be considered a swipe and the maximum interval in
milliseconds between swipe initiation (touchstart) and completion (touchend).  The default value
is ```{ distance: 200, interval: 500 }```.

__options.debug__

A boolean value (default is false) indicating that diagnostic output should be written to
the console.



The swipe handler manages the visibility of the child elements of some _container_.
Typically _container_ will be a document <body> or <div> element and by default
its children will be adopted by the handler which will scroll their visibility in
response to left-right swipes.
  
With a document of the form:
```
<body>
  <object src="a_url">
  <object src="another_url">
</body>
```
then the code:
```
var swipeHandler = new SwipeHandler({ container: document.body });
```
will adopt the <object> element content, initially exposing just the first element
and hiding all others.  A right-to-left finger-swipe will hide the displayed element
and reveal the next in sequence, rolling around to the first element at the end of
the sequence.  A left-to-right finger-swipe reverses direction.
  
## Setting up the swipe handler

The simplest way to set up a document for __SwipeHandler__ is to establish an arbitrary
container and to place within it the document components which will be under swipe system
control.  For example:
```
<htm>
<head>
  <style>
    .panel { height: 100vh; width: 100vw; }
    .hidden { display: none; }
  </style>
  <body onLoad="new SwipeContainer({ container: document.body });">
    <div class="panel">Page 1</div>
    <div class="panel">Page 2</div>
    <div class="panel">Page 3</div>
  </body>
</html>
```
The content of the <div> elements which will be under swipe system control can be
dynamic, but <div> elements themselves must be present when the document has loaded.
If you need to add an element to the swipe system after the host document has loaded
then consider using the ``addPanel()``` method described below.
    
One particular case in which the above approach will not work is illustrated in the
following example.
```
<htm>
<head>
  <style>
    .panel { height: 100vh; width: 100vw; }
    .hidden { display: none; }
  </style>
  <body onLoad="new SwipeContainer({ container: document.body });">
    <object class="panel" src="/some/url"/>
    <object class="panel" src="/some/other/url"/>
    <object class="panel" src="/some/further/url"/>
  </body>
</html>
```
The swipe system needs to reach inside the documents referenced by the object src tags
in order to attach its required touch event handlers.  However, browser's will load
these sub-documents asynchronously and the onLoad event on the main document will trigger
before these loads have completed.  It won't work.

The solution is to add controlled elements dynamically as each of the sub-documents are
loaded.  One way of doing this is to wait for the appearance of a contentDocument.window
component inside each of the <object> elements and the to use the ```addPanel()``` method
to update 

There are two broad implementation scenarios.

1. The elements which must be under __SwipeHandler__ control are loaded into the DOM.
   Note that the content of The first is when the content to be made swipe-able is loaded as part of a single
document and once the document is fully loaded it is available for adoption by the
swipe system.  In this case, __SwipeHandler__ can be instantiated by passing the
container of the swipe-able content to the class constructor and allowing the
system to automatically configure.  For example:
```
<body onLoad="new SwipeHandler({ container: document.body });">
  <div> ...swipe-able content part one... </div>
  <div> ...swipe-able content part two... </div>
  ...
</body>
```



