# swipe-handler
Library implementing a simple page-change swipe system.

__swipe-handler__ implements the __SwipeHandler__ class which manages the
visibility of a collection of document elements in response to finger swipes.

## Example of use

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


