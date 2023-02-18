let searchBoxValue = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("resultsDiv");
const loaderP = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", function (event) {
  document.querySelectorAll("img").forEach(function (img) {
    img.onerror = function () {
      this.style.display = "none";
    };
  });
});

showLoader = () => {
  loaderP.style.display = "unset";
};

hideloader = () => {
  loaderP.style.display = "none";
};
queryAdress = () => {
  window.location.search = `query=${searchBoxValue.value}`;
};
let timeout = 0;

function getNameAndSymbol(name) {
  let endpoint =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
    name +
    "&limit=10&exchange=NASDAQ";
  resultsDiv.innerHTML = "<h1>.your_search_results:</h1>";
  return fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let promises = [];
      for (let i = 0; i < 10; i++) {
        let clearedsymbol;
        let symbol = data[i].symbol;
        let imageUrl = "";
        let promise = fetch(
          `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${data[i].symbol}`
        )
          .then((response) => response.json())
          .then((data) => {
            let changesNegPoz =
              data.profile.changesPercentage > 0
                ? "text-success"
                : "text-danger";
            const pEls = resultsDiv.querySelectorAll("div p");
            pEls[i].textContent = `Change: ${data.profile.changesPercentage}%`;
            pEls[i].classList.add(changesNegPoz);
            if (data.profile.changesPercentage > 0) {
              pEls[i].innerHTML += ` <span style="color:green">&#9650;</span>`;
            } else if (data.profile.changesPercentage < 0) {
              pEls[i].innerHTML += ` <span style="color:red">&#9660;</span>`;
            }
            imageUrl = data.profile.image;

            const imgEl = resultsDiv.querySelector(
              `img[data-symbol="${symbol}"]`
            );
            if (imgEl) {
              if (imageUrl) {
                imgEl.src = imageUrl;
              } else {
                return;
              }
            }
            const firstPEl = resultsDiv.querySelectorAll("p");
            if (firstPEl) {
              firstPEl.textContent = `Changes Percentage: ${data.profile.changesPercentage}%`;
              firstPEl.classList.add(changesNegPoz);
              const triangleIcon = document.createElement("span");
              triangleIcon.classList.add("triangle");
              triangleIcon.classList.add(
                data.profile.changesPercentage > 0 ? "positive" : "negative"
              );
              firstPEl.appendChild(triangleIcon);
            }
          })
          .catch((error) => (imgEl.style.display = "none")); //how to bring it to work );
        promises.push(promise);
        resultsDiv.innerHTML += `
        <div>
          <a href="company.html?symbol=${symbol}">
            ${data[i].name}, (${symbol})
            <img src="" data-symbol="${symbol}" alt="${data[i].name} icon" width="50" height="50">
          </a><p></p>
          <br>
        </div>
      `;
      }
      return Promise.all(promises);
    })
    .catch((error) => console.log(error));
}

endpointFunction = () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    showLoader();
    await getNameAndSymbol(searchBoxValue.value);
    hideloader();
  }, 500);
};

bothFunctions = () => {
  endpointFunction();
};

searchButton.addEventListener("click", endpointFunction, queryAdress);
searchBoxValue.addEventListener("keyup", endpointFunction);

const tickerList = document.querySelector(".ticker-list");
function MarqueeList() {
  const tickerEndpoint =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse?exchange=NASDAQ";
  fetch(tickerEndpoint)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const changesNegPoz =
          item.changesPercentage > 0 ? "text-success" : "text-danger";
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <span class="ticker-item">${item.symbol}: <span class="ticker-item-price ${changesNegPoz}">${item.price}</span> (${item.changesPercentage}%)</span>
          
        `;
        tickerList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching ticker data:", error);
    });
}

MarqueeList();
