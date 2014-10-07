/*/////////////////////////////////////////////////
// #scriptr.js
/////////////////////////////////////////////////*/

var scriptr = function(){
	this.scripts = {}; //script list
   this.scriptnode = {}; //node scripts will append after
   
   this.nowLoading = []; //the loading queue to be checked when firing load function
   //Initialization
   this.compatibilize();
   this.configure();
}

scriptr.prototype = {
	
   /*-----
     Compatibility flag
     -----*/
   compatible : false,

   /*-----
     Modify environmentals
     -----*/
   compatibilize : function(){
     if(this.compatible) return true; 

     /* indexof compatibility check (ie8) */
     if(!Array.prototype.indexOf){Array.prototype.indexOf=function(e,t){var n;if(this==null){throw new TypeError('"this" is null or not defined')}var r=Object(this);var i=r.length>>>0;if(i===0){return-1}var s=+t||0;if(Math.abs(s)===Infinity){s=0}if(s>=i){return-1}n=Math.max(s>=0?s:i-Math.abs(s),0);while(n<i){var o;if(n in r&&r[n]===e){return n}n++}return-1}}

     /* no document.head? ie8... again */
     if(!document.head){ document.head = document.getElementsByTagName('head')[0]; }

     /* compatibility overwrites here */

     scriptr.prototype.compatible = true;
   },
  
   /*-----
     Set variables
     -----*/
   configure : function(){
      
     var scripts = document.getElementsByTagName('script');
     this.scriptnode = scripts[scripts.length - 1];
    
   },
  
   /*-----
     Add script to the queue
     -----*/
   register : function(slug, parameters){
	  this.scripts[slug] = parameters;
     this.scripts[slug].loadnext = [];
     this.scripts[slug].loaded   = false;
     this.scripts[slug].check    = (this.scripts[slug].check != undefined) ? this.scripts[slug].check : true;
	},

   /*-----
     Remove script from the queue
     -----*/
	deregister : function(slug){
    
      delete(this.scripts[slug]);
    
	},
  
  exists : function(slug){
      var script;
      
      if( (script = this.scripts[slug]) == undefined){
        throw 'The script handle ' + slug + ' doesn\'t exist';
        return false;
      }else{
        return this.scripts[slug];
      }
  },

   /*-----
     Load script onto page
     -----*/
	load : function(slug){
      var scriptdata = this.exists(slug),
          base = this;
     if(!scriptdata){ return false; }
     this.scripts[slug].loading = true;
    
     /* if this script is loaded, skip directly to loadnext */

      /* does this script depend on stuff?
          If yes, check if loaded and if not loaded, 
          defer loading of this script until the 
          prereqs are loaded 
        */
      var prereqs = scriptdata.require;
      if( prereqs instanceof Array &&
           prereqs.length != 0 ){
        
        var curscript,
            curslug;
        
        
        for(var i = 0, l = prereqs.length; i < l; i++){
          
          /* assign */  
          curslug   = prereqs[i];
          curscript = this.exists(curslug);
          
          /* loaded && exists? Jolly good, move to next */
          if(curscript && curscript.loaded){ continue; }
          
          //tell the prereq script to load this one after
          curscript.loadnext.push(slug);
          if(!curscript.loading){
            this.load(curslug);
          }
          
          //stop this one from loading
          return false;
        }
        
      }
    
      /* continue on with the script creation */
      var newscript = document.createElement('script');
      var done = false;

      newscript.onload = newscript.onreadystatechange = function(){
         if ( !done && (!this.readyState ||
            this.readyState === "loaded" || this.readyState === "complete") ) {
          done = true;
          //let everyone know this is loaded right away
          base.scripts[slug].loaded = true;
          //do dev's specified onload function
          if(scriptdata.onload instanceof Function){     
            scriptdata.onload();
          }

          newscript.onload = newscript.onreadystatechange = null;

          //fire off dependant scripts
          base.loadnext(scriptdata.loadnext);
        }
      }

      /* set error handler */
      if(newscript.onerror instanceof Function){
        newscript.onerror = scriptdata.onerror;
      }
      
      newscript.async = 'true';
      newscript.src     = scriptdata.url;
      
      document.head.appendChild(newscript);
    
	},
  
   loadnext : function(next){
     if( next instanceof Array && next.length > 0){
       for( var x = 0, h = next.length; x < h; x++){
         this.load(next[x]);
       }
     }
   },

   /*-----
     Process all registered scripts
     -----*/
	loadscripts : function(){
      var prereqs = [],
          scripts = this.scripts,
          prereq;
      
      
      for (var script in scripts){
        
        prereq = this.scripts[script].require;
        
        if(prereq instanceof Array && prereq.length != 0){
          
          prereqs = prereqs.concat(prereq);
        }
        
      }
    
      for (var script in scripts){
        
        if( prereqs.indexOf(script) == -1 && scripts[script].check ){
          
          this.load(script);
          
        }
        
      }
	}

}
