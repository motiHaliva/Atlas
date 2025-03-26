
import { countryFront } from "./script.js";
export class Country {
    constructor(name, population, capital, flag, mapLink, language ,currencies,coordinates) {
      this.name = name;
      this.population = population || "Not available"; 
      this.capital = capital || "Not available";  
      this.flag = flag || "";  
      this.mapLink = mapLink || "#";  
      this.language = language || "Not available";  
      this.currencies=currencies;
      this.coordinates=coordinates;
    }
  
    renderFront() {
        const button = document.createElement("div");
        button.classList.add("country-button"); 
        button.innerHTML = `
            <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag" />
            <h2>${this.name}</h2>
        `;
        return button;
    }

    renderByInfo() {
        const selected = document.getElementById("selected-country-container");
        const countryContainerInfo = document.createElement("div");
        countryContainerInfo.classList.add("country-container");
        const [lat, lng] = this.coordinates;
        const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=5&output=embed`;
    
        countryContainerInfo.innerHTML = `
            <div class="country-info">
                <div class="country-header">
                    <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag" />
                    <h2>${this.name}</h2>
                </div>
                <div class="country-details">
                    <p><strong>Population:</strong> ${this.population.toLocaleString()}</p>
                    <p><strong>Capital:</strong> ${this.capital}</p>
                    <p><strong>Language:</strong> ${this.language}</p>
                    <p><strong>Currencies:</strong> ${this.currencies}</p>
                    <p><strong>Coordinates:</strong> ${lat.toFixed(2)}, ${lng.toFixed(2)}</p>
                    <p><strong>External Map:</strong> <a href="${this.mapLink}" target="_blank">View on Google Maps</a></p>
                    <button class="back-button">Back to Countries</button>
                </div>
            </div>
            <div class="country-map-container">
                <iframe 
                    src="${mapUrl}" 
                    allowfullscreen>
                </iframe>
             
            </div>
            <div id="back">  </div>
                   
        `;
    
        const backButton = countryContainerInfo.querySelector(".back-button");
        backButton.addEventListener("click", () => {
            selected.innerHTML = ""; 
            countryFront(); 
        });
    
        return countryContainerInfo;
    }
    
    
  }
  