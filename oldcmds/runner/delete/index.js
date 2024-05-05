'use strict'
module.exports = async(obj)=>{
  try{
    const guild = (await mongo.find('discordServer', {_id: obj.sId}))[0]
    if(obj && obj.user && !obj.user.bot && guild && guild.msgDelete){
      const embedMsg = {
        color: 15844367,
        author: {
          name: obj.user.tag,
          icon_url: obj.user.avatarURL
        },
        thumbnail: {
          url: obj.user.avatarURL
        },
        description: 'Message sent by <@'+obj.user.dId+'> deleted in <#'+obj.chId+'>\n'+obj.content,
        footer:{
          text: 'Author: '+obj.user.dId+'| Message ID: '+obj.msgId
        },
        timestamp: new Date()
      }
      MSG.SendMsg({chId: guild.msgDelete}, {embed: embedMsg})
    }
  }catch(e){
    console.error(e)
  }
}
