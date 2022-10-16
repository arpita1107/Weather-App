// Getting all the necessary elements from DOM
const app = $(".weather-app");
const temp = $("#temp");
const dateOutput = $(".date");
const timeOutput = $(".time");
const conditionOutput = $(".condition");
const nameOutput = $(".name");
const icon = $(".icon");
const cloudOutput = $(".cloud");
const humidityOutput = $(".humidity");
const windOutput = $(".wind");
const form = $(".location-input");
const search = $(".search");
const btn = $(".submit");
const cities = $(".city");

let initCity = "London";

[...cities].forEach((city) => {
    city.addEventListener("click", (event) => {
        let cityInput = event.target.innerHTML;
        fetchWeatherData(cityInput); // function that fetches data from the weather API
        app.css("opacity", 0); //fade out (simple animation)
    });
});

// Adding submit event to the form
form.submit((event) => {
    console.log("icon.src:", icon.src);

    event.preventDefault();
    /* If the input field (search bar) is empty, throw an alert */
    if (search[0].value.length == 0) {
        alert("Please type in a city name");
    } else {
        let cityInput = search[0].value;
        console.log("value of search.length");
        console.log(search[0].value.length);
        fetchWeatherData(cityInput);
        // Remove all the text from the input field
        search[0].value = "";
        app.css("opacity", 0);
    }
    return false;
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturady",
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

// Function that fetches and displays data from the weather API
function fetchWeatherData(loc) {
    console.log(app);
    /* fetch the data and dynamically add city names with template literals */
    fetch(
        `http://api.weatherapi.com/v1/current.json?key=396baee8347d48b5bb485643222404&q=${loc}`
    )
        /* take the data which is in JSON format and convert it into JSON Obj */
        .then((response) => response.json())
        .then((data) => {
            console.log("data:",data);
            temp.text(data.current.temp_c+"°");
            conditionOutput.text(data.current.condition.text);

            // const date = data.location.localtime;
            // const y = parseInt(date.substr(0, 4));
            // const m = parseInt(date.substr(5, 2));
            // const d = parseInt(date.substr(8, 2));
            // const time = date.substr(11);
            // console.log(d);
            // console.log(m);
            // console.log(y);
            const date = new Date(data.location.localtime);
            /* Original format: 2021-10-09 17:53
         New Format: 17:53 - Friday 9, 10 2021 */
            // dateOutput.text(`${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`);
            // timeOutput.text(time);
            // changed
            dateOutput.text(date.toDateString());
            timeOutput.text(date.toLocaleTimeString());
            nameOutput.text(data.location.name);
            /* Get the coressponding icon URL for weather and extract a part of it*/
            const iconId = data.current.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/".length
            );

            // Reformat the URL to your local folder path and add it to the page
            icon[0].src = "./icons/" + iconId;

            // adding the weather details of the selected city to the page
            cloudOutput.text(data.current.cloud + "%");
            humidityOutput.text(data.current.humidity + "%");
            windOutput.text(data.current.wind_kph + "km/h");

            //set default time of the day
            let timeOfDay = "day";
            // Get the unique ID for each weather condition
            const code = data.current.condition.code;
            console.log(code);
            // change to night if its night time in the city
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
                // set the background image to clear if the weather is clear
                app[0].style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                // change the button background colour depending on if its day or night
                btn[0].style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn[0].style.background = "#181e27";
                }
            } else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app[0].style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn[0].style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn[0].style.background = "#181e27";
                }
            } else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app[0].style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn[0].style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn[0].style.background = "#325c80";
                }
            } else {
                app[0].style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn[0].style.background = "#4d72aa";
                if (timeOfDay == "night") {
                    btn[0].style.background = "#1b1b1b";
                }
            }
            app.css("opacity", 1);

        })

        // if the user types a city that doesn't exist throw an alert
        .catch((e) => {
            alert(e.message);
            // alert('City not found, please try again');
            app.css("opacity", 1);
        });
}

(() => {
    // call the function on page load
    fetchWeatherData(initCity);
})();

// fade in the page
app.css("opacity", 1);
