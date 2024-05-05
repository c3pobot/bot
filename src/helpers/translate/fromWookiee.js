'use strict'
const shyriiwook = require('./wookiee.json')
module.exports = (content)=>{
  if(!content) return `nothing to translate...`
  let str = ''
  for (let i = 0; i < content.length; i += 1) {
    let char = content[i];
    if (content.substr(i, 4) === "null") {
      str += "null";
      i += 3;
      continue;
    }

    // avoid translating escape sequences
    if (char === "\\" && i < content.length - 1) {
      str += char + content[i + 1];
      i += 1;
      continue;
    }
    if (shyriiwook[char]) {
      str += shyriiwook[char];
    } else {
      if(shyriiwook[char + content[i + 1]]){
        str += shyriiwook[char + content[i + 1]];
        i += 1
      }else{
        str += char;
      }
    }
  }
  return str
}
