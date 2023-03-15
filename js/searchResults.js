class SearchResults {
  constructor(resultsDiv, baseUrl) {
    this.resultsDiv = resultsDiv;
    this.baseUrl = baseUrl;
  }

  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  async getNameAndSymbol(name) {
    let endpoint = `${this.baseUrl}/search?query=${name}&limit=10&exchange=NASDAQ`;
    this.resultsDiv.innerHTML = "<h1>.your_search_results:</h1>";
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      let promises = [];
      for (let i = 0; i < 10; i++) {
        let symbol = data[i].symbol;
        let highlightedName = this.highlightText(data[i].name, name);
        let highlightedSymbol = this.highlightText(symbol, name);
        promises.push(this.fetchSymbolData(symbol, i));
        this.resultsDiv.innerHTML += `
          <div>
            <a href="company.html?symbol=${symbol}">
              ${highlightedName}, (${highlightedSymbol})
              <img src="" data-symbol="${symbol}" alt="${data[i].name} icon" width="50" height="50">
            </a><p></p>
            <br>
          </div>
        `;
      }
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchSymbolData(symbol, index) {
    try {
      const response = await fetch(`${this.baseUrl}/company/profile/${symbol}`);
      const data = await response.json();
      let changesNegPoz =
        data.profile.changesPercentage > 0 ? "text-success" : "text-danger";
      const pEls = this.resultsDiv.querySelectorAll("div p");
      pEls[index].textContent = `Change: ${data.profile.changesPercentage}%`;
      pEls[index].classList.add(changesNegPoz);
      if (data.profile.changesPercentage > 0) {
        pEls[index].innerHTML += ` <span style="color:green">&#9650;</span>`;
      } else if (data.profile.changesPercentage < 0) {
        pEls[index].innerHTML += ` <span style="color:red">&#9660;</span>`;
      }
      const imgEl = this.resultsDiv.querySelector(
        `img[data-symbol="${symbol}"]`
      );
      if (imgEl) {
        imgEl.src = data.profile.image;
      }
    } catch (error) {
      const imgEl = this.resultsDiv.querySelector(
        `img[data-symbol="${symbol}"]`
      );
      imgEl.style.display = "none";
    }
  }
}

const searchResults = new SearchResults(
  document.getElementById("resultsDiv"),
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3"
);

document.addEventListener("DOMContentLoaded", function (event) {
  document.querySelectorAll("img").forEach(function (img) {
    img.onerror = function () {
      this.style.display = "none";
    };
  });
});
