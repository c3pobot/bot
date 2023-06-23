'use strict'
const NUM_SHARDS = +process.env.NUM_SHARDS
const SHARD_NUM = +process.env.SHARD_NUM
module.exports = async(obj = {}, content)=>{
  try{
    const res = {
      guilds: +(bot?.guilds?.cache?.size || 0),
      users: +(bot?.guilds?.cache?.reduce((acc, guild) => acc + guild.memberCount, 0) || 0)
    }
    for(let i = 0;i<NUM_SHARDS;i++){
      if(+i === +SHARD_NUM) continue;
      const tempObj = await BotSocket.send('getServerStats', {shard: +i})
      if(tempObj.guilds) res.guilds += +tempObj.guilds
      if(tempObj.users) res.users += +tempObj.users
    }
    return res
  }catch(e){
    console.error(e);
  }
}
