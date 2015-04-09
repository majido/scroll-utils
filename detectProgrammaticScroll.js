(function(){
  // Override function in given prototype to add a log statement 
  function logMethod(prototype, fname) {
    var original =  prototype[fname];
    
    prototype[fname] = function() {
      console.log(prototype.constructor.name + '::' + fname + ' invoked with ' + JSON.stringify(Array.prototype.slice.call(arguments)));
      // debugger;
      original.apply(this, arguments);
    };
  }
  
  // Override property setter to add a log statement
  function logSetter(prototype, property) {
    var original = Object.getOwnPropertyDescriptor(prototype, property);
    
    Object.defineProperty(prototype, property, {
      set: function(v) {
        var changed = v !== original.get.call(this);
        console.log(prototype.constructor.name + '::' + property + ' set to:' + v + (changed?' (changed)':' (not changed)')); // add changed indicator
        // debugger;
        original.set.call(this, v);
      },
      get: original.get
    });
  }
  
  var windowScrollMethods = ['scrollBy', 'scrollTo', 'scroll'];
  for (var i = 0; i < windowScrollMethods.length; i++)
    logMethod(Window.prototype, windowScrollMethods[i]);
  
  var elementScrollMethods = ['scrollIntoView', 'scrollIntoViewIfNeeded', 'focus'];
  for (var i = 0; i < elementScrollMethods.length; i++)
    logMethod(Element.prototype, elementScrollMethods[i]);
  
  // Note that this requires DOM attributes to be defined on prototype chain
  // which is only true for Chrome version >= 44
  var scrollProperties = ['scrollTop', 'scrollLeft'];
  for (var i = 0; i < scrollProperties.length; i++)
    logSetter(Element.prototype, scrollProperties[i]);
})();