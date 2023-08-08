'use strict'
const log = require('logger')
const Queue = require('bull')
const { v4: uuidv4 } = require('uuid')
const USE_PRIVATE = process.env.USE_PRIVATE_WORKERS || false
const CmdQues = {}
const queOptions = {
	redis: {
    host: process.env.REDIS_SERVER,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true
  },
  settings: {
    maxStalledCount: 0
  }
}
const CreateQues = async()=>{
  try{
		let status = await CreateQue('discord')
		if(status && USE_PRIVATE) status = await CreateQue('discordPrivate')
    return status
  }catch(e){
    log.error(e)
		setTimeout(CreateQues, 5000)
  }
}
const CreateQue = async(queName)=>{
	try{
		if(!queName) return
		CmdQues[queName] = new Queue(queName, queOptions)
		log.info('Created '+queName+' job que...')
		return true
	}catch(e){
		throw(e);
	}
}
module.exports.CreateQues = CreateQues
module.exports.CmdQueAdd = async(type, data = {}, jobOpts = {})=>{
	try{
		if(!USE_PRIVATE) type = 'discord'
		if(CmdQues[type]){
			await CmdQues[type].clean(10000, 'failed');
			if(!jobOpts.jobId) jobOpts.jobId = data.id
			if(!jobOpts.jobId) jobOpts.jobId = uuidv4()
			return await CmdQues[type].add(data, jobOpts)
		}
	}catch(e){
		throw(e)
	}
}
