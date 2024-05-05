'use strict'
const fs = require('fs')
const log = require('logger')
module.exports = async(file)=>{
  try{
    let obj = await fs.readFileSync(file)
    if(obj) return JSON.parse(obj)
  }catch(e){
    log.error('Error reading file '+file)
  }
}
