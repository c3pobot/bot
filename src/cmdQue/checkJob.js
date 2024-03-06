'use strict'
const log = require('logger')
//const { webHookMsg } = require('helpers/webHookMsg')

const CheckJobStatus = async(obj = {}, que)=>{
  try{
    if(!que || !obj.token) return
    let job, jobStarted = false, status, jobCount, jobIndex
    let jobs = await que.getJobs(['active', 'waiting'])
    if(jobs?.length > 1) jobIndex = jobs.findIndex(x=>x.id === obj?.id)
    if(jobIndex >= 0) job = jobs[jobIndex]
    if(!job) jobStarted =  true
    if(job) status = await job.getState()
    if(status === 'active') jobStarted = true
    if(!jobStarted && jobs?.length > 0){
      let jobCount = +jobs.length - +jobIndex
      if(jobIndex == 0) jobCount = jobs.length
      //webHookMsg(obj.token, { content: 'Your job is '+jobCount+' in the que' }, 'PATCH')
      setTimeout(()=>CheckJobStatus(obj, que), 10000)
    }
  }catch(e){
    log.error(e);
  }
}
module.exports = CheckJobStatus
