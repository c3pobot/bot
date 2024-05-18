'use strict'
module.exports = (obj, roles = [])=>{
  if(!roles || roles?.length == 0) return
  let components = [], actionRow = { type: 1, components: [] }, tempRow
  for(let i in roles){
    let role = obj.guild?.roles?.cache?.get(roles[i].id)
    tempRow = JSON.parse(JSON.stringify(actionRow))
    if(components?.length < 6){
      tempRow.components.push({
        type: 2,
          label: role?.name || roles[i].name,
          style: 1,
          custom_id: JSON.stringify({cmd: 'iam', dId: obj?.user?.id, roleId: roles[i].id})
      })
      if(+tempRow.components.length === 5 && +components.length < 6){
        components.push(tempRow)
      }else{
        if(+components.length < 6 && (+i + 1) === +roles.length) components.push(tempRow)
      }
    }
  }
  return { content: 'Select the role you want to assign yourself', components: components }
}
