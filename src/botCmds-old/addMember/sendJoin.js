'use strict'
const getAccountAge = require('src/helpers/getAccountAge')

module.exports = async(member, chId, bot)=>{
  if(!bot) return
  let channel = await bot.channels?.fetch(chId)
  if(!channel) return;

  let avatarURL = await member.user.avatarURL({format: 'png', dynamic: true, size: 256})
  let embedMsg = {
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
    let tempField = {
      name: '**Account Age**',
      value: new Date(member.user.createdTimestamp)
    }
    tempField.value = getAccountAge(member.user.createdTimestamp)
    if(tempField.value) embedMsg.fields.push(tempField)
  }
  channel.send({embeds: [embedMsg]})
}
