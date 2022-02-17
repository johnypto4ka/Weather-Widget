const key = '61b15b0c0f1865015720e4bc6c0b7d55'
const urlWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWeatherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`
const widgetHeaderElement = document.querySelector('.widget-header')
const widgetBodyElement = document.querySelector('.widget-body')

function fetchDataPromise (url, method = 'GET') {
	return new Promise((resolve, reject) => {
	const xhr = new XMLHttpRequest()
  
	xhr.open(method, url)

	xhr.onload = () => {
		if (xhr.status == '200') {
			resolve(xhr.response)
		} else {
			reject(xhr.status + ' ' + xhr.statusText)
		}
	}
  
	xhr.onerror = () => {
		reject(xhr.status + ' ' + xhr.statusText)
	}
  
	xhr.send()
	})
}

// ---------------------------------

function widgetHeaderTemplate(weatherData) {
	const {city, windDirection, windSpeed, date, temp, countryCode, description, iconSrc} = weatherData
	const resultTemp = Math.round(temp) > 0 ? '+' + Math.round(temp) : Math.round(temp)
	
	
	return `
	<div class="widget-top">
		<div class="widget-geo">${city}, ${countryCode}</div>
		<div class="widget-time"> 
			<div class="time-icon"><img src="icons/clock-regular.svg" alt=""></div>
			<p>${transformData(date.getHours())}:${transformData(date.getMinutes())}</p>
		</div>
	</div>
	<div class="widget-center">
		<img src="${iconSrc}" alt="">
		<h2>${resultTemp}</h2>
		<div class="widget-descr">${description}</div>
	</div>
	<div class="widget-wind">
		<div>${windDirection}</div>
		<div>${windSpeed} m/s</div>
	</div>
	`
}

function transformData(date) {
	return date < 10 ? `0${date}` : date
}

function renderHeader(data) {
	widgetHeaderElement.innerHTML += widgetHeaderTemplate(data)
}

function getDirection(value) {
	console.log(value)
	
	switch(true) {
		case (value > 337.5 || value < 22.5):
			return 'Север'
		case (value > 22.5 && value < 67.5):
			return 'Северо-восток'
		case (value > 67.5 && value < 112.5):
			return 'Восток'
		case (value > 112.5 && value < 157.5):
			return 'Юго-восток'
		case (value > 157.5 && value < 202.5):
			return 'Юг'
		case (value > 202.5 && value < 247.5):
			return 'Юго-запад'
		case (value > 247.5 && value < 292.5):
			return 'Запад'
		case (value > 292.5 && value < 337.5):
			return 'Северо-запад'									
	}
}

fetchDataPromise(urlWeatherCurrent)
	.then((response) => {
		const data = JSON.parse(response)
		console.log(data)
		const city = data.name
		const windDirection = getDirection(data.wind.deg)
		const windSpeed = data.wind.speed
		const date = new Date(data.dt * 1000)
		const temp = data.main.temp - 273.15
		const countryCode = data.sys.country
		const description = data.weather[0].description
		const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
		renderHeader({city, windDirection, windSpeed, date, temp, countryCode, description, iconSrc})
	})

// ----------------------------------

function widgetBodyTemplate(weatherData) {
const {date, iconSrc, temp} = weatherData
console.log(date)
console.log(temp)
return `
	<div class="widget-item">
		<div class="item-text">${date.getDate()} ${transformMonth(date.getMonth())} 
		${transformData(date.getHours())}:${transformData(date.getMinutes())}</div>
		<img class="item-image"src="${iconSrc}" alt="">
		<div class="item-text">${temp}°C</div>
	</div>
`
}

function transformMonth(index) {
	switch(index) {
		case (index = 0):
			return 'Января'	
		case (index = 1):
			return 'Февраля'
		case (index = 2):
			return 'Марта'
		case (index = 3):
			return 'Апреля'
		case (index = 4):
			return 'Мая'
		case (index = 5):
			return 'Июня'
		case (index = 6):
			return 'Июля'
		case (index = 7):
			return 'Августа'
		case (index = 8):
			return 'Сентября'
		case (index = 9):
			return 'Октября'
		case (index = 10):
			return 'Ноября'
		case (index = 11):
			return 'Декабря'										
	}
}

function renderBody(data) {
	widgetBodyElement.innerHTML += widgetBodyTemplate(data)
}

fetchDataPromise(urlWeatherByDays)
  .then((response) => {
    const data = JSON.parse(response)
	
    data.list.forEach((item, index) => {
		const date = new Date(item.dt * 1000)
		const iconSrc = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
		const temp = Math.round(item.main.temp -273.15)
      if (index % 8 == 0) {
        console.log(item)
		renderBody({date, iconSrc, temp})
      }
    })
  })

const currentDate = new Date()
const time = currentDate.getTime()
console.log(time)

