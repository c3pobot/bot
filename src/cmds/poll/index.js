'use strict'
const { checkServerAdmin } = require('src/helpers')

const Cmds = {}
Cmds.create = require('./create')
Cmds.stats = require('./stats')
Cmds.show = require('./show')
Cmds.end = require('./end')

module.exports = async(obj, opt = {})=>{
  let auth = await checkServerAdmin(obj)
  let tempCmd = opt.subCmd || obj.options?.getSubcommand()
  if(!tempCmd || !Cmds[tempCmd]) return { content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided') }
  if(auth || tempCmd == 'show') return await Cmds[tempCmd](obj, opt)
  return { content: 'this command requires bot admin role...' }
}
