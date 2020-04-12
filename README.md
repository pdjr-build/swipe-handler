# swipe-handler

Library implementing __SwipeHandler__, a class supporting a simple swipe
gesture handler.

__SwipeHandler__ monitors an arbitrary collection of document elements called
_panels_, waiting for a swipe gesture on one or more associated _zones_ that
satisfies some defined _sensitivity_ threshold.

By default the system assumes that a panel is its own zone and uses a default
sensitivity which gives a reasonable response for detection of full screen
swipes.

__SwipeHanler__ applies a unary selection model to the panel collection and
begins by establishing the first element added to the panel collection as the
currently selected panel.
When a valid swipe is detected the handler moves the current selection
forwards or backwards through the panel collection and triggers an _action_
on each newly selected panel.

__SwipeHandler__'s default action is to decorate the currently selected panel
with the CSS class name ```swipe-selected```.
The name of the class used to represent selection can be overridden by the host
application which can also disable class name manipulation entirely.
Other, or additional, actions can be implemented by the host application and
executed through a callback mechanism.

The panel collection monitored by __SwipeHandler__ can be built at once or
incrementally allowing the handler to be used in both static and dynamic
document contexts.

## Instantiating and configuring SwipeHandler

__SwipeHandler__ is instantiated by calling ```new SwipeHandler([options])```.
The optional _options_ object can be used to tailor the behaviour of the
handler through the range of properties discussed below.
All properties are optional; most have useful defaults. In all situations
where a reference to a DOM element is required, a string containing a selector
value suitable for passing to ```querySelection()``` and which resolves to the
required DOM element can be supplied instead.

__container__

A reference to a DOM element whose children constitute the swipe handler's
panel collection.
The supplied value is applied once during instantiation of the
__SwipeHandler__ and use of this option may be inapproprate if the host
document is built dynamically or asynchronously.

If container is undefined, then ```document.body``` will be used as the
container.

If container is null, the all container-based initialisation will be disabled.

Examples: { container: document.getElementById("swipeables") }, { container: null }.

__classname__

A string overriding the default CSS class name which will be applied by
__SwipeHandler__ to the currently selected panel.

If undefined, then the value ```swipe-selected``` will be used.

Setting this value to null or to the empty string will stop the handler from
applying any changes to the DOM when a swipe is detected although any
configured callback function will still be executed.

Example: { classname: "flash" }, { classname: null }

__callback__

A boolean function which will be called after the swipe system detects a
swipe, but before it implements any changes to the DOM.
The callback function is passed an object of the form:

```{ startX: int, startY: int, endX: int, endY: int, elem: node-ref }```
    
containing the start end end positions of the detected swipe and a reference to
the about to be selected panel root element.
The callback can do whatever it likes, but should return true if it requires
the handler's CSS manipulation to proceed, otherwise false.

Example: { callback: function(o) { beep(); return(true); } }

__sdtags__

A string array specifying document tag names which contain sub-documents.

If undefined, then the value ```[ 'object', 'iframe' ]``` will be used.

Sub-documents require special handling because the swipe detection zone cannot
simply be associated with the panel root element, but must be placed in the
contained document context.
In this situation the swipe system asynchronously associate a zone with the
```contentDocument.window``` element of the associated panel's root.
Note that cross-origin security restrictions prevent the swipe system operating
directly on sub-documents that do not originate from the same domain as the
parent document: the situation is easily dealt with by wrapping the
sub-document panel element in ```<div>```.

__leftbutton__
__rightbutton__

A reference to a DOM element to which __SwipeHandler__ will attach a click
event-handler to stand in lieu of swipe-left and swipe-right gestures.
These options might be useful if your application supports interfaces without
touch capability.

Example: { leftbutton: document.getElementById('left-button'), rightbutton: 'right-button' }

__sensitivity__

An object of the form ```{ distance: pixels, interval: millis }``` which
specifies the minimum distance in pixels a touch must move to be considered a
swipe and the maximum interval in milliseconds within which a swipe must be
completed.

The default value is ```{ distance: 200, interval: 500 }```.

__debug__

A boolean value indicating that diagnostic output should be written to the
console.

The default value is ```false```.

### A simple example

Using __SwipeHandler__ generally involves establishing a container and placing
within it the document components that constitute the panels which will be
under swipe system control.
Since the system uses ```document.body``` as the default container, the
simplest use of the handler system is like this.
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
The content of the panel elements can be dynamic, but the panel root elements
(in this example the ```<div>``` elements) must be present when the browser
triggers the document loaded event.
    
If you need to add an element to the swipe system after the host document has
loaded then use the ```addPanel()``` method described below.

## Methods

### addPanel(panel, [zone])

Adds document element panel to __SwipeHandler__'s panel collection.
If document element zone is specified then it is used as the gesture detection
region for panel.  Panel and zone can be specified by either a DOM node
reference or by a string suitable for use with the JS ```querySelection()```
function.      
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

### addButtons(left, right)

Adds a click handler to the DOM elements ispecified by _left_ and _right_
which will stand in lieu of swipe-right and swipe-left gestures.
This is a dynamic alternative to specifying the configuration options
leftbutton and rightbutton.
