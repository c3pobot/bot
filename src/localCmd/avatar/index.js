'use strict'
const log = require('logger')
const getUser = require('./getUser')
const getGuild = require('./getGuild')
module.exports = (obj)=>{
  let member = obj?.options?.get('user')?.member || obj.member
  let sId = obj?.options?.get('server')?.value?.toString()?.trim()
  if(sId) return getGuild(obj, sId)
  return getUser(obj, member)
}
