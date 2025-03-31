import { countryFront } from "./script.js";
import { fetchByCode } from "./script.js";
import{fetchWeather}from "./script.js";

export class Country {
    constructor(name, population, capital, flag, mapLink, language ,currencies,coordinates,borderCountries) {
      this.name = name;
      this.population = population; 
      this.capital = capital;  
      this.flag = flag;  
      this.mapLink = mapLink;  
      this.language = language ;  
      this.currencies=currencies;
      this.coordinates=coordinates;
      this.borderCountries=borderCountries||"";
     }
 
    createBordersLinks() {
        if (!this.borderCountries || this.borderCountries.length === 0) {
            return "No border countries.";
        }
        return this.borderCountries.map(cca3 => 
            `<a href="#" class="border-country" data-cca3="${cca3}">${cca3}</a>`
        ).join(" "); 
    }
    
    renderFront() {
        const button = document.createElement("div");
        button.classList.add("country-button"); 
        button.innerHTML = `
    
       <div class="country-header">
        <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag" />
            <h2>${this.name}</h2>
        <div>`;
    
        return button;
    }

    renderByInfo() {
        const selected = document.getElementById("selected-country-container");
        const countryContainerInfo = document.createElement("div");
        countryContainerInfo.classList.add("country-container");
        const [lat, lng] = this.coordinates;
        const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=6&output=embed`;
        const bordersLinks = this.createBordersLinks();
        const Weather = fetchWeather(this.name);
    
        countryContainerInfo.innerHTML = `
            <div class="country-info">
                <div class="country-header">
                    <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag" />
                    <h2>${this.name}</h2>
                </div>
                <div class="country-details-container">
                <div class="country-details">
                    <p><strong>Population:</strong> ${this.population}</p>
                    <p><strong>Capital:</strong> ${this.capital}</p>
                    <p><strong>Language:</strong> ${this.language}</p>
                    <p><strong>Currencies:</strong> ${this.currencies}</p>
                      <p id="weatherInfo">${Weather}</p>
             <div class="borders-links">
                        <strong>Border Countries:</strong><br>
                        ${bordersLinks}
                    </div>
                </div>
                 
                </div>
                   <p><strong>External Map:</strong> <a href="${this.mapLink}" target="_blank">View on Google Maps</a></p>
                    <button class="back-button">Back to Countries</button>
            </div>
            <div class="country-map-container">
                <div class="map-loader">
                    <img id="imgLoad" width="100" src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif " alt="loading"></div>
                <iframe class="country-map"
                    src="${mapUrl}"
                    allowfullscreen>
                </iframe>
            </div>
          <button class=back-but" id="mobileBtn">Back to Countries</button>  
        `;
        selected.appendChild(countryContainerInfo);
        this.loadMap();
        const backButton = countryContainerInfo.querySelector(".back-button");
        backButton.addEventListener("click", () => {
            selected.innerHTML = ""; 
            countryFront(); 
        });
        
        const mobileBtn = countryContainerInfo.querySelector("#mobileBtn");
        mobileBtn.addEventListener("click", () => {
            selected.innerHTML = ""; 
            countryFront(); 
        });
        setTimeout(() => {
            document.querySelectorAll(".border-country").forEach(link => {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    fetchByCode(event.target.textContent); 
                });
            });
         }, 0);
        return countryContainerInfo;
    }
     loadMap=()=>{
        const mapFrame = document.querySelector(".country-map");
        const loaderMap =document.querySelector(".map-loader");
        mapFrame.onload = function() {
            loaderMap.style.display = "none";
            mapFrame.style.display = "block";
        }; 

    }

}