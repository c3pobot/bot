'use strict'
const numeral = require('numeral')
const { GetWeather } = require('./helper')
const ConvertToStupid = (temp)=>{
  return numeral((+temp - 32)/1.8).format('0.0')
}
const ConvertToStupid2 = (speed)=>{
  return numeral(speed * 1.609344).format('0.0')
}
module.exports = async(obj, opt)=>{
  try{
    let city, cities, cityObj, country, state, cityId, msg2Send = {content: 'You did not provide a city'}, setDefault = 0
    if(opt && opt.find(x=>x.name == 'city')) city = opt.find(x=>x.name == 'city').value.toLowerCase()
    if(opt && opt.find(x=>x.name == 'state')) state = opt.find(x=>x.name == 'state').value.toUpperCase()
    if(opt && opt.find(x=>x.name == 'country')) country = opt.find(x=>x.name == 'country').value.toUpperCase()
    if(opt && opt.find(x=>x.name == 'set')) setDefault = 1
    if(city){
      msg2Send.content = 'Could not find a match for **'+city+'**'+(state ? ', **'+state+'**':'')+(country ? ' in **'+country+'**':'')
      const payload = {
        search: {
          $regex: city
        }
      }
      if(state) payload.state = state
      if(country) payload.country = country
      if(obj.confirm && obj.confirm.cityId) cityObj = (await mongo.find('weatherCities', {_id: obj.confirm.cityId}))[0]
      if(!cityObj) cities = await mongo.find('weatherCities', payload)
      if(cities && cities.length > 0){
        msg2Send.content = 'More than 25 cities where found for **'+city+'**'+(state ? ', **'+state+'**':'')+(country ? ' in **'+country+'**':'')+'. Try to be more specific'
        if(cities.length < 26){
          if(cities.length == 1){
            cityObj = cities[0]
          }else{
            const pickMsg = {
              content: 'There where **'+cities.length+'** found for **'+city+'** please choose from below',
              components: [],
              flags: 64
            }
            let x = 0
            for(let i in cities){
              if(!pickMsg.components[x]) pickMsg.components[x] = { type:1, components: []}
              pickMsg.components[x].components.push({
                type: 2,
                label: cities[i].name+(cities[i].state ? ', '+cities[i].state.toUpperCase():'')+(cities[i].country ? ' '+cities[i].country.toUpperCase():''),
                style: 1,
                custom_id: JSON.stringify({id: obj.id, cityId: cities[i]._id})
              })
              if(pickMsg.components[x].components.length == 5) x++;
            }
            await HP.ButtonPick(obj, pickMsg)
          }
        }
      }
    }
    if(!city){
      msg2Send.content = 'You do not have a default city set for weather info'
      const dObj = (await mongo.find('discordId', {_id: obj.member.user.id}))[0]
      if(dObj && dObj.weather) cityObj = dObj.weather
    }
    if(cityObj && cityObj.coord && cityObj.coord.lon && cityObj.coord.lat){
      await HP.ReplyButton(obj, 'Getting Weather for **'+cityObj.name+'**'+(cityObj.state ? ', **'+cityObj.state+'**':'')+(cityObj.country ? ' in **'+cityObj.country+'**':''))
      msg2Send.content = 'Error getting weather data for **'+cityObj.name+'**'+(cityObj.state ? ', **'+cityObj.state+'**':'')+(cityObj.country ? ' in **'+cityObj.country+'**':'')
      const data = await GetWeather(cityObj._id, cityObj.coord.lon, cityObj.coord.lat)
      if(data){
        if(setDefault) await mongo.set('discordId', {_id: obj.member.user.id}, {weather: cityObj})
        const embedMsg = {
          color: 15844367,
          title: 'Weather for **'+cityObj.name+'**'+(cityObj.state ? ', **'+cityObj.state+'**':'')+(cityObj.country ? ' **'+cityObj.country+'**':''),
          fields: [],
          footer: {
            text: 'Data Updated'
          },
          timestamp: new Date(data.current.dt * 1000)
        }
        if(data.current.weather && data.current.weather[0] && data.current.weather[0].icon){
          embedMsg.thumbnail = {
            url: 'http://openweathermap.org/img/wn/'+data.current.weather[0].icon+'@2x.png'
          }
        }
        const currentObj = {
          'name': 'Current - '+data.current.weather[0].description,
          'value': '```\n'
        }
        currentObj.value += 'Temp       : '+numeral(data.current.temp).format('0.0')+'°F / '+ConvertToStupid(data.current.temp)+'°C\n'
        currentObj.value += 'Feels Like : '+numeral(data.current.feels_like).format('0.0')+'°F / '+ConvertToStupid(data.current.feels_like)+'°C\n'
        currentObj.value += 'Wind       : '+numeral(data.current.wind_speed).format('0.0')+'mph / '+ConvertToStupid2(data.current.wind_speed)+'kph\n'
        currentObj.value += 'Humidity   : '+data.current.humidity+'%\n'
        currentObj.value += '```'
        embedMsg.fields.push(currentObj)
        if(data.daily && data.daily[0]){
          const dailyObj = {
            'name': 'Daily - '+data.daily[0].weather[0].description,
            'value': '```\n'
          }
          dailyObj.value += 'High       : '+numeral(data.daily[0].temp.max).format('0.0')+'°F / '+ConvertToStupid(data.daily[0].temp.max)+'°C\n'
          dailyObj.value += 'Low        : '+numeral(data.daily[0].temp.min).format('0.0')+'°F / '+ConvertToStupid(data.daily[0].temp.min)+'°C\n'
          dailyObj.value += 'Wind       : '+numeral(data.daily[0].wind_speed).format('0.0')+'mph / '+ConvertToStupid2(data.daily[0].wind_speed)+'kph\n'
          dailyObj.value += 'Humidity   : '+data.daily[0].humidity+'%\n'
          dailyObj.value += 'Rain       : '+data.daily[0].pop+'%\n'
          dailyObj.value += '```'
          embedMsg.fields.push(dailyObj)
        }
        msg2Send.content = null
        msg2Send.embeds = [embedMsg]
        if(setDefault) msg2Send.content = '**Saved as default**'
      }
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
