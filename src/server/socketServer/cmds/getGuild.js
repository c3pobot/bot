'use strict'
const queryGuild = require('./queryGuild')
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.sId) return;
    let guild = await queryGuild(obj)
    if(!guild) return
    const res = JSON.parse(JSON.stringify(guild))
    res.gRoles = guild.roles?.cache?.map(r=>{
      return Object.assign({}, {
        id: r.id,
        name: r.name,
        count: r.members?.size,
        perms: r.permissions?.toArray()
      })
    })
    res.gChannels = guild.channels?.cache?.map(c=>{
      return Object.assign({}, {
        id: c.id,
        name: c.name,
        type: c.type,
        nsfw: c.nsfw
      })
    })
    res.iconURL = await guild.iconURL({format: 'png', dynamic: true, size: 256})
    res.emojis = guild.emojis?.cache?.map(x=>{
      return Object.assign({},{
        id: x.id,
        name: x.name,
        animated: x.animated
      })
    })
    return res
  }catch(e){
    console.error(e)
  }
}
