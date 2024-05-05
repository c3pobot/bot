'use strict'
module.exports = async(obj)=>{
  try{
    let msg2send = {content: "Error getting SlashCmds from DB"}, globalCmds = []
    if(process.env.IS_TEST_BOT){
      msg2send.content = 'No global commands for the test bot'
    }else{
      const payload = {}
      if(process.env.PRIVATE_BOT) payload._id = 'discord'
      let slashCmds = await mongo.find('slashCmds', payload)
      if(slashCmds.length == 0) msg2send.content = 'There are no slashCmds saved in the database'
      if(slashCmds.length > 0){
        msg2send.content = "Error parsing SlashCmds"
        for(let i in slashCmds){
          let tempCmds = []
          if(process.env.PRIVATE_BOT){
            tempCmds = slashCmds[i].cmds.map(c=>c.cmd)
          }else{
            tempCmds = slashCmds[i].cmds.filter(x=>x.type && x.type.includes('public')).map(c=>c.cmd)
          }
          if(tempCmds.length > 0) globalCmds = globalCmds.concat(tempCmds)
        }
      }
      if(globalCmds?.length > 0){
        const status = await MSG.AddGlobalCmd(globalCmds, 'PUT')
        msg2send.content = '**'+(status && status.length >= 0 ? status.length:0)+'** of **'+globalCmds.length+'** global commands where updated'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    HP.ReplyError(obj);
    console.error(e);
  }
}
