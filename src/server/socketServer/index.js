'use strict'
global.BotSocket = require('botsocketclient')
const { Server } = require('socket.io')
const Cmds = require('./cmds')
const PORT = process.env.HEALTH_PORT || 3001
const SHARD_NUM = +process.env.SHARD_NUM
const NUM_SHARDS = +process.env.NUM_SHARDS
BotSocket.CreateSockets({cmds: Cmds, debugMsg: debugMsg})
const GetShardId = async(sId, shardID)=>{
  try{
    if(+shardID >= 0) return +shardID
    if(!sId) return
    let shardId = (Number(BigInt(sId) >> 22n) % (+NUM_SHARDS))
    if(+shardId >= 0) return +shardId
  }catch(e){
    console.error(e);
  }
}
const ProcessCmd = async(cmd, obj, content)=>{
  try{
    let res
    let shard = await GetShardId(obj.sId, obj.shard)
    if(shard >= 0 && Cmds[cmd]){
      if(!obj.shard) obj.shard = shard
      if(shard === SHARD_NUM){
        res = await Cmds[cmd](obj, content)
      }else{
        res = await BotSocket.send(cmd, obj, content)
      }
    }
    return res
  }catch(e){
    console.error(e);
  }
}
module.exports = (server)=>{
  try{
    const io = new Server(server, {maxHttpBufferSize: 1e8})
    console.log('bot-'+SHARD_NUM+' socket server is running on port '+PORT)
    io.on('connection', (socket) =>{
      socket.on('disconnect', (reason)=>{
        if(debugMsg) console.log(socket.id+' disconnected because of '+reason)
      })
      socket.on('message', (content, callback)=>{
        if(callback) callback({status: 'ok'})
      })
      socket.on('request', async(cmd, obj, content, callback)=>{
        try{
          let res
          if(botReady) res = await ProcessCmd(cmd, obj, content)
          if(callback) callback(res)
        }catch(e){
          console.error(e)
          if(callback) callback({status: 'error'})
        }
      })
    })
  }catch(e){
    console.error(e)
  }
}
