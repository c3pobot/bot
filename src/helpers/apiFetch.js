'use strict'
const log = require('logger')
const fetch = require('node-fetch')
module.exports = async(uri, method = 'GET', body, headers)=>{
  try{
    if(!uri) return
    let opts = { headers: { cookie: 'over18=1' }, timeout: 30000, compress: true, method: method }
    if(headers) opts.headers = { ...opts.headers,...headers }
    if(body){
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
    let res = await fetch(uri, opts)
    if (res?.headers?.get('Content-Type')?.includes('application/json')) return await res.json()
    if(e?.name && e.message) log.error({ error: e.name, message: e.message })
    if(e.status) log.error(e)
  }catch(e){
    log.error(e)
  }
}
