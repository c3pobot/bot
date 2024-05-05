'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let dId, crLimit, vipLevel, status, msg2send = {content: 'You must specify a @user'}, usr
    if(opt.find(x=>x.name == 'user')) dId = opt.find(x=>x.name == 'user').value
    if(opt.find(x=>x.name == 'status')) status = opt.find(x=>x.name == 'status').value
    if(opt.find(x=>x.name == 'cr-limit')) crLimit = opt.find(x=>x.name == 'cr-limit').value
    if(opt.find(x=>x.name == 'level')) vipLevel = opt.find(x=>x.name == 'level').value
    if(!dId && opt.find(x=>x.name == 'discordid')) dId = opt.find(x=>x.name == 'discordid').value.trim()
    if(dId){
      if(obj.data && obj.data.resolved){
        if(obj.data.resolved.members && obj.data.resolved.members[dId] && obj.data.resolved.members[dId].nick) usr = obj.data.resolved.members[dId].nick
        if(!usr && obj.data.resolved.users && obj.data.resolved.users[dId] && obj.data.resolved.users[dId].username) usr = obj.data.resolved.users[dId].username
      }
      msg2send.content = (usr ? '**@'+usr+'**':'that user')+' is not a vip member'
      const pObj = (await mongo.find('vip', {_id: dId}))[0]
      if(pObj){
        delete pObj._id
        delete pObj.TTL
        if(crLimit >= 0) pObj.crLimit = crLimit
        if(vipLevel >= 0) pObj.level = vipLevel
        if(status >= 0) pObj.status = status
        await mongo.set('vip', {_id: dId}, pObj)
        const embedMsg = {
          color: 15844367,
          title: (usr ? '**@'+usr+'**':'User')+' VIP Info',
          description: '```\n'
        }
        embedMsg.description += 'Discord ID : '+dId+'\n'
        embedMsg.description += 'Level      : '+pObj.level+'\n'
        embedMsg.description += 'Status     : '+(pObj.status ? 'enabled':'disabled')+'\n'
        embedMsg.description += 'CR Limit   : '+(pObj.crLimit ? pObj.crLimit:100)+'\n'
        embedMsg.description += '```'
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
