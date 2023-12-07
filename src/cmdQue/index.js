'use strict'
const log = require('logger')
const Queue = require('bull')
const { v4: uuidv4 } = require('uuid')

const createListeners = require('./createListeners')
const CheckJob = require('./checkJob')

const USE_PRIVATE = process.env.USE_PRIVATE_WORKERS || false
const POD_NAME = process.env.POD_NAME || 'bot-0'
let workerTypes = ['discord', 'oauth', 'swgoh'], POD_NUM
if(process.env.WORKER_TYPES) workerTypes = JSON.parse(process.env.WORKER_TYPES)

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
let WorkerQues = {}
const CreateQue = async(queName)=>{
  try{
    log.log('Creating '+queName+' job que...')
    WorkerQues[queName] = new Queue(queName, queOptions)
		if(POD_NUM === 0) createListeners(WorkerQues[queName], queName)
  }catch(e){
    throw(e);
  }
}
const CreateQues = async()=>{
  try{
		let num = POD_NAME.slice(-1), array = POD_NAME.split('-')
		if(array?.length > 1){
      num = +array.pop()
    }
		POD_NUM = +num
    for(let i in workerTypes){
      await CreateQue(workerTypes[i])
      if(USE_PRIVATE) await CreateQue(workerTypes[i]+'Private')
    }
  }catch(e){
    log.error(e);
    setTimeout(CreateQues, 5000)
  }
}
module.exports.start = CreateQues
module.exports.add = async(type, data = {}, jobId = null)=>{
	try{
    let jobQue = type
    if(type?.includes('Private') && !WorkerQues[type]) jobQue = type?.replace('Private', '')
    if(!WorkerQues[jobQue]) return;
		let jobOpts = { jobId: jobId || data.id }
		if(!jobOpts.jobId) jobOpts.jobId = uuidv4()
		await WorkerQues[jobQue].clean(10000, 'failed');
    let res = await WorkerQues[jobQue].add(data, jobOpts)
		console.log(jobQue)
    CheckJob(data, WorkerQues[jobQue])
    return res
	}catch(e){
		throw(e)
	}
}
