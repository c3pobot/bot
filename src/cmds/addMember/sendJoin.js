'use strict'
module.exports = async(member, chId)=>{
  try{
    const channel = await bot.channels.fetch(chId)
    if(!channel) return;
    const avatarURL = await member.user.avatarURL({format: 'png', dynamic: true, size: 256})
    const embedMsg = {
      color: 15844367,
      author: {
        name: 'Member Joined'
      },
      fields: [],
      timestamp: new Date(),
      description: (member.user.id ? '<@'+member.user.id+'>':'@'+member.user.username)+' '+member.user.tag,
      footer: {
        text: 'ID: '+member.user.id
      }
    }
    if(avatarURL){
      embedMsg.author.icon_url = avatarURL
      embedMsg.thumbnail = { url: avatarURL }
    }
    if(member.user.createdTimestamp){
      const tempField = {
        name: '**Account Age**',
        value: new Date(member.user.createdTimestamp)
      }
      tempField.value = await getAccountAge(member.user.createdTimestamp)
      embedMsg.fields.push(tempField)
    }
    channel.send({embeds: [embedMsg]})
  }catch(e){
    console.error(e);
  }
}
