'use strict'
const getAccountAge = (timeStamp)=>{
  try{
    let timeDiff = +Date.now() - +timeStamp
    timeDiff = Math.floor(timeDiff / 1000)
    const years = Math.floor(timeDiff / 31536000)
    timeDiff = timeDiff - (31536000 * years)
    const months = Math.floor(timeDiff / 2628000)
    timeDiff = timeDiff - (2628000 * months)
    const days = Math.floor(timeDiff / 86400)
    return years+' years, '+months+' months, '+days+' days'
  }catch(e){
    console.log(e)
  }
}
module.exports = async(obj)=>{
  try{
    const guild = (await mongo.find('discordServer', {_id: obj.sId}))[0]
    if(guild && guild.newMember && obj && obj.user){
      const embedMsg = {
        color: 15844367,
        author: {
          name: 'Member Joined',
          icon_url: obj.user.avatarURL
        },
        thumbnail: {
          url: obj.user.avatarURL
        },
        fields: [],
        timestamp: new Date(),
        description: (obj.user.dId ? '<@'+obj.user.dId+'>':'@'+obj.user.username)+' '+obj.user.tag,
        footer: {
          text: 'ID: '+obj.user.dId
        }
      }
      if(obj.user.createdTimestamp){
        const tempField = {
          name: '**Account Age**',
          value: new Date(obj.user.createdTimestamp)
        }
        tempField.value = await getAccountAge(obj.user.createdTimestamp)
        embedMsg.fields.push(tempField)
      }
      MSG.SendMsg({chId: guild.newMember, sId: obj.sId}, {embed: embedMsg})
    }
    if(obj && obj.user && guild && guild.welcome && guild.welcome.msg && guild.welcome.chId && guild.welcome.status > 0){
      const msg2Send = guild.welcome.msg.replace(/%user%/g, '<@'+obj.user.dId+'>')
      MSG.SendMsg({chId: guild.welcome.chId, sId: obj.sId}, {content: msg2Send})
    }
    if(obj && obj.user && guild && guild.welcomeAlt && guild.welcomeAlt.msg && guild.welcomeAlt.chId && guild.welcomeAlt.status > 0){
      const msg2Send = guild.welcomeAlt.msg.replace(/%user%/g, '<@'+obj.user.dId+'>')
      MSG.SendMsg({chId: guild.welcomeAlt.chId, sId: obj.sId}, {content: msg2Send})
    }
  }catch(e){
    console.error(e)
  }
}
