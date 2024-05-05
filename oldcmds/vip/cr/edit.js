'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let id, trigger, response, crca, msg2send = {content: 'That is not a personal custom reaction'}, tempObj
    if(opt.find(x=>x.name == 'id')) id = opt.find(x=>x.name == 'id').value
    if(opt.find(x=>x.name == 'trigger')) trigger = opt.find(x=>x.name == 'trigger').value.trim().toLowerCase()
    if(opt.find(x=>x.name == 'response')) response = opt.find(x=>x.name == 'response').value
    if(opt.find(x=>x.name == 'anywhere')) crca = opt.find(x=>x.name == 'anywhere').value
    const lCR = (await mongo.find('reactions', {_id: obj.member.user.id}))[0]
    if(lCR && lCR.cr && lCR.cr.find(x=>x.id == id)) tempObj = Object.assign({}, lCR.cr.find(x=>x.id == id))
    if(tempObj){
      if(trigger && lCR.cr.filter(x=>x.trigger == trigger && x.id != id).length > 0){
        msg2send.content = 'There is already another reaction for **'+trigger+'**'
      }else{
        if(trigger) tempObj.trigger = trigger
        if(response) tempObj.response = response
        if(crca >= 0) tempObj.anywhere = crca
        await mongo.set('reactions', {_id: obj.member.user.id, 'cr.id': id}, {'cr.$': tempObj})
        const embedMsg = {
          color: 15844367,
          title: 'Personal Custom Reaction',
          description: '**Custom Reaction Updated**\n#'+id+'\n\n**Trigger** : \n'+tempObj.trigger+'\n\n**Response** : \n'+tempObj.response+'\n\n'
        }
        embedMsg.description += 'Trigger anywhere : \n'+(tempObj.anywhere > 0 ? 'Yes':'No')
        msg2send.embeds = [embedMsg]
        msg2send.content = null
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
