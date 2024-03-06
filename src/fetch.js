'use strict'
const fetch = require('node-fetch')
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if (res.status?.toString().startsWith('5')) {
      throw('Bad status code '+res.status)
    }
    let body
    if (res.headers?.get('Content-Type')?.includes('application/json')) {
      body = await res?.json()
    } else {
      body = await res?.text()
    }
    if(!body && res?.status === 204) body = res.status

    return body
  }catch(e){
    throw(e)
  }
}
module.exports = async(uri, body, method = 'POST', headers = {})=>{
  try{
    let payload = { method: method, compress: true, timeout: 60000, headers: headers }
    if(body){
      payload.body = JSON.stringify(body)
      payload.headers['Content-Type'] = 'application/json'
    }
    let res = await fetch(uri, payload)
    return await parseResponse(res)
  }catch(e){
    throw(e)
  }
}
