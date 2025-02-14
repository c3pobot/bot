'use strict'
const POD_NAME = process.env.POD_NAME || 'bot', SHARD_NUM = +(process.env.POD_INDEX || 0), NUM_SHARDS = +(process.env.NUM_SHARDS || 1)
module.exports = ()=>{
  return { totalShards: NUM_SHARDS, myShard: SHARD_NUM, podName: POD_NAME }
}
