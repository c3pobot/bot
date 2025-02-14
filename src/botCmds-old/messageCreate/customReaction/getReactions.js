const mongo = require('mongoclient')

module.exports = async(id)=>{
  if(!id) return
  let obj = (await mongo.find('reactions', { _id: id }))[0]
  return obj?.cr
}
