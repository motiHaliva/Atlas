import { countryFront } from "./script.js";
import { fetchByCode } from "./script.js";

export class Country {
    constructor(name, population, capital, flag, mapLink, language ,currencies,coordinates,borderCountries) {
      this.name = name;
      this.population = population || "Not available"; 
      this.capital = capital || "Not available";  
      this.flag = flag || "";  
      this.mapLink = mapLink || "#";  
      this.language = language || "Not available";  
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
        const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=6&output=embed`;
        const bordersLinks = this.createBordersLinks();
    
        countryContainerInfo.innerHTML = `
            <div class="country-info">
                <div class="country-header">
                    <img src="${this.flag}" alt="Flag of ${this.name}" class="country-flag" />
                    <h2>${this.name}</h2>
                </div>
                <div class="country-details">
                    <p><strong>Population:</strong> ${this.population}</p>
                    <p><strong>Capital:</strong> ${this.capital}</p>
                    <p><strong>Language:</strong> ${this.language}</p>
                    <p><strong>Currencies:</strong> ${this.currencies}</p>
             <div class="borders-links">
                        <strong>Border Countries:</strong><br>
                        ${bordersLinks}
                    </div>
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
          <button class=back-but" id="mobileBtn">Back to Countries</button>  
        `;

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
                    const cca3 = event.target.getAttribute("data-cca3");
                    fetchByCode(cca3); 
                });
            });
         }, 0);
        return countryContainerInfo;
    }

  }
  