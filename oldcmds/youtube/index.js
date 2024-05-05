'use strict'
const { google } = require('googleapis')
const youtube = google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY
})
const GetVideo = (searchTerm)=>{
  return new Promise((resolve)=>{
    try{
      let vid
      youtube.search.list({
          part: 'snippet',
          q: searchTerm
        }, (err, res)=>{
          if(err){
            console.log(e)
          }else{
            if(res && res.data.items && res.data.items.length > 0){
              if(res.data.items[0].id.videoId) vid = 'https://youtube.com/watch?v='+res.data.items[0].id.videoId
            }
          }
          resolve(vid)
        })
    }catch(e){
      console.log(e)
      resolve()
    }
  })
}
module.exports = async(obj)=>{
  try{
    let searchTerm, msg2Send = {content: 'Error with search'}
    if(obj.data.options.find(x=>x.name == 'query')) searchTerm = obj.data.options.find(x=>x.name == 'query').value
    if(searchTerm){
      const vidUrl = await GetVideo(searchTerm)
      if(vidUrl){
        msg2Send.content = vidUrl
      }else{
        msg2Send.content = 'no video found for **'+searchTerm+'**'
      }
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
