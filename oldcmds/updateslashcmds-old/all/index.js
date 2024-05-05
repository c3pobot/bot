'use strict'
const guildCmds = require('src/cmds/updateslashcmds/guilds')
const globalCmds = require('src/cmds/updateslashcmds/global')
module.exports = async(obj)=>{
  try{
    if(+process.env.PRIVATE_BOT) await guildCmds(obj)
    await globalCmds(obj)
  }catch(e){
    console.error(e)
  }
}
