'use strict'
const mongo = require('mongoclient')
module.exports = async(id)=>{
  if(!id) return
  let exists = (await mongo.find('blackList', { _id: id}, { _id: 1} ))[0]
  if(exists) return true
}
