'use strict'
const { checkServerAdmin } = require('src/helpers')

const Cmds = {}
Cmds.add = require('./add')
Cmds.remove = require('./remove')
Cmds.show = require('./show')

module.exports = async(obj, opt = {})=>{
  let auth = await checkServerAdmin(obj)
  let tempCmd = opt.subCmd || obj.options?.getSubcommand()
  if(!tempCmd || !Cmds[tempCmd]) return { content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided') }
  if(auth || tempCmd == 'show') return await Cmds[tempCmd](obj, opt)
  return { content: 'this command requires bot admin role...' }
}
