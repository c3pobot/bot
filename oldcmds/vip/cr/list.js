'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'you have no personal custom reactions'}, crQuery, cr = []
    if(opt.find(x=>x.name == 'query')) crQuery = opt.find(x=>x.name == 'query').value.trim().toLowerCase()
    const localCR = (await mongo.find('reactions', {_id: obj.member.user.id}))[0]
    if(localCR && localCR.cr) cr = localCR.cr
    if(crQuery) msg2send.content = 'There where no custom reactions that matched **'+crQuery+'**'
    if(crQuery) cr = cr.filter(x=>x.trigger.toLowerCase().includes(crQuery))
    if(cr.length > 0) cr = await sorter([{column: 'trigger', order: 'ascending'}], cr)
    if(cr && cr.length > 0){
      const fieldsArray = []
      msg2send.content = null
      msg2send.embeds = []
      if(cr.length > 25){
        for(let i=0;i<cr.length;i+=25) fieldsArray.push(cr.slice(i, (+i +25)));
      }else{
        fieldsArray.push(cr)
      }
      for(let i in fieldsArray){
        const embedMsg = {
          color: 15844367,
          description: ""
        }
        if(i == 0) embedMsg.title = "Personal Custom Reactions"
        for(let j in fieldsArray[i]) embedMsg.description += '`'+fieldsArray[i][j].id+'` : '+fieldsArray[i][j].trigger+'\n';
        msg2send.embeds.push(embedMsg)
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
