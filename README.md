scriptr.js
=========
---
As the web becomes more and more dynamic, the need for a colorful variety of javascript plugins becomes desireable. This simple script hopes to help manage the workload by grabbing your scripts asynchronously, loading them conditionally, and ensuring that any script that they depend on load first.

---
Version
----

1.0

Features
----

  - full browser support, starting at IE8
  - callback on script load and fail
  - dependency support
  - conditional loading


Basic Implementation
----

```sh

var scriptloader = new scriptr();
scriptloader.register('jquery', {
  slug : 'jquery',
  url  : '/path/to/jquery.js'
});

```
Loading a script with a callback
----

```sh

var scriptloader = new scriptr();
scriptloader.register('jquery', {
  slug   : 'jquery',
  url    : '/path/to/jquery.js',

  onload : function(){
    alert('jQuery is ready to use!');
    jQuery(document).addClass('loaded');
  }

});

```
Loading a script conditionally
----

```sh

var scriptloader = new scriptr();

scriptloader.register('html5shiv', {
  slug   : 'html5shiv',
  url    : '/path/to/html5shiv.js',

  check  : !!document.createElement('canvas').getContext, //returns false in ie8, where html5shiv is needed

  onload : function(){
    alert('html5shiv activated!');
  }
});

scriptloader.loadscripts();

```

Loading a script with a dependency
----

```sh

var scriptloader = new scriptr();

scriptloader.register('jquery', {
  slug   : 'jquery',
  url    : '/path/to/jquery.js',
  onload : function(){
    alert('jQuery is ready to use!');
    jQuery(document).addClass('loaded');
  }
});

scriptloader.register('jqueryplugin', {
  slug   : 'jqueryplugin',
  url    : '/path/to/jqueryplugin.js',

  require : ['jquery'], //the slug of the dependency
  
  onload : function(){
    alert('jQuery plugin activated, but only after jQuery loaded!');
  }
});

scriptloader.loadscripts();

```
