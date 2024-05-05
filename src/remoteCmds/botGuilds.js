'use strict'
module.exports = (obj = {}, bot)=>{
  if(!bot) return
  let res = bot.guilds.cache.map(g=>{
    return Object.assign({},{
      id: g.id,
      shardID: g.shardId,
      name: g.name,
      ownerID: g.ownerId,
      members: g.members.cache.map(m=>{
        return Object.assign({},{
          id: m.id,
          roles: m.roles.cache.filter(x=>x.name != '@everyone').map(x=>x.id)
        })
      })
    })
  })
  return res
}
