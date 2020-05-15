let easterEgg = 
{ str: "amir",
  length: 4,
  got: 0,
  blockId: "amirHidden",

  amir: function(event)
  {  event = event || window.event;
     let c = event.key;
     console.log(c)
     if(!c) 
     {  let keyCode = event.keyCode || event.which;
        c = String.fromCharCode(keyCode);
        
        
     }
     if( c.toLowerCase() != this.str.charAt(this.got))
        this.got = 0;  // start again
     else
        if(  ++this.got == this.length)
        {   document.getElementById(this.blockId).style.display="block";
            window.removeEventListener("keydown", this.amir, false);
        };
     return true;
  },
}

easterEgg.amir = easterEgg.amir.bind(easterEgg);

window.addEventListener("load", function()
   { window.addEventListener("keydown", easterEgg.amir, false);
   }, false);
