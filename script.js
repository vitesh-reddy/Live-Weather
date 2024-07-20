const doc = document;
const city = doc.querySelector("#cityweather");
const permission = doc.querySelector("#permission");
const error = doc.querySelector("#error");
const errormsg = error.querySelector("#errormsg");
const loading = doc.querySelector("#loading");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const option = doc.querySelector("#options");
const search = doc.querySelector("#search");
const searchbtn = search.querySelector("#searchbtn");
const searchbar = search.querySelector("#searchbar");
const yourcity = doc.querySelector("#yourcity");
const contactbtn = document.querySelector("#contactbtn");
const contactdiv = document.querySelector("#contactdiv");
let yourCityData;
let yourCityName;
let cityData;
let cityName;

doc.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        doc.querySelector("#searchbar").blur();
        getSearchCity();
        if (
            !contactdiv.classList.contains("h-0") &&
            event.target.id != "contactbtn"
        )
            getInTouch();
    }
});

let getInTouch = () => {
    contactdiv.classList.toggle("scale-0");
    contactdiv.classList.toggle("h-20");
    contactdiv.classList.toggle("h-0");
    contactdiv.classList.toggle("pb-[15px]");
};

doc.addEventListener("click", function (event) {
    if (
        event.target.id !== "search" &&
        event.target.id !== "searchbar" &&
        event.target.id !== "searchbtn"
    ) {
        if (searchbar.value === "" && yourCityName === cityName) {
            search.classList.replace("bg-[#dbe2ef80]", "bg-transparent");
            searchbtn.classList.replace("scale-100", "scale-0");
            search.classList.replace("min-w-[140px]", "min-w-[120px]");
            search.classList.replace("pr-[25px]", "pr-[10px]");
        }
    }
    if (
        !contactdiv.classList.contains("h-0") &&
        event.target.id != "contactbtn"
    )
        getInTouch();
});

let changeTab = (Event) => {
    const element = Event.target.id;
    if (
        element == "search" ||
        element == "searchbar" ||
        element == "searchbtn"
    ) {
        searchbar.focus();
        search.classList.replace("bg-transparent", "bg-[#dbe2ef80]");
        searchbtn.classList.replace("scale-0", "scale-100");
        search.classList.replace("min-w-[120px]", "min-w-[140px]");
        search.classList.replace("pr-[10px]", "pr-[25px]");
    } else if (element == "yourcity") {
        if (yourCityName == undefined) {
            city.classList.replace("scale-100", "scale-0");
            error.classList.replace("scale-100", "scale-0");
            permission.classList.replace("scale-0", "scale-100");
            permission.querySelector("button").classList.add("scale-105");
            setTimeout(() => {
                permission
                    .querySelector("button")
                    .classList.remove("scale-105");
            }, 200);
            return;
        }
        getYourLocation();
    }
};
option.addEventListener("click", changeTab);

let getYourLocation = () => {
    permission.classList.replace("scale-100", "scale-0");
    error.classList.replace("scale-100", "scale-0");
    loading.classList.toggle("scale-0");

    search.classList.replace("bg-[#dbe2ef80]", "bg-transparent");
    searchbtn.classList.replace("scale-100", "scale-0");
    search.classList.replace("min-w-[140px]", "min-w-[120px]");
    search.classList.replace("pr-[25px]", "pr-[10px]");
    yourcity.classList.replace("bg-transparent", "bg-[#dbe2ef80]");

    doc.querySelector("#searchbar").value = "";
    if (yourCityData != undefined) {
        cityData = yourCityData;
        cityName = yourCityName;
        setCity();
        loading.classList.toggle("scale-0");
        return;
    }

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(getCoordUsingGPS, () => {
            setTimeout(() => {
                loading.classList.toggle("scale-0");
                permission.classList.replace("scale-0", "scale-100");
                yourcity.classList.replace("bg-[#dbe2ef80]", "bg-transparent");
            }, 1000);
        });
    else {
        setTimeout(() => {
            loading.classList.toggle("scale-0");
            permission.classList.replace("scale-0", "scale-100");
            yourcity.classList.replace("bg-[#dbe2ef80]", "bg-transparent");
        }, 1000);
    }
};

let getCoordUsingGPS = async (location) => {
    let latitude = await location.coords.latitude;
    let longitude = await location.coords.longitude;
    await setYourCityName(latitude, longitude);
    getCityData(latitude, longitude, true);
};

