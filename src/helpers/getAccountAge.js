'use strict'
module.exports = (timeStamp)=>{
  try{
    let timeDiff = +Date.now() - +timeStamp
    timeDiff = Math.floor(timeDiff / 1000)
    const years = Math.floor(timeDiff / 31536000)
    timeDiff = timeDiff - (31536000 * years)
    const months = Math.floor(timeDiff / 2628000)
    timeDiff = timeDiff - (2628000 * months)
    const days = Math.floor(timeDiff / 86400)
    return years+' years, '+months+' months, '+days+' days'
  }catch(e){
    throw(e)
  }
}
