// Variable Declarations

const endpoint = 'http://api.weatherapi.com/v1';
const apiKey = '6c5d19286ef047d387d103759230108';
let city = 'London';
let forecastEndpoint = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

const body = document.querySelector('body');
const conditionImg = document.querySelector('#conditionImg');
const cityText = document.querySelector('#city');
const countryText = document.querySelector('#country');
const localTimeText = document.querySelector('#localTime');
const tempText = document.querySelector('#temp');
const feelsLikeText = document.querySelector('#feelsLike');
const conditionText = document.querySelector('#condition');
const windSpeedText = document.querySelector('#windSpeed');
const windDirectionImage = document.querySelector('#windDirection');
const humidityText = document.querySelector('#humidity');
const uvText = document.querySelector('#uv');
const pressureText = document.querySelector('#pressure');
const celciusCheckbox = document.querySelector('#checkbox');
const celciusCheckboxLabel = document.querySelector('#checkboxLabel');
const windCheckbox = document.querySelector('#windCheckbox');
const windCheckboxLabel = document.querySelector('#windCheckboxLabel');
const searchForm = document.querySelector('form');
const forecastDay1Date = document.querySelector('#forecastDay1Date');
const forecastDay1ConditionImg = document.querySelector('#forecastDay1Img');
const forecastDay1Temp = document.querySelector('#forecastDay1Temp');
const forecastDay2Date = document.querySelector('#forecastDay2Date');
const forecastDay2ConditionImg = document.querySelector('#forecastDay2Img');
const forecastDay2Temp = document.querySelector('#forecastDay2Temp');
const forecastDay3Date = document.querySelector('#forecastDay3Date');
const forecastDay3ConditionImg = document.querySelector('#forecastDay3Img');
const forecastDay3Temp = document.querySelector('#forecastDay3Temp');

let isCelcius = true;
let isDay = true;
let isWindKph = true;
let isRaining = false;
let isSnowing = false;

// load isCelcius and isWindKph from local storage
if (localStorage.getItem('isCelcius') === null) {
  localStorage.setItem('isCelcius', true);
} else {
  isCelcius = JSON.parse(localStorage.getItem('isCelcius'));
  if (isCelcius) {
    celciusCheckboxLabel.innerHTML = '°C';
  } else {
    celciusCheckboxLabel.innerHTML = '°F';
    celciusCheckbox.checked = true;
  }
}

if (localStorage.getItem('isWindKph') === null) {
  localStorage.setItem('isWindKph', true);
} else {
  isWindKph = JSON.parse(localStorage.getItem('isWindKph'));
  if (isWindKph) {
    windCheckboxLabel.innerHTML = 'km/h';
  } else {
    windCheckboxLabel.innerHTML = 'mph';
    windCheckbox.checked = true;
  }
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  city = e.target[0].value;
  forecastEndpoint = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;
  getWeather();
});

celciusCheckbox.addEventListener('change', () => {
  isCelcius = !isCelcius;
  isCelcius
    ? (celciusCheckboxLabel.innerHTML = '°C')
    : (celciusCheckboxLabel.innerHTML = '°F');
  localStorage.setItem('isCelcius', isCelcius);
  getWeather();
});

windCheckbox.addEventListener('change', () => {
  isWindKph = !isWindKph;
  isWindKph
    ? (windCheckboxLabel.innerHTML = 'km/h')
    : (windCheckboxLabel.innerHTML = 'mph');
  localStorage.setItem('isWindKph', isWindKph);
  getWeather();
});

// Main Functions
const getWeather = async () => {
  // create loading spinner
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  document.body.appendChild(spinner);

  try {
    const response = await fetch(forecastEndpoint);
    const data = await response.json();
    console.log(data);
    UpdateUI(data);
  } catch (e) {
    console.log(e);
    alert('City not found');
  }

  //remove loading spinner
  spinner.remove();
};

getWeather();

// Helper Functions

