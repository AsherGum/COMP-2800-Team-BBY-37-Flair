var easterEgg = 
{ str: "amir",
  length: 4,
  got: 0,
  blockId: "hideaway",

  test: function(event)
  {  event = event || window.event;
     var c = event.key;
     if(!c) // legacy method
     {  var keyCode = event.keyCode || event.which;
        c = String.fromCharCode(keyCode);
     }
     if( c.toLowerCase() != this.str.charAt(this.got))
        this.got = 0;  // start again
     else
        if(  ++this.got == this.length)
        {   document.getElementById(this.blockId).style.display="block";
            window.removeEventListener("keydown", this.test, false);
        };
     return true;
  },
}
easterEgg.test = easterEgg.test.bind(easterEgg);

window.addEventListener("load", function()
   { window.addEventListener("keydown", easterEgg.test, false);
   }, false);
