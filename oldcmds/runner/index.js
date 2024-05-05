'use strict'
const Cmds = {}
Cmds.boost = require('./boost')
Cmds.delete = require('./delete')
Cmds.edit = require('./edit')
Cmds.join = require('./join')
Cmds.leave = require('./leave')
Cmds.reaction = require('./reaction')
Cmds.translate = require('./translate')
module.exports = async(obj = {})=>{
  try{
    if(Cmds[obj.type]) return await Cmds[obj.type](obj)
  }catch(e){
    console.error(e);
  }
}
