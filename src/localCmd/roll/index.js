'use stict'
module.exports = (obj)=>{
  let min = +(obj?.options?.get('min')?.value || 1), max = +(obj?.options?.get('max')?.value || 100)
  let msg2send = { content: 'Random number between **'+min+'** and **'+max+'**\n```\n' }
  msg2send.content += Math.floor(Math.random() * (max - min + 1)) + min
  msg2send.content += '\n```\n'
  return msg2send
}
