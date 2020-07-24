var weather = {
    temperature: {
        value: 0,
        unit: "celsius",
        raw: 0
    },

    location: {
        city: "-",
        country: ''
    },

    iconId: "unknown",
    description: "-",

    notification: "",

    today:""
}

let $notification;
let $icon;
let $description;
let $temperature;
let $location;
let $today;


function celsiusToFahrenheit(temperature) {
    return Math.floor((temperature * 9 / 5) + 32);
}

function fahrenheitToCelsius(temperature) {
    return (temperature - 32) * 5 / 9;
}

function getWeather(latitude, longitude) {
    //OpenWeatherMap
    const appid = "81e88906450c3e2d1de97260891fa2f4";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${appid}`;

    fetch(url).then((response) => {
        let data = response.json();
        return data;
    }).then((data) => {
        console.log(data);
        if (data.cod == 200) {
            weather.temperature.value = Math.floor(data.main.temp - 273);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.location.city = data.name;
            weather.location.country = data.sys.country;
        }else{
            weather.notification = data.message;
        }
        updateUI();
    });

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            getWeather(pos.coords.latitude, pos.coords.longitude);
        }, (err) => {
            weather.notification = err.message;
            updateUI();
        });
    }
    else {
        weather.city = "-";
        weather.country = "";
        $notification.css("display", "block");
        weather.notification = "<p>Not Support Geolocation!</p>";
        updateUI();
    }
}

function today(){
   const day = (t)=>{
       let i = t.getDay();
       switch(i) {
           case 0: return "Sun";
           case 1: return "Mon";
           case 2: return "Tu";
           case 3: return "Wed";
           case 4: return "Thu";
           case 5: return "Fri";
           case 6: return "Sat";
       }
   }
   const t = new Date();
   return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()} ${day(t)}`
}

function updateUI() {
    //console.log(weather);

    $icon.html(`<img src="icons/${weather.iconId}.png">`);
    if (weather.temperature.unit == "celsius") {
        $temperature.html(`<p>${weather.temperature.value}<sup>o</sup><span>C</span></p>`);
    } else {
        $temperature.html(`<p>${weather.temperature.value} <span>F</span></p>`);
    }
    $description.html(`<p>${weather.description}</p>`);
    $location.html(`<p>${weather.location.city}, ${weather.location.country}</p>`);
    $notification.html(`${weather.notification}`);

    
}

$(() => {
    $notification = $(".notification");
    $icon = $(".weather-icon");
    $description = $(".temperature-description")
    $temperature = $(".temperature-value");
    $location = $(".location");
    $today = $(".time");

    $temperature.on("click", (e) => {
        if (weather.temperature.value === undefined)
            return;
        if (weather.temperature.unit == "celsius") {
            weather.temperature.value = celsiusToFahrenheit(weather.temperature.value);
            weather.temperature.unit = "fahrenheit";
        } else {
            weather.temperature.value = weather.temperature.raw;
            weather.temperature.unit = "celsius";
        }
        updateUI();
    });

    setInterval(()=>{
        $today.html(`<p>${today()}</p>`);
    }, 1000);

    getLocation();
})