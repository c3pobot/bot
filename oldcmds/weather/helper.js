'use strict'
const got = require('got')
const Cmds = {}
Cmds.GetWeather = async(id, lon, lat)=>{
  try{
    let data = await redis.get('weather-'+id)
    if(!data || !data.current){
      data = await got('https://api.openweathermap.org/data/2.5/onecall?appid='+process.env.OPEN_WEATHER_API_KEY+'&units=imperial&lat='+lat+'&lon='+lon, {
        method: 'GET',
        decompress: true,
        responseType: 'json',
        resolveBodyOnly: true
      })
      if(data && data.current) redis.setTTL('weather-'+id, data, 600)
    }
    if(data && data.current) return data
  }catch(e){
    console.log(e)
  }
}
module.exports = Cmds
