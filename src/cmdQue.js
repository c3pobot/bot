'use strict'
const QueWrapper = require('quewrapper')
let CmdQues = ['discord']
if(process.env.CMD_QUE_NAMES) CmdQues = JSON.parse(process.env.CMD_QUE_NAMES)
const redisConnection = {
	host: process.env.QUE_SERVER,
	port: +process.env.QUE_PORT,
	password: process.env.QUE_PASS
}
const CreateQues = async()=>{
  try{
    for(let i in CmdQues){
      await CreateQue(CmdQues[i])
    }
  }catch(e){
    console.error(e)
    setTimeout(CreateQues, 5000)
  }
}
const CreateQue = async(obj)=>{
	try{
		if(CmdQues[obj.name]){
			console.log('Creating '+obj.name+' job que...')
			const opts = {queName: obj.queName, queOptions: {redis: redisConnection}}
			if(process.env.SHARD_NUM?.toString().endsWith(0)) opts.createListeners = 1
			CmdQues[obj.name].que = new QueWrapper(opts)
		}
	}catch(e){
		console.error(e);
	}
}
CreateQues()
module.exports.add = async(type, job)=>{
	try{
		if(CmdQues[type]?.que) return await CmdQues[type].que.newJob(job)
	}catch(e){
		console.log(e)
	}
}
