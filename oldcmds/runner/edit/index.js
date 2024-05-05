'use strict'
const TruncateStr = (str, num)=>{
  try{
    if(str.length <= num){
      return str
    }else{
      return str.slice(0, num) + '...'
    }
  }catch(e){
    console.error(e)
  }
}
module.exports = async(obj)=>{
  try{
    const guild = (await mongo.find('discordServer', {_id: obj.sId}))[0]
    if(obj && obj.user && !obj.user.bot && guild && guild.msgEdit){
      const embedMsg = {
        color: 15844367,
        author: {
          name: obj.user.tag,
          icon_url: obj.user.avatarURL
        },
        description: 'Message edited in <#'+obj.chId+'> [Jump to Message](https://discord.com/channels/'+obj.sId+'/'+obj.chId+'/'+obj.msgId+')\n\n**Before**\n'+TruncateStr(obj.oldMsg, 2000)+'\n\n**After**\n'+TruncateStr(obj.newMsg, 2000),
        footer:{
          text: 'Author: '+obj.user.dId+'| Message ID: '+obj.msgId
        },
        timestamp: new Date()
      }
      MSG.SendMsg({chId: guild.msgEdit}, {embed: embedMsg})
    }
  }catch(e){
    console.error(e)
  }
}
