const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
// const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const cityEl = document.getElementById('city');
const hourlyForecastItemsEl = document.getElementById('hourly-forecast-items');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('today-temp');

const searchLocationEl = document.getElementById('search-location');
const searchWindowEl = document.getElementById('search-window');

const days = ['Sunday', 'Monday', 'Tuesday', 'wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WeatherBackground = {
    "1": "photo/clear sky.jpg",
    "2": "photo/few clouds.jpg",
    "3": "photo/scattered clouds.jpg",
    "4": "photo/broken clouds.jpg",
    "9": "photo/shower rain.jpg",
    "10": "photo/rain.jpg",
    "11": "photo/thunderstorm.jpg",
    "13": "photo/snow.jpg",
    "50": "photo/mist.jpg"
};

//openweathermap api key
const ApiKey = '';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12HourFormate = hour >= 13 ? hour % 12 : hour;
    const minute = time.getMinutes();
    const amPm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hourIn12HourFormate < 10 ? '0' + hourIn12HourFormate : hourIn12HourFormate) + ':' + (minute < 10 ? '0' + minute : minute) + ' ' + `<span id="am-pm">${amPm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${ApiKey}`).then(res => res.json()).then(data => {
            console.log(data);
            shoWeatherData(data);

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${ApiKey}`).then(res => res.json()).then(data1 => {
                console.log("location - ", data1.name);

                cityEl.innerHTML = data1.name;
            })

        })
    })

    // fetch(`https://api.openweathermap.org/data/2.5/weather?q=bhavnagar&units=metric&appid=${ApiKey}`).then(res => res.json()).then(data => {
    //         console.log(data);
    //     })
}

function shoWeatherData(data) {
    let { clouds, humidity, pressure, sunrise, sunset, temp, uvi, visibility, wind_speed } = data.current;

    timeZoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

    // document.body.style.background = `url('${WeatherBackground[parseInt(data.current.weather[0].icon)]}')`;
    document.body.style = `background: url('${WeatherBackground[parseInt(data.current.weather[0].icon)]}') no-repeat center center fixed; 
    background-size: cover;
    background-color: rgba(0,0,0,0.9);
    font-family: 'poppins', sans-serif;
    scroll-behavior: smooth;`;

    document.getElementById('ctemp-logo').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png" alt="current weather img">`;
    document.getElementById('ctemp').innerHTML = `${Math.floor(temp)}&#176; c`;
    document.getElementById('cdiscription').innerHTML = data.current.weather[0].description;

    document.getElementById('chumidity').innerHTML = `Humidity ${humidity}%`;
    document.getElementById('cpressure').innerHTML = `Pressure ${pressure} hPa`;
    document.getElementById('cwindspeed').innerHTML = `Wind Speed ${Math.floor(wind_speed * 3.6)} km/h`;
    document.getElementById('ccloudiness').innerHTML = `Cloudiness ${clouds}%`;
    document.getElementById('cvisibility').innerHTML = `Visibility ${visibility / 1000} km`;
    document.getElementById('cuvi').innerHTML = `UV index ${uvi}`;

    document.getElementById('cmax-temp').innerHTML = `${data.daily[0].temp.max}&#176; c`;
    document.getElementById('cmin-temp').innerHTML = `${data.daily[0].temp.min}&#176; c`;
    document.getElementById('cday-temp').innerHTML = `${data.daily[0].temp.day}&#176; c`;
    document.getElementById('cnight-temp').innerHTML = `${data.daily[0].temp.night}&#176; c`;
    document.getElementById('csunrise').innerHTML = `${window.moment(sunrise * 1000).format('HH:MM a')}`;
    document.getElementById('csunset').innerHTML = `${window.moment(sunset * 1000).format('HH:MM a')}`;

    // currentWeatherItemsEl.innerHTML = `
    // <div class="weather-item">
    //     <div>Humidity</div>
    //     <div>${humidity} %</div>
    // </div>
    // <div class="weather-item">
    //     <div>Pressure</div>
    //     <div>${pressure} hPa</div>
    // </div>
    // <div class="weather-item">
    //     <div>Wind Speed</div>
    //     <div>${wind_speed} m/s</div>
    // </div>
    // <div class="weather-item">
    //     <div>Sunrise</div>
    //     <div>${window.moment(sunrise*1000).format('HH:MM a')}</div>
    // </div>
    // <div class="weather-item">
    //     <div>Sunset</div>
    //     <div>${window.moment(sunset*1000).format('HH:MM a')}</div>
    // </div>`;

    let hourlyData = '';
    data.hourly.forEach((hour, idx) => {
        let h = window.moment(hour.dt * 1000).format('HH');
        // let d = window.moment(hour.dt*1000).format('DD');
        hourlyData += `<div class="hourly-item">
        <div class="hourly-time">${h >= 13 ? h % 12 : h == 0 ? 12 : h} ${h >= 12 ? "PM" : "AM"}</div>
        <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" class="hourly-logo">
        <div class="hourly-temp">${Math.floor(hour.temp)}&#176;c</div>
    </div>`
    })
    hourlyForecastItemsEl.innerHTML = hourlyData;

    let otherDayFor = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            // currentTempEl.innerHTML = `
            // <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            // <div class="other">
            //     <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            //     <div class="temp">Day - ${day.temp.day}&#176; c</div>
            //     <div class="temp">Night - ${day.temp.night}&#176; c</div>
            // </div>`
        } else {
            otherDayFor += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('DD MMM, ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="dailyWind_speed">Wind Speed - ${Math.floor(day.wind_speed * 3.6)} km/h</div>
                <div class="temp">Day - ${Math.floor(day.temp.day)}&#176; c</div>
                <div class="temp">Night - ${Math.floor(day.temp.night)}&#176; c</div>
            </div>`
        }
    })

    weatherForecastEl.innerHTML = otherDayFor;
}

// document.getElementById('current-scroll').addEventListener('click',CurrentScrollRight());

function CurrentScrollRight() {
    // console.log("scroll done......");
    document.getElementById('current-weather-items').scrollBy(200, 0);
}

function searchLocation() {
    let locat = searchLocationEl.value;
    if (locat == "") {
        window.alert("Please Enter Location !");
    }
    else {

        searchWindowEl.style.display = "flex";

        window.setTimeout(function () {
            document.getElementById('searchloader').style.display = "none";
        }, 1000);

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locat}&units=metric&appid=${ApiKey}`).then(res => res.json()).then(data1 => {
            console.log("locate - ", data1);

            document.getElementById('searched-city').innerHTML = data1.name;
            document.getElementById('search-logo').innerHTML = `<img src="http://openweathermap.org/img/wn/${data1.weather[0].icon}@4x.png" alt="current weather img">`;
            document.getElementById('searched-temp').innerHTML = `${Math.floor(data1.main.temp)}&#176;`;
            document.getElementById('searched-dis').innerHTML = data1.weather[0].description;
            document.getElementById('shumidity').innerHTML = `${data1.main.humidity} %`;
            document.getElementById('swind').innerHTML = `${Math.floor(data1.wind.speed * 3.6)} km/h`;
            document.getElementById('spressure').innerHTML = `${data1.main.pressure} hPa`;
            document.getElementById('svisibility').innerHTML = `${data1.visibility / 1000} km`;
            document.getElementById('ssunrise').innerHTML = `${window.moment(data1.sys.sunrise * 1000).format('HH:MM a')}`;
            document.getElementById('ssunset').innerHTML = `${window.moment(data1.sys.sunset * 1000).format('HH:MM a')}`;

        })
    }
}

function closeSearchWindow() {
    searchWindowEl.style.display = "none";
    searchLocationEl.value = "";
    document.getElementById('searchloader').style.display = "flex";
}
