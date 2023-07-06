'use strict'
const { CheckBasicAllowed } = require('./messaageCreate/checkAllowed')
const GetQueName = require('./messaageCreate/getQueName')
const Translate = require('./messaageCreate/translate')
module.exports = async(obj = {})=>{
  try{
    if(!obj.reaction || !obj.usr || obj.usr.bot) return;
    let msg = {author: {id: obj.usr.id}, guild: {id: obj.reaction?.message?.guild?.id}}
    let auth = await CheckBasicAllowed(msg)
    if(!auth) return;
    let queName = await GetQueName(msg)
    if(!queName) return;
    Translate(obj.message, queName, obj.usr, obj.reaction?.emoji?.name)
  }catch(e){
    throw(e);
  }
}