async function UpdateUI(data) {
  // set main info elements
  conditionImg.src = await data.current.condition.icon;
  localTimeText.innerHTML = await data.location.localtime;
  cityText.innerHTML = await data.location.name;
  countryText.innerHTML = await data.location.country;
  if (isCelcius) {
    tempText.innerHTML = (await data.current.temp_c) + '°C';
    feelsLikeText.innerHTML = (await data.current.feelslike_c) + '°C';
  } else {
    tempText.innerHTML = (await data.current.temp_f) + '°F';
    feelsLikeText.innerHTML = (await data.current.feelslike_f) + '°F';
  }
  conditionText.innerHTML = await data.current.condition.text;

  // set secondary info elements
  humidityText.innerHTML = (await data.current.humidity) + '%';
  uvText.innerHTML = await data.current.uv;
  pressureText.innerHTML = (await data.current.pressure_mb) + ' mb';

  forecastDay1Date.textContent = await data.forecast.forecastday[0].date;
  forecastDay1ConditionImg.src = await data.forecast.forecastday[0].day
    .condition.icon;
  forecastDay2Date.textContent = await data.forecast.forecastday[1].date;
  forecastDay2ConditionImg.src = await data.forecast.forecastday[1].day
    .condition.icon;
  forecastDay3Date.textContent = await data.forecast.forecastday[2].date;
  forecastDay3ConditionImg.src = await data.forecast.forecastday[2].day
    .condition.icon;

  if (isCelcius) {
    forecastDay1Temp.textContent =
      (await data.forecast.forecastday[0].day.avgtemp_c) + '°C';
    forecastDay2Temp.textContent =
      (await data.forecast.forecastday[1].day.avgtemp_c) + '°C';
    forecastDay3Temp.textContent =
      (await data.forecast.forecastday[2].day.avgtemp_c) + '°C';
  } else {
    forecastDay1Temp.textContent =
      (await data.forecast.forecastday[0].day.avgtemp_f) + '°F';
    forecastDay2Temp.textContent =
      (await data.forecast.forecastday[1].day.avgtemp_f) + '°F';
    forecastDay3Temp.textContent =
      (await data.forecast.forecastday[2].day.avgtemp_f) + '°F';
  }

  const weatherConditionText = await data.current.condition.text;
  UpdateWeatherAnimation(weatherConditionText);

  const windDirection = await data.current.wind_dir;
  UpdateWindDirectionImage(windDirection);

  if (isWindKph) {
    windSpeedText.innerHTML = (await data.current.wind_kph) + ' km/h';
  } else {
    windSpeedText.innerHTML = (await data.current.wind_mph) + ' mp/h';
  }

  if (await data.current.is_day) {
    document.body.style.backgroundImage = `url('images/daytime.png')`;
  } else {
    document.body.style.backgroundImage = `url('images/nighttime.png')`;
  }
}

function UpdateWindDirectionImage(windDirection) {
  switch (windDirection) {
    case 'N':
      windDirectionImage.src = './images/arrows/up.png';
      break;
    case 'S':
      windDirectionImage.src = './images/arrows/down.png';
      break;
    case 'E':
      windDirectionImage.src = './images/arrows/right.png';
      break;
    case 'W':
      windDirectionImage.src = './images/arrows/left.png';
      break;
    case 'NE':
      windDirectionImage.src = './images/arrows/up-right.png';
      break;
    case 'NNW':
    case 'WNW':
    case 'NW':
      windDirectionImage.src = './images/arrows/up-left.png';
      break;
    case 'SE':
      windDirectionImage.src = './images/arrows/down-right.png';
      break;
    case 'WSW':
    case 'SSW':
    case 'SW':
      windDirectionImage.src = './images/arrows/down-left.png';
      break;
    default:
      break;
  }
}

function UpdateWeatherAnimation(weatherConditionText) {
  if (weatherConditionText.includes('rain')) {
    MakeRain();
  } else if (weatherConditionText.includes('snow')) {
    MakeSnow();
  } else {
    ClearWeather();
  }
}

function MakeRain() {
  isRaining = true;
  isSnowing = false;
  animateDrop();
  animateLightning();
}

function MakeSnow() {
  isRaining = false;
  isSnowing = true;
  animateSnowdrop();
}

function ClearWeather() {
  isRaining = false;
  isSnowing = false;
}

const animateDrop = () => {
  if (!isRaining) return;
  setTimeout(() => {
    addDrop();
    animateDrop();
  }, Math.random() * 20);
};

const animateSnowdrop = () => {
  if (!isSnowing) return;
  setTimeout(() => {
    addSnowdrop();
    animateSnowdrop();
  }, Math.random() * 20);
};

const animateLightning = () => {
  if (!isRaining) return;
  setTimeout(() => {
    addLightning();
    animateLightning();
  }, Math.random() * 10000);
};

const addDrop = () => {
  const drop = document.createElement('div');
  drop.classList.add('drop');
  drop.style.left = `${Math.random() * window.innerWidth}px`;
  drop.style.animationDuration = `${Math.random()}s`;
  body.append(drop);
  setTimeout(() => {
    drop.remove();
  }, 2000);
};

const addSnowdrop = () => {
  const snowdrop = document.createElement('div');
  snowdrop.classList.add('snowDrop');
  snowdrop.style.left = `${Math.random() * window.innerWidth}px`;
  snowdrop.style.animationDuration = `${Math.random() * 3 + 3}s`;
  body.append(snowdrop);
  setTimeout(() => {
    snowdrop.remove();
  }, 5000);
};

const addLightning = () => {
  const light = document.createElement('div');
  light.classList.add('light');

  body.append(light);
  setTimeout(() => {
    light.remove();
  }, 500);
};
