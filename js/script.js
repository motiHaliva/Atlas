
import { Country } from "./CountryClass.JS";

const allUrl = `https://restcountries.com/v3.1/all`;

const countriesToDisplay = ["ISRAEL", "UNITED STATES", "THAILAND", "FRANCE"];
const arrayCode=["USA","ISR","THA","FRA"];
const selectedContainer = document.getElementById("selected-country-container");
const container = document.getElementById("countries-container");
let frontCountries = [];
let allCountries = [];

const createFetch = () => {
    fetch(allUrl)
        .then((res) => res.json())
        .then((res) => {
            allCountries = res.filter((country) => country.name.common.toUpperCase() !== "PALESTINE");
            frontCountries = res.filter((country) =>
                countriesToDisplay.includes(country.name.common.toUpperCase())
            );
            allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            countryFront();
            countryByInfo();
            linkMenu();
        })
        .catch((error) => console.error("Error fetching country data:", error));
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
};
const API_KEY = "f138b36e05875e65f09064edfc925e31";
export const fetchWeather = (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`;

   fetch(url)
        .then(response => response.json())
        .then(data => {  
            const weatherInfo = document.getElementById("weatherInfo");
            weatherInfo.innerHTML = `
                <p> <strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p> <strong>Description:</strong> ${data.weather[0].description}</p>
            `;  
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
};


createFetch();
