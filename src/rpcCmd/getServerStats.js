'use strict'
const bot = require('src/bot')
module.exports = (obj = {})=>{
  let res = {
    guilds: bot?.guilds?.cache?.size
  }
  res.users = bot?.guilds?.cache?.reduce((acc, guild) => acc + guild.memberCount, 0)
  return res
}
