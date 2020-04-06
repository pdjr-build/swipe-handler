# swipe-handler

Library implementing __SwipeHandler__, a class supporting a simple, configurable,
swipe gesture handler.

__SwipeHandler__ applies and removes specified CSS classes to a user-defined collection
of document elements in response to finger swipes.  At any point in time, only one
of the elements in the collection will be undecorated by the specified classes.

By default, __SwipeHandler__ operates with the __.hidden__ CSS class and this inverted
selection model supports the most likely use case in which __SwipeHandler__ is used to
control the visibility of a set of page components.  The user will normally only need
to add the CSS definition ```.hidden { display: none; }``` for the system to operate.

__SwipeHandler__ is instantiated by a call to ```new SwipeHandler([options])```.  The
_options_ argument is not required, but can be used to tailor the behaviour of
the handler to suit user requirements.  The following options properties are available.

__container__
: a document element or querySelection string identifying the DOM
             element whose children should form the swipe collection.
  classname: a string containing one or more space-separated class names which
             will be applied to elements in the swipe collection.  Defaults to
             'hidden'.
  callback:  a user supplied function which will be called after the swipe system
             detects a swipe, but before it implements any changes to the DOM. The
             callback is passed an object containing the start end end positions of
             the detected swipe and if it returns false the swipe response will be
             cancelled.
  leftbutton:

the callddddsupports a number of usage patterns.  

Most aspects of __SwipeHandler__ are configurable through the following user-defined
options.



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

There are two broad implementation scenarios.

The first is when the content to be made swipe-able is loaded as part of a single
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


The second is when the content to be
made swipe-able is loaded asynchronously alongside the main document or programmatically
after the main document has itself loaded: in this situation

## new SwipeHandler(options)


