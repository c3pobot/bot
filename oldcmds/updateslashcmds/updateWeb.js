'use strict'
const UpdateCmdObj = async(cmds = [], obj)=>{
  try{
    obj.global = obj.global.concat(cmds.filter(x=>x.type == 'public').map(x=>x.cmd))
    obj.shard = obj.shard.concat(cmds.filter(x=>x.type == 'shard').map(x=>x.cmd))
    obj.basic = obj.basic.concat(cmds.filter(x=>x.type == 'private').map(x=>x.cmd))
    obj.bo = obj.bo.concat(cmds.filter(x=>x.type.includes('bo')).map(x=>x.cmd))
  }catch(e){
    console.error(e);
  }
}
module.exports = async()=>{
  try{
    const slashCmds = await mongo.find('slashCmds', {}, {_id: 1, cmds: 1})
    if(slashCmds?.length > 0){
      const CmdObj = { global: [], shard: [], basic: [], bo: []}
      for(let i in slashCmds){
        if(slashCmds[i].cmds?.length > 0) await UpdateCmdObj(slashCmds[i].cmds, CmdObj)
      }

      if(CmdObj.global?.length > 0) CmdObj.global = await sorter([{column: 'name', order: 'ascending'}], CmdObj.global)
      if(CmdObj.shard?.length > 0) CmdObj.shard = await sorter([{column: 'name', order: 'ascending'}], CmdObj.shard)
      if(CmdObj.basic?.length > 0) CmdObj.basic = await sorter([{column: 'name', order: 'ascending'}], CmdObj.basic)
      if(CmdObj.bo?.length > 0) CmdObj.bo = await sorter([{column: 'name', order: 'ascending'}], CmdObj.bo)

      await mongo.set('botCmds', {_id: 'global'}, {cmds: CmdObj.global})
      await mongo.set('botCmds', {_id: 'shard'}, {cmds: CmdObj.shard})
      await mongo.set('botCmds', {_id: 'basic'}, {cmds: CmdObj.basic})
      await mongo.set('botCmds', {_id: 'bo'}, {cmds: CmdObj.bo})
    }
  }catch(e){
    console.error(e);
  }
}
