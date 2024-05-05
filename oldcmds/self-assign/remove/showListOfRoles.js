'use strict'
module.exports = async(obj = {}, roles = [])=>{
  try{
    let actionRows = [], actionRow = {type: 1, components: []}, tempRow
    for(let i in roles){
      if(!tempRow) tempRow = JSON.parse(JSON.stringify(actionRow))
      if(tempRow && +actionRows.length < 6){
        tempRow.components.push({
          type: 2,
          label: roles[i].name,
          style: 1,
          custom_id: JSON.stringify({id: obj.id, roleId: roles[i].id})
        })
        if(+tempRow.components.length === 5 && +actionRows.length < 6){
          actionRows.push(tempRow)
        }else{
          if(+actionRows.length < 6 && (+i + 1) === +roles.length) actionRows.push(tempRow)
        }
      }
    }
    await HP.ButtonPick(obj, {content: 'Please select the role you want to remove as a self assign role', components: actionRows})
  }catch(e){
    console.error(e);
  }
}
