'use strict'
module.exports = async(obj={}, bot)=>{
  try{
    if(!obj.dId) return;
    const res = bot?.guilds?.cache?.filter(x=>x.members?.cache?.has(obj.dId))?.map(g=>{
      return Object.assign({}, {
        id: g.id,
        name: g.name,
        ownerID: g.ownerId,
        roles: g.members?.cache?.find(i=>i.id === obj.dId)?.roles?.cache?.filter(x=>x.name != '@everyone')?.map(r=>r.id) || []
      })
    })
    return res
  }catch(e){
    console.error(e)
  }
}
