'use strict'
module.exports = async(obj)=>{
  try{
    let acrResponse, args = [], stalkerAcr = [], boAcr = [], vipAcr = [], gAcr = [], localAcr = [], vip, vipCR, content = []
    if(obj.content) content = obj.content.toString().trim().toLowerCase().split(' ')
    if(content?.length > 0 && (obj?.global || obj?.vip)){
      if(obj?.global){
        const gcr = (await mongo.find('reactions', {_id: 'global'}))[0]
        if(gcr && gcr.cr) gAcr = gcr.cr
        const lcr = (await mongo.find('reactions', {_id: obj.sId}))[0]
        if(lcr && lcr.cr) localAcr = lcr.cr
      }
      if(obj?.vip){
        if(obj.dId == '215292519485800448'){
          vip = (await mongo.find('vip', {_id: '215285469003382784'}))[0]
        }else{
          vip = (await mongo.find('vip', {_id: obj.dId}))[0]
        }
        if(vip && vip.status){
          if(obj.dId == '215292519485800448'){
            vipCR = (await mongo.find('reactions', {_id: '215285469003382784'}))[0]
          }else{
            vipCR = (await mongo.find('reactions', {_id: obj.dId}))[0]
          }
          if(vipCR && vipCR.cr) vipAcr = vipCR.cr
        }
        if(obj.dId == process.env.BOT_STALKER_ID){
           const stalker = (await mongo.find('reactions', {_id: process.env.STALKER_SERVER_ID}))[0]
           if(stalker && stalker.cr) stalkerAcr = stalker.cr
        }
      }
      //check phrase
      let phrase = content.shift().toLowerCase()
      for(let i in content) phrase += ' '+content[i].toLowerCase()
      if(vipAcr.filter(x=>x.trigger.toLowerCase() == phrase).length > 0) acrResponse = vipAcr.filter(x=>x.trigger.toLowerCase() == phrase)[0].response
      if(!acrResponse && stalkerAcr.filter(x=>x.trigger.toLowerCase() == phrase).length > 0) acrResponse = stalkerAcr.filter(x=>x.trigger.toLowerCase() == phrase)[0].response
      if(!acrResponse && localAcr.filter(x=>x.trigger.toLowerCase() == phrase).length > 0) acrResponse = localAcr.filter(x=>x.trigger.toLowerCase() == phrase)[0].response
      if(!acrResponse && gAcr.filter(x=>x.trigger.toLowerCase() == phrase).length > 0) acrResponse = gAcr.filter(x=>x.trigger.toLowerCase() == phrase)[0].response
      if(!acrResponse){
        for(let i in vipAcr){
          if(vipAcr[i].anywhere > 0 && phrase.includes(vipAcr[i].trigger)){
            acrResponse = vipAcr[i].response
            break;
          }
        }
      }
      if(!acrResponse){
        for(let i in stalkerAcr){
          if(stalkerAcr[i].anywhere > 0 && phrase.includes(stalkerAcr[i].trigger)){
            acrResponse = stalkerAcr[i].response
            break;
          }
        }
      }
      if(!acrResponse){
        for(let i in localAcr){
          if(localAcr[i].anywhere > 0 && phrase.includes(localAcr[i].trigger)){
            acrResponse = localAcr[i].response
            break;
          }
        }
      }
      if(!acrResponse){
        for(let i in gAcr){
          if(gAcr[i].anywhere > 0 && phrase.includes(gAcr[i].trigger)){
            acrResponse = gAcr[i].response
            break;
          }
        }
      }
      if(!acrResponse) args = phrase.split(' ')
      if(args.length > 0){
        for(let i in args){
          if(vipAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i]).length > 0){
            acrResponse = vipAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i])[0].response
            break;
          }
          if(!acrResponse && stalkerAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i]).length > 0){
            acrResponse = stalkerAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i])[0].response
            break;
          }
          if(!acrResponse && localAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i]).length > 0){
            acrResponse = localAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i])[0].response
            break;
          }
          if(!acrResponse && gAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i]).length > 0){
            acrResponse = gAcr.filter(x=>x.anywhere > 0 && x.trigger.toLowerCase() == args[i])[0].response
            break;
          }
        }
      }
      if(acrResponse){
        if(acrResponse.embed){
          await HP.SendMsg(obj, {embeds: [acrResponse.embed]});
        }else{
          await HP.SendMsg(obj, {content: acrResponse});
        }
      }
    }
  }catch(e){
    console.error(e);
  }
}
