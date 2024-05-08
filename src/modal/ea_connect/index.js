'use strict'

module.exports = async(obj, opt = {})=>{
  if(!obj) return
  console.log(opt)
  if(opt.request == 'email'){
    let msg2send = {
      title: 'Enter EA connect email',
      custom_id: JSON.stringify({ id: opt.id, dId: opt.dId }),
      components: [{ type: 1, components: [{
        type: 4,
        label: 'EA Connect Email',
        style: 1,
        placeholder: 'name@example.com',
        required: true,
        customId: 'email'
      }] }]
    }
    obj.showModal(msg2send)
    return
  }
  let msg2send = {
    title: 'Enter EA connect Code',
    custom_id: JSON.stringify({ id: opt.id, dId: opt.dId }),
    components: [{ type: 1, components: [{
      type: 4,
      label: 'EA Connect Code',
      style: 1,
      placeholder: '123456',
      required: true,
      customId: 'code'
    }] }]
  }
  obj.showModal(msg2send)
  return
}
