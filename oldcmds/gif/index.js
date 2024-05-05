'use strict'
module.exports = async(obj)=>{
  try{
    let searchTerm, msg2Send = {content: 'Error with search'}
    if(obj.data.options.find(x=>x.name == 'query')) searchTerm = obj.data.options.find(x=>x.name == 'query').value
    if(searchTerm){
      const gifs = await HP.apiFetch("http://api.giphy.com/v1/gifs/search?api_key="+process.env.GIPHY_API_KEY+"&q="+encodeURI(searchTerm))
      if(gifs && gifs.data && gifs.data.length > 0 && gifs.data[0].embed_url){
        msg2Send.content = gifs.data[0].embed_url
      }else{
        msg2Send.content = 'Could not find a gif for **'+searchTerm+'**'
      }
    }else{
      msg2Send.content = 'You did not provide a search string'
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
