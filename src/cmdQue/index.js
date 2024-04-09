'use strict'
const fs = require('fs')
const log = require('logger')
const Queue = require('bull')
const { v4: uuidv4 } = require('uuid')

const createListeners = require('./createListeners')
const CheckJob = require('./checkJob')

const USE_PRIVATE = process.env.USE_PRIVATE_WORKERS || false
const POD_NAME = process.env.POD_NAME || 'bot-0'
const QUE_PREFIX = process.env.QUE_PREFIX
let CHECK_TEST_WORKER = process.env.CHECK_TEST_WORKER || false
let TEST_WORKER = false
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
const CheckTestWorker = async()=>{
	try{
		let data = await fs.readFileSync('/app/src/cmdQue/testWorker.json')
		if(data){
			let obj = JSON.parse(data)
			TEST_WORKER = obj.TEST_WORKER
		}
	}catch(e){
		log.error(e)
	}
}
const CreateQue = async(queName)=>{
  try{
		if(TEST_WORKER) queName += 'Test'
		log.info(`Creating ${queName} job que...`)
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
		if(CHECK_TEST_WORKER) await CheckTestWorker()
		if(TEST_WORKER) log.info('Creating TestWorker JobQues...')

    for(let i in workerTypes){
			let queName = ''
			if(QUE_PREFIX) queName += `${QUE_PREFIX}_`
			queName += workerTypes[i]
      await CreateQue(queName)
      if(USE_PRIVATE) await CreateQue(`${queName}Private`)
    }
  }catch(e){
    log.error(e);
    setTimeout(CreateQues, 5000)
  }
}
module.exports.start = CreateQues
module.exports.add = async(type, data = {}, jobId = null)=>{
	try{
    let jobQue = ''
		if(QUE_PREFIX) jobQue += `${QUE_PREFIX}_`
		jobQue += type
    if(jobQue?.includes('Private') && !WorkerQues[jobQue]) jobQue = jobQue?.replace('Private', '')
		if(TEST_WORKER) jobQue += 'Test'
    if(!WorkerQues[jobQue]) return;
		let jobOpts = { jobId: jobId || data.id }
		if(!jobOpts.jobId) jobOpts.jobId = uuidv4()
		await WorkerQues[jobQue].clean(10000, 'failed');

    let res = await WorkerQues[jobQue].add(data, jobOpts)
    CheckJob(data, WorkerQues[jobQue])
    return res
	}catch(e){
		throw(e)
	}
}
