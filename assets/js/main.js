const apiKey = '7690a6a56297440638aac0c5f1f36bb5'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'

const cityInput = document.getElementById('city-input')
const searchButton = document.getElementById('search-button')
const weatherData = document.getElementById('weather-data')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('weather-icon')
const temperature = document.getElementById('temperature')
const description = document.getElementById('description')
const wind = document.getElementById('wind')
const humidity = document.getElementById('humidity')
const pressure = document.getElementById('pressure')
const errorMessage = document.getElementById('error-message')
const cityHistory = document.getElementById('city-history')

// Получение истории городов из LocalStorage
let cityHistoryArray = JSON.parse(localStorage.getItem('cityHistory')) || []
let historyIsCollapsed = false

const toggleHistoryButton = document.getElementById('toggle-history')
toggleHistoryButton.addEventListener('click', () => {
  historyIsCollapsed = !historyIsCollapsed
  const cityHistory = document.getElementById('city-history')
  if (historyIsCollapsed) {
    cityHistory.style.display = 'none'
    toggleHistoryButton.textContent = 'Развернуть'
  } else {
    cityHistory.style.display = 'block'
    toggleHistoryButton.textContent = 'Свернуть'
  }
})

// Кнопка для очистки истории
const clearHistoryButton = document.createElement('button')
clearHistoryButton.textContent = 'Очистить историю'
clearHistoryButton.classList.add('clear-history-button') // Добавляем класс для стилей
clearHistoryButton.addEventListener('click', () => {
  localStorage.clear()
  updateCityHistory()
  location.reload()
})

// Добавляем кнопку на страницу (например, в блок с историей)
const historyContainer = document.querySelector('.history')
historyContainer.appendChild(clearHistoryButton)

// Функция для обновления данных погоды
function updateWeatherData(city) {
  fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка получения данных о погоде')
      }
      return response.json()
    })
    .then((data) => {
      // Отображение данных о погоде
      cityName.textContent = data.name
      weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      temperature.textContent = data.main.temp
      description.textContent = data.weather[0].description
      wind.textContent = data.wind.speed
      humidity.textContent = data.main.humidity
      pressure.textContent = data.main.pressure

      // Обновление истории городов
      if (!cityHistoryArray.includes(city)) {
        cityHistoryArray.push(city)
        localStorage.setItem('cityHistory', JSON.stringify(cityHistoryArray))
        updateCityHistory()
      }

      weatherData.style.display = 'block'
      errorMessage.style.display = 'none'
    })
    .catch((error) => {
      errorMessage.textContent = error.message
      errorMessage.style.display = 'block'
      weatherData.style.display = 'none'
    })
}

// Функция для обновления списка истории городов
function updateCityHistory() {
  cityHistory.innerHTML = ''
  cityHistoryArray.forEach((city) => {
    const listItem = document.createElement('li')
    listItem.textContent = city
    listItem.addEventListener('click', () => updateWeatherData(city))
    cityHistory.appendChild(listItem)
  })

  // Скрываем кнопку, если история пуста
  if (cityHistoryArray.length === 0) {
    clearHistoryButton.style.display = 'none'
  } else {
    clearHistoryButton.style.display = 'inline-block' // Отображаем кнопку
  }
}

// Обработчик события нажатия кнопки поиска
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim()
  if (city) {
    updateWeatherData(city)
    cityInput.value = ''
  }
})

// Обработчик события нажатия Enter в поле ввода города
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchButton.click()
  }
})

// Инициализация истории городов при загрузке страницы
updateCityHistory()
