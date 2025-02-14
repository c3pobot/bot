'use strict'
const fs = require('fs')
const log = require('logger')
const getSubCommands = require('./getSubCommands')
const readFile = require('./readFile')
module.exports = (dir, dbKey)=>{
  return new Promise((resolve) => {
    fs.readdir(dir, async(err, filenames)=>{
      let data = {cmdMap: {}, cmds: []}
      if(err) {
        log.error(err)
      }else{
        for(let i in filenames){
          if(filenames[i].split('.').length == 1){
            let obj = await readFile(`${dir}/${filenames[i]}/cmd.json`)
            if(obj?.worker !== dbKey) continue
            if(obj?.cmd?.name && data.cmds.filter(x=>x.cmd.name === obj.cmd.name).length === 0){
              if(obj?.cmd?.options?.length == 0){//has GetSubCommands
                let subCommands = await getSubCommands(`${dir}/${filenames[i]}`)
                if(subCommands?.length > 0) obj.cmd.options = subCommands
              }
              data.cmds.push(obj)
              data.cmdMap[obj.cmd.name] = {type: obj.type, worker: dbKey}
            }
          }
        }
      }
      resolve(data)
    })
  })
}
