const translate = require('@vitalets/google-translate-api');
const fs = require('fs');
const clipboardy = require('clipboardy');
const utf8 = require('utf8');
var readline = require('readline');
const readLastLine = require('read-last-line');
const languages = require("./languages.json");

var args = process.argv.slice(2);

var mylang = args[0]
var logfile = args[1]

if (logfile.endsWith("\\")){
  logfile += "console.log"
}
else{
  logfile += "\\console.log"
}

function setTerminalTitle(title)
{
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

setTerminalTitle("CSGO-Translator by Mecke_Dev");
const blank = '\n'.repeat(process.stdout.rows)
console.log(blank)
readline.cursorTo(process.stdout, 0, 0)
readline.clearScreenDown(process.stdout)

console.log(`
Thank you for using my Translator for CSGO.
make sure you have set:

-condebug

as a startoption for CSGO.

Your selected language is: ${languages[mylang]}

`)

fs.watchFile(logfile, (eventType, filename) => {

  if (filename) {

    readLastLine.read(logfile, 1).then(function (lines) {
      
      last_line = lines;

      if (last_line.startsWith("set_lang ")){

        last_line = last_line.replace("set_lang ", "")

        if (languages[last_line.trim()]){
          mylang = last_line.trim()
          console.log("Set Language to: " + languages[last_line.trim()])
        }
        else{
          console.log(last_line.trim() + " is not a valid Language-Code.")
        }

      }

      if(last_line.startsWith("say_")){
        
        lang = last_line.split(" ")[0].replace("say_", "");
        last_line = last_line.replace("say_", "")
        console.log("\nTranslating....")
        
        text = last_line.replace(lang + " ", " ").trim()

        translate(text, { to: lang }).then(res => {

          clipboardy.writeSync(res.text);

          console.log(`
from: ${text}
to: ${res.text}

Copied - ${res.text} - to the Clipboard

`)
    
        }).catch(err => {
          console.error(err);
        })

      }

      if (last_line.includes(" : ")){

        var name = last_line.split(" : ")[0]
        last_line = last_line.replace(name+" : ", "");

        translate(last_line, { to: mylang }).then(res => {

          console.log(name, ":", res.text)
      
        }).catch(err => {
          console.error(err);
        })

      }

    }).catch(err => {
      console.error(err);
    })

  } else {
    console.log('filename not provided');
  }
});