// let getYourLocationUsingIP = async () => {
//     let responce = await fetch("https://ipapi.co/json/");
//     let UserData = await responce.json();
//     getCoordsUsingIP(UserData);
// }

// let getCoordsUsingIP = async (UserData) => {
//     let latitude = await UserData.latitude;
//     let longitude = await UserData.longitude;

//     await setYourCityName(latitude, longitude);
//     await getCityData(latitude, longitude, true);
// }

let setYourCityName = async (latitude, longitude) => {
    let responce = await fetch(
        "https://geocode.maps.co/reverse?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&api_key=668d312d38652220816457cjnb80033"
    );
    let data = await responce.json();

    cityName =
        data.address?.suburb != undefined
            ? data.address?.suburb
            : data.address?.county;
    cityName = cityName != undefined ? cityName : data.address?.city;
    cityName = cityName != undefined ? cityName : data.address?.country;
    yourCityName = cityName;
    yourcity.classList.replace("bg-transparent", "bg-[#dbe2ef80]");
};

let getSearchCity = async () => {
    const searchbar = doc.querySelector("#searchbar");
    cityName = searchbar.value;

    searchbar.blur();
    if (cityName == "") return;

    yourcity.classList.replace("bg-[#dbe2ef80]", "bg-transparent");
    permission.classList.replace("scale-100", "scale-0");
    loading.classList.toggle("scale-0");

    const response = await fetch(
        "https://geocode.maps.co/search?q=" +
            cityName +
            "&api_key=668d312d38652220816457cjnb80033"
    );
    let cityCoords = await response.json();

    if (cityCoords.length === 0) {
        city.classList.replace("scale-100", "scale-0");
        error.classList.replace("scale-0", "scale-100");
        loading.classList.toggle("scale-0");
    } else {
        error.classList.replace("scale-100", "scale-0");
        getCityData(cityCoords[0].lat, cityCoords[0].lon, false);
    }
};

let getCityData = async (latitude, longitude, native) => {
    let coordsResponce = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&appid=" +
            API_KEY +
            "&units=metric"
    );
    cityData = await coordsResponce.json();

    if (cityData != undefined) {
        if (native) {
            cityName = yourCityName;
            yourCityData = cityData;
        }
        setCity();
        permission.classList.replace("scale-100", "scale-0");
    } else permission.classList.replace("scale-0", "scale-100");
    loading.classList.toggle("scale-0");
};

let setCity = async () => {
    if ((await cityName.charCodeAt(0)) >= 95)
        city.querySelector("#cityname").innerText =
            String.fromCharCode((await cityName.charCodeAt(0)) - 32) +
            cityName.slice(1);
    else city.querySelector("#cityname").innerText = cityName;

    let flag = cityData.sys.country;
    let flagUrl = "https://flagsapi.com/" + flag + "/flat/32.png";
    let flagurl =
        "https://www.worldometers.info//img/flags/small/tn_" +
        flag +
        "-flag.gif";
    city.querySelector("#flag").setAttribute("src", flagUrl);

    let sky = cityData.weather[0].main;
    city.querySelector("#sky").innerText = sky;

    let skyimgurl =
        "http://openweathermap.org/img/w/" + cityData.weather[0].icon + ".png";
    city.querySelector("#skyimg").setAttribute("src", skyimgurl);

    let temp = cityData.main.temp.toFixed(2) + "°C";
    city.querySelector("#temp").innerHTML = temp;

    let feelslike = "Feels Like " + cityData.main.feels_like.toFixed(2) + "°C";
    city.querySelector("#feelslike").innerHTML = feelslike;

    city.querySelector("#windspeed").innerText =
        (cityData.wind.speed * 3.6).toFixed(2) + " Kmph";

    city.querySelector("#humid").innerText = cityData.main.humidity + "%";

    city.querySelector("#cloud").innerText = cityData.clouds.all + "%";

    let visibleRange = cityData.visibility;
    let visibility;

    if (visibleRange >= 10000) visibility = "Excellent";
    else if (5000 <= visibleRange < 10000) visibility = "Good";
    else if (2000 <= visibleRange < 5000) visibility = "Fair";
    else if (1000 <= visibleRange < 2000) visibility = "Poor";
    else visibility = "Very Poor";
    city.querySelector("#visibility").innerText = visibility;

    city.classList.replace("scale-0", "scale-100");
};
