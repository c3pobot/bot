'use strict'
const POD_NAME = process.env.POD_NAME
const BOT_BRIDGE_URI = process.env.BOT_BRIDGE_URI
const SOCKET_EMIT_TIMEOUT = process.env.SOCKET_EMIT_TIMEOUT || 10000
const io = require('socket.io-client')
let socket = io(BOT_BRIDGE_URI, {transports: ['websocket']}), notify = true
socket.on('connect', ()=>{
  sendSocketIdentity()
  if(notify){
    notify = false
    console.log(POD_NAME+' socket.io is connected to bot bridge...')
  }
})
const sendSocketIdentity = async()=>{
  try{
    let res = await SocketEmit('identify', { podName: POD_NAME })
    if(!res || res?.status !== 'ok') setTimeout(sendSocketIdentity, 5000)
  }catch(e){
    console.error(e);
    setTimeout(sendSocketIdentity, 5000)
  }
}
const SocketEmit = ( cmd, obj = {} )=>{
  return new Promise((resolve, reject)=>{
    try{
      if(!socket || !socket?.connected) reject('Socket Error: connection not available')
      socket.timeout(SOCKET_EMIT_TIMEOUT).emit('request', cmd, obj, (err, res)=>{
        if(err) reject(`Socket Error: ${err.message || err}`)
        resolve(res)
      })
    }catch(e){
      reject(e.message)
    }
  })
}
module.exports.socket = socket
module.exports.call = SocketEmit