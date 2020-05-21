/**
 * This code is used to listen for keystrokes from
 * user and to generate a link when the correct
 * 'code' is input. The correct code is "amir".
 * 
 * The code is derived from the following sources and authors:
 * @author Vojislav Grujić 
 * @see https://medium.com/javascript-in-plain-english/
 * 
 * @author Niet the Dark Absol
 * @see https://stackoverflow.com/questions/32236313/
 */
let easterEgg = {
   str: "amir",
   length: 4,
   got: 0,
   blockId: "amirHidden",

   amir: function (event) {
      event = event || window.event;
      let c = event.key;
      console.log(c)
      if (!c) {
         let keyCode = event.keyCode || event.which;
         c = String.fromCharCode(keyCode);


      }
      if (c.toLowerCase() != this.str.charAt(this.got))
         this.got = 0; // start again
      else
      if (++this.got == this.length) {
         document.getElementById(this.blockId).style.display = "block";
         window.removeEventListener("keydown", this.amir, false);
      };
      return true;
   },
}

easterEgg.amir = easterEgg.amir.bind(easterEgg);

window.addEventListener("load", function () {
   window.addEventListener("keydown", easterEgg.amir, false);
}, false);