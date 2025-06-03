'use strict'
const bot = require('src/bot')

module.exports = (obj = {})=>{
  if(!bot?.isReady()) return
  
  let res = bot?.guilds?.cache?.map(g=>{
    return Object.assign({},{
      id: g.id,
      shardID: g.shardID,
      name: g.name,
      ownerID: g.ownerID,
      members: g.members.cache.map(m=>{
        return Object.assign({},{
          id: m.id,
          roles: m.roles?.cache?.filter(x=>x.name != '@everyone').map(x=>x.id)
        })
      })
    })
  })
  return res
}
