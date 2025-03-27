
import { Country } from "./CountryClass.JS";

const allUrl = `https://restcountries.com/v3.1/all`;

const countriesToDisplay = ["ISRAEL", "UNITED STATES", "THAILAND", "FRANCE"];
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
        Object.values(countryData.languages).join(", "),
        Object.values(countryData.currencies).map(c => c.name).join(", "),
        countryData.latlng,
        countryData.borders
    );
};

export const fetchByCountry = (name) => {
    const filteredCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().startsWith(name.toLowerCase())
    );
    container.innerHTML = "";
    selectedContainer.innerHTML = "";

    filteredCountries.forEach((countryData) => {
        const country = createCountryObject(countryData);
        const countryButton = country.renderFront();

        countryButton.addEventListener("click", () => {
            container.innerHTML = "";
            selectedContainer.replaceChildren(country.renderByInfo());
        });

        container.appendChild(countryButton);
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

    container.innerHTML = "";
    selectedContainer.innerHTML = "";

    if (!countryData) return;

    const country = createCountryObject(countryData);
    const countryButton = country.renderFront();

    countryButton.addEventListener("click", () => {
        container.innerHTML = "";
        selectedContainer.replaceChildren(country.renderByInfo());
    });

    container.appendChild(countryButton);
};

export const countryFront = () => {
    frontCountries.forEach((countryData) => {
        const country = createCountryObject(countryData);
        const countryButton = country.renderFront();

        countryButton.addEventListener("click", () => {
            container.innerHTML = "";
            selectedContainer.replaceChildren(country.renderByInfo());
        });

        container.appendChild(countryButton);
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
        if (input.value.trim() === "") {
            selectedContainer = "";
            container.innerHTML = "";
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
    const USA = document.querySelector("#USA");
    const ISRAEL = document.querySelector("#ISRAEL");
    const FRANCE = document.querySelector("#FRANCE");
    const THAILAND = document.querySelector("#THAILAND");
    USA.addEventListener("click", () => {
        fetchByCountry("UNITED STATES");
    })
    ISRAEL.addEventListener("click", () => {
        fetchByCountry("ISRAEL");
    })
    FRANCE.addEventListener("click", () => {
        fetchByCountry("FRANCE");
    })
    THAILAND.addEventListener("click", () => {
        fetchByCountry("THAILAND");
    })
}

createFetch();
