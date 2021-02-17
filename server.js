const translate = require('@vitalets/google-translate-api');
const fs = require('fs');
const clipboardy = require('clipboardy');
const utf8 = require('utf8');
const readLastLine = require('read-last-line');
const languages = require(__dirname + "/languages.json");
const config = require(__dirname + "/settings.json");
const path = require('path');
const { app } = require('electron');
var iconvlite = require('iconv-lite');

var logfile = config.path
var fontsize = config.fontsize

function addChat(text){
  textarea.value += text+'\n';

  if(textarea.selectionStart == textarea.selectionEnd) {
    textarea.scrollTop = textarea.scrollHeight;
 }

};

function save_config(config){
  fs.writeFile(__dirname + "/settings.json", JSON.stringify(config, null, 4), (err) => {
    if (err) return console.log(err)
  })
}

function set_font(font){
  const config = require(__dirname + "/settings.json")
  config.fontsize = font;
  save_config(config);
}

function set_lang(lang){
  const config = require(__dirname + "/settings.json")
  addChat("Set Language to: " + languages[lang])
  config.language = lang;
  save_config(config);
}

function set_path(path){
  const config = require(__dirname + "/settings.json")
  addChat(path)
  config.path = path;
  save_config(config);
}

fs.watchFile(logfile, (eventType, filename) => {

  if (filename) {
    
    const config = require(__dirname + "/settings.json");
    
    var mylang = config.language
    var logfile = config.path

    readLastLine.read(logfile, 2).then(function (lines) {
      
      last_line = lines;

      if (last_line.startsWith("set_lang ")){

        last_line = last_line.replace("set_lang ", "")

        if (languages[last_line.trim()]){
          mylang = last_line.trim()
          set_lang(mylang)
        }
        else{
          addChat(last_line.trim() + " is not a valid Language-Code.")
        }

      }

      if(last_line.startsWith("say_")){
        
        lang = last_line.split(" ")[0].replace("say_", "");
        last_line = last_line.replace("say_", "")
        
        text = last_line.replace(lang + " ", " ").trim()

        text = iconvlite.decode(text, 'utf8');

        translate(text, { to: lang }).then(res => {

          clipboardy.writeSync(res.text);

          addChat(`
from: ${text}
to: ${res.text}
saved to Clipboard.

`)
    
        }).catch(err => {
          console.error(err);
        })

      }

      if (last_line.includes(" : ")){

        var name = last_line.split(" : ")[0]
        last_line = last_line.replace(name+" : ", "");

        last_line = iconvlite.decode(last_line, 'utf8');

        translate(last_line, { to: mylang }).then(res => {

          addChat(name + " : " + res.text)
      
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