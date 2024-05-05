'use strict'
module.exports = (obj = {}, bot)=>{
  let res = {
    guilds: bot?.guilds?.cache?.size
  }
  res.users = bot?.guilds?.cache?.reduce((acc, guild) => acc + guild.memberCount, 0)
  return res
}
