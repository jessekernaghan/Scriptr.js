scriptr.js
=========
---
This simple plugin hopes to improve performance by grabbing your scripts asynchronously, loading them conditionally, and ensuring that any script that they depend on load first.

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

//the first parameter (in this case, 'jquery') is an arbitrary slug for
//referencing this script when doing dependency loading
scriptloader.register('jquery', {
  url  : '/path/to/jquery.js'
});

scriptloader.loadscripts();

```

Multiple Scripts
----

```sh

var scriptloader = new scriptr();

scriptloader.register('script1', {
  url  : '/path/to/script1.js'
});

scriptloader.register('script2', {
  url  : '/path/to/script2.js'
});

scriptloader.register('script3', {
  url  : '/path/to/script3.js'
});

scriptloader.loadscripts();

```

Loading a script with a callback
----

```sh

var scriptloader = new scriptr();

scriptloader.register('jquery', {
  url    : '/path/to/jquery.js',

  onload : function(){
    alert('jQuery is ready to use!');
    jQuery(document).addClass('loaded');
  }

});

scriptloader.loadscripts();

```
Loading a script conditionally
----

```sh

var scriptloader = new scriptr();

scriptloader.register('html5shiv', {
  url    : '/path/to/html5shiv.js',

  check  : !document.createElement('canvas').getContext, //returns false in ie8, where html5shiv is needed

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
  url    : '/path/to/jquery.js',
  onload : function(){
    alert('jQuery is ready to use!');
    jQuery(document).addClass('loaded');
  }
});

scriptloader.register('jqueryplugin', {
  url    : '/path/to/jqueryplugin.js',

  require : ['jquery'], //the slug of the dependency

  onload : function(){
    alert('jQuery plugin activated, but only after jQuery loaded!');
  }
});

scriptloader.loadscripts();

```

Deregistering Scripts
----

```sh

var scriptloader = new scriptr();

scriptloader.register('jquery', {
  url    : '/path/to/jquery.js',
  onload : function(){
    alert('jQuery is ready to use!');
    jQuery(document).addClass('loaded');
  }
});

scriptloader.deregister('jquery');

scriptloader.loadscripts(); //jquery won't be one of them

```
