'use strict'
module.exports = (obj)=>{
  let emojis = obj.guild?.map(x=>{
    return {
      id: x.id,
      name: x.name,
      animated: x.animated
    }
  })
  if(!emojis || emojis?.length == 0){
    obj.editReply({ content: `there are no emoji for this server` })
    return
  }
  let total = emojis.length, animated = emojis.filter(x=>x.animated == true).length
  let array = []
  for(let i = 0;i<emojis.length;i += 40){
    array.push(emojis.slice(i, +i + 40))
  }
  let embeds = []
  for(let i in array){
    let count = 0, embedMsg = {
      color: 15844367,
      description: ''
    }
    if(i == 0) embedMsg.title = `${total - animated} Emoji, ${animated} Animated (${total} Total)`
    for(let e in array[i]){
      embedMsg.description += '<'
      if(array[i][e].animated) embedMsg.description += 'a'
      embedMsg.description + `:${array[i][e].name}:${array[i][e].id}>`
      count++;
      if(count > 19){
        embedMsg.description += '\n'
        count = 0
      }
    }
    embeds.push(embedMsg)
  }
  obj.editReply({ content: null, embeds: embeds })
}
