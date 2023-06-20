'use strict'
module.exports = async(obj = {}, content)=>{
  try{
    const res = bot?.guilds?.cache?.map(g=>{
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
  }catch(e){
    console.error(e);
  }
}
