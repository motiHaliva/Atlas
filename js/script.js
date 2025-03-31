
import { Country } from "./CountryClass.JS";

const allUrl = `https://restcountries.com/v3.1/all`;
const countriesToDisplay = ["ISRAEL", "UNITED STATES", "THAILAND", "FRANCE"];
const arrayCode=["USA","ISR","THA","FRA"];
const selectedContainer = document.getElementById("selected-country-container");
const container = document.getElementById("countries-container");
let frontCountries = [];
let allCountries = [];

const createFetch = async () => {
    try {
    
        const response = await fetch(allUrl); 
        const res = await response.json(); 
   
        
        allCountries = res.filter((country) => country.name.common.toUpperCase() !== "PALESTINE");
        frontCountries = res.filter((country) =>
            countriesToDisplay.includes(country.name.common.toUpperCase())
        );
        allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        countryFront();
        countryByInfo();
        linkMenu();
    } catch (error) {
        console.error("Error fetching country data:", error); 
    }
};

const createCountryObject = (countryData) => {
    return new Country(
        countryData.name.common,
        countryData.population,
        countryData.capital,
        countryData.flags.png,
        countryData.maps.googleMaps,
        Object.values(countryData.languages),
        Object.values(countryData.currencies).map(c => c.name),
        countryData.latlng,
        countryData.borders
    );
};
const renderCountryButton = (countryData) => {
    const country = createCountryObject(countryData);
    const countryButton = country.renderFront();

    countryButton.addEventListener("click", () => {
        container.innerHTML = "";
        selectedContainer.replaceChildren(country.renderByInfo());
    });

    container.appendChild(countryButton);
};
const deleteContainer=()=>{
    container.innerHTML = "";
    selectedContainer.innerHTML = "";
}

export const fetchByCountry = (name) => {
    const filteredCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().startsWith(name.toLowerCase())
    );
    deleteContainer();
    filteredCountries.forEach((countryData) => {
        renderCountryButton(countryData);
    });
    if (filteredCountries.length === 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.classList.add("no-results");
        noResultsMessage.textContent = "No countries found";
        container.appendChild(noResultsMessage);
    }
};

export const fetchByCode = (code) => {
    const countryData = allCountries.find(country => country.cca3.toLowerCase() === code.toLowerCase());
    deleteContainer();
    if (!countryData) return;
    renderCountryButton(countryData);
};
export const countryFront = () => {
    frontCountries.forEach((countryData) => {
        renderCountryButton(countryData);
    });
};

const countryByInfo = () => {
    const input = document.querySelector("#id_input")
    const selectElement = document.querySelector(".select");
    selectElement.innerHTML = "<option value=''>Select a Country</option>";

    allCountries.forEach((countryData) => {
        const option = document.createElement("option");
        option.value = countryData.name.common;
        option.textContent = countryData.name.common;
        selectElement.appendChild(option);

    });

    input.addEventListener("input", () => {
        if (input.value==="") {
            deleteContainer();
            countryFront();
        } else {
            fetchByCountry(input.value);
        }
    });

    selectElement.addEventListener("change", (event) => {
        const selectedCountryName = event.target.value;
        if (selectedCountryName) {
            fetchByCountry(selectedCountryName);
        }
    });
};

 const linkMenu = () => {
    arrayCode.forEach(code => {
        const element = document.querySelector(`#${code}`);
        if (element) {
            element.addEventListener("click", () => fetchByCode(code));
        }
    });

    const locationButton = document.getElementById("location-btn");
    if (locationButton) {
        console.log("Location button found");
        
        locationButton.addEventListener("click", () => getCurrentLocations());
    }
};

export const fetchWeather = async (city) => {
    const API_KEY = "f138b36e05875e65f09064edfc925e31";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`;

    try {
        const response = await fetch(url);  
        const data = await response.json(); 
      renderWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error); 
    }
};
const renderWeather = (data) => {
    const weatherInfo = document.getElementById("weatherInfo");
    weatherInfo.innerHTML = `
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
    `;
}
export const getCurrentCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {     
            const coordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            resolve(coordinates);
          },
        );
      } 
    });
  };
  getCurrentCoordinates()
  export const getCurrentLocations = async () => {
    deleteContainer()
    selectedContainer.innerHTML=`
    <img id="imgLoad" width="100" src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif " alt="loading"></div>
    `
    try {
      const coordinates = await getCurrentCoordinates();
      console.log(coordinates);
      
      const { latitude, longitude } = coordinates;
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.
        countryName);
      if (data.countryName) {
        fetchByCountry(data.countryName);
      }
    } 
    catch (error) {
      console.error("Error fetching location data:", error); 
    }
  };


createFetch();
