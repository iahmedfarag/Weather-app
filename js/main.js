var locationElement = document.querySelector(".location .container");
var currentDay = document.querySelector(".content .current");
var secondDay = document.querySelector(".content .secondDay");
var thirdDay = document.querySelector(".content .thirdDay");
var searchInput = document.querySelector(".search input");
var alert = document.querySelector(".search .alert");
var moreParent = document.querySelector(".more");
var moreEl = document.querySelector(".more .container");

var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

async function getData(searchValue) {
  try {
    var url = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=dabf9a81b6d94791937100600231902&q=${
        !searchValue ? "cairo" : searchValue
      }&days=3`
    );
    var res = await url.json();

    // show location section
    showLocation(res);
    // boxes
    showCurrentBox(res);
    showSecondDay(res);
    showThirdDay(res);

    //   triggering it as default for current box
    more(res, 0);

    //   more info for current box
    document
      .getElementById("currentMoreInfo")
      .addEventListener("click", function () {
        more(res, 0);
      });
    //   more info for second box

    document
      .getElementById("secondMoreInfo")
      .addEventListener("click", function () {
        more(res, 1);
      });
    //   more info for third box

    document
      .getElementById("thirdMoreInfo")
      .addEventListener("click", function () {
        more(res, 2);
      });

    alert.style.display = "none";
  } catch (error) {
    console.log(error);
    alert.style.display = "block";
  }

  console.log(res);
}

getData();

// show location function
function showLocation(data) {
  var timeEl = data.location.localtime.slice(
    11,
    data.location.localtime.length
  );

  locationElement.innerHTML = `
    <div class="left circle">
    <h2 class="name">${data.location.name}</h2>
    <h2 class="country">${data.location.country}</h2>
  </div>
  <div class="right circle">
    <h2 class="time">${timeEl}</h2>
  </div>`;
}

// show current box
function showCurrentBox(data) {
  // to get the day
  var utcSeconds = data.current.last_updated_epoch;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);

  //   to get the date
  var dateEl = data.current.last_updated.slice(0, 11);

  currentDay.innerHTML = `
    <div class="header">
    <h4 class="day">${days[d.getDay()]}</h4>
    <h4 class="date">${dateEl}</h4>
  </div>
  <div class="data">
    <h1 class="temp">${data.current.temp_c}*C</h1>
    <img
      src="${data.current.condition.icon}"
      class="icon"
    />
    <h4 class="text">${data.current.condition.text}</h4>
  </div>
  <div class="footer">
    <button id="currentMoreInfo">More Info</button>
  </div>
    `;
}
// show second day
function showSecondDay(data) {
  // to get the day
  var utcSeconds = data.forecast.forecastday[1].date_epoch;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);

  secondDay.innerHTML = `
  <div class="header">
  <h4 class="day">${days[d.getDay()]}</h4>
  <h4 class="date">${data.forecast.forecastday[1].date}</h4>
</div>
  <div class="data">
    <h1 class="temp">${data.forecast.forecastday[1].day.avgtemp_c}*C</h1>
    <img
      src="${data.forecast.forecastday[1].day.condition.icon}"
      class="icon"
    />
    <h4 class="text">${data.forecast.forecastday[1].day.condition.text}</h4>
  </div>
  <div class="footer">
    <button id="secondMoreInfo">More Info</button>
  </div>
    
    `;
}
// show third day
function showThirdDay(data) {
  // to get the day
  var utcSeconds = data.forecast.forecastday[2].date_epoch;
  var d = new Date(0);
  d.setUTCSeconds(utcSeconds);

  thirdDay.innerHTML = `
  <div class="header">
  <h4 class="day">${days[d.getDay()]}</h4>
  <h4 class="date">${data.forecast.forecastday[2].date}</h4>
</div>
  <div class="data">
    <h1 class="temp">${data.forecast.forecastday[2].day.avgtemp_c}*C</h1>
    <img
      src="${data.forecast.forecastday[2].day.condition.icon}"
      class="icon"
    />
    <h4 class="text">${data.forecast.forecastday[2].day.condition.text}</h4>
  </div>
  <div class="footer">
    <button id="thirdMoreInfo">More Info</button>
  </div>
    
    `;
}

// search input
searchInput.addEventListener("keydown", function (e) {
  var searchValue = e.target.value;
  getData(searchValue);
});

function more(data, index) {
  moreParent.classList.add("active");
  if (index == 0) {
    currentDay.classList.add("active");
    secondDay.classList.remove("active");
    thirdDay.classList.remove("active");
  } else if (index == 1) {
    currentDay.classList.remove("active");
    secondDay.classList.add("active");
    thirdDay.classList.remove("active");
  } else {
    currentDay.classList.remove("active");
    secondDay.classList.remove("active");
    thirdDay.classList.add("active");
  }
  moreEl.innerHTML = `
  <div class="left">
  <div class="header">
    <p class="sunrise">sunrise: ${data.forecast.forecastday[index].astro.sunrise}</p>
    <p class="sunset">sunset: ${data.forecast.forecastday[index].astro.sunset}</p>
    <p class="moonrise">moonrise: ${data.forecast.forecastday[index].astro.moonrise}</p>
    <p class="moonset">moonset: ${data.forecast.forecastday[index].astro.moonset}</p>
  </div>
  <div class="body">
    <p class="maxtemp">max temp: ${data.forecast.forecastday[index].day.maxtemp_c}*C</p>
    <p class="mintemp">min temp: ${data.forecast.forecastday[index].day.mintemp_c}*C</p>
    <p class="avgtemp">average temp: ${data.forecast.forecastday[index].day.avgtemp_c}</p>
    <p class="rainchance">rain chance: ${data.forecast.forecastday[index].day.daily_chance_of_rain}</p>
    <p class="snowchance">snow chance: ${data.forecast.forecastday[index].day.daily_chance_of_snow}</p>
  </div>
  </div>
    
  <div class="hours">
  <ul class="firstH"></ul>
  <ul class="secondH"></ul>
  <ul class="thirdH"></ul>
  </div>
    `;

  var hoursEl = document.querySelector(".more .hours ul");

  for (i = 0; i < 8; i++) {
    var timeEl = data.forecast.forecastday[index].hour[i].time.slice(
      11,
      data.forecast.forecastday[index].hour[i].time.length
    );
    hoursEl.innerHTML += `
          <li>
              <p class="time">Time: ${timeEl}</p>
              <p>Temp: ${data.forecast.forecastday[index].hour[i].temp_c}*C</p>
              <p>Rain chance: ${data.forecast.forecastday[index].hour[i].chance_of_rain}</p>
          </li>
        `;
  }
  for (i = 8; i < 16; i++) {
    var timeEl = data.forecast.forecastday[index].hour[i].time.slice(
      11,
      data.forecast.forecastday[index].hour[i].time.length
    );
    hoursEl.nextElementSibling.innerHTML += `
    <li>
    <p class="time">Time: ${timeEl}</p>
    <p>Temp: ${data.forecast.forecastday[index].hour[i].temp_c}*C</p>
    <p>Rain chance: ${data.forecast.forecastday[index].hour[i].chance_of_rain}</p>
</li>
        `;
  }
  for (i = 16; i < 24; i++) {
    var timeEl = data.forecast.forecastday[index].hour[i].time.slice(
      11,
      data.forecast.forecastday[index].hour[i].time.length
    );
    hoursEl.nextElementSibling.nextElementSibling.innerHTML += `
    <li>
    <p class="time">Time: ${timeEl}</p>
    <p>Temp: ${data.forecast.forecastday[index].hour[i].temp_c}*C</p>
    <p>Rain chance: ${data.forecast.forecastday[index].hour[i].chance_of_rain}</p>
</li>
        `;
  }
}
