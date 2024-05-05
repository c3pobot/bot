'use stict'
module.exports = (obj)=>{
  try{
    let min = 1, max = 100
    if(obj.data.options && obj.data.options.find(x=>x.name == 'min')) min = obj.data.options.find(x=>x.name == 'min').value
    if(obj.data.options && obj.data.options.find(x=>x.name == 'max')) max = obj.data.options.find(x=>x.name == 'max').value
    const msg2Send = {content: 'Random number between **'+min+'** and **'+max+'**\n```\n'}
    msg2Send.content += Math.floor(Math.random() * (max - min + 1)) + min
    msg2Send.content += '\n```\n'
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
