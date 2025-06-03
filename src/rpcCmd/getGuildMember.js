'use strict'
const bot = require('src/bot')
const queryGuild = require('./queryGuild')

module.exports = async(obj = {})=>{
  if(!obj.sId || !obj.dId || !bot?.isReady()) return;

  let guild = await queryGuild(obj, bot)
  if(!guild) return

  let usr = await guild.members?.fetch(obj.dId)
  if(!usr) return;

  let res = JSON.parse(JSON.stringify(usr))
  res.user = JSON.parse(JSON.stringify(usr.user))
  res.guildOwnerID = guild.ownerId
  res.user.avatarURL = await usr.user?.avatarURL({format: 'png', dynamic: true, size: 256})
  res.roles = usr.roles?.cache?.map(r=>{
    return Object.assign({}, {
      id: r.id,
      name: r.name
    })
  })
  res.perms = usr?.permissions.toArray()
  return res
}
