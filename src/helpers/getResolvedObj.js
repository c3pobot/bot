'use strict'
module.exports = (resolved)=>{
  if(!resolved) return
  let res = {}
  if(resolved.members) res.members = resolved.members.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.users) res.users = resolved.users.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.roles) res.roles = resolved.roles.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.channels) res.channels = resolved.channels.reduce((a,v) =>({...a, [v.id]:v}), {})
  return res
}
