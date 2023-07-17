'use strict'
const log = require('logger')
const QueWrapper = require('quewrapper')
const USE_PRIVATE = process.env.USE_PRIVATE_WORKERS || false
const CmdQue = {}
const redisConnection = {
	host: process.env.REDIS_SERVER,
	port: +process.env.REDIS_PORT,
	password: process.env.REDIS_PASS
}
const CreateQues = async()=>{
  try{
		let status = await CreateQue('discord')
		if(status && USE_PRIVATE) status = await CreateQue('discordPrivate')
    return status
  }catch(e){
    throw(e)
  }
}
const CreateQue = async(queName)=>{
	try{
		if(!queName) return
		CmdQues[queName].que = new QueWrapper({queName: queName, queOptions: {redis: redisConnection}, logger: log})
		console.log('Created '+queName+' job que...')
		return true
	}catch(e){
		throw(e);
	}
}
module.exports.CreateQues = CreateQues
module.exports.CmdQueAdd = async(type, job)=>{
	try{
		if(!USE_PRIVATE) type = 'discord'
		if(CmdQues[type]?.que) return await CmdQues[type].que.newJob(job)
	}catch(e){
		throw(e)
	}
}
