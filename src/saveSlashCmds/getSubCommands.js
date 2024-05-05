'use strict'
const log = require('logger')
const fs = require('fs')
const readFile = require('./readFile')
module.exports = async(dir)=>{
  return new Promise((resolve) => {
    fs.readdir(dir, async(err, filenames)=>{
      let res
      if(err) {
        log.error(err)
      }else{
        res = []
        for(let i in filenames){
          if(filenames[i].split('.').length == 1){
            let obj = await readFile(`${dir}/${filenames[i]}/cmd.json`)
            if(obj?.name) res.push(obj)
          }
        }
      }
      resolve(res)
    })
  })
}
