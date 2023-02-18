const queryParamOfThePage = new URLSearchParams(window.location.search).get(
  "symbol"
);
const endPointLink = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${queryParamOfThePage}`;
const chartEndPointLink = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${queryParamOfThePage}?serietype=line`;

const infoDiv = document.getElementById("infoDiv");
const companyNameDiv = document.getElementById("companyName");
const companyUrlDiv = document.getElementById("companyUrl");
const companyDescriptionDiv = document.getElementById("companyDescription");
const companyPriceDiv = document.getElementById("companyPrice");
const companyChangeDiv = document.getElementById("companyChanges");
const chartDraw = document.getElementById("myChart").getContext("2d");

const h1 = document.getElementById("h1");
h1.textContent = `Info about ${queryParamOfThePage}`;

fetch(endPointLink)
  .then((response) => response.json())
  .then((data) => {
    let changesNegPoz =
      data.profile.changesPercentage > 0 ? "text-success" : "text-danger";
    companyNameDiv.innerHTML = `<strong>Company Name: </strong>${data.profile.companyName}`;
    companyPriceDiv.innerHTML = `<strong>Price: </strong>${data.profile.price}$`;
    companyChangeDiv.innerHTML = `<strong>Latest Changes: </strong><span class="${changesNegPoz}">${data.profile.changesPercentage}`;
    companyUrlDiv.innerHTML = `<strong>URL: </strong><a href="${data.profile.website}">${data.profile.website}</a>`;
    companyDescriptionDiv.innerHTML = `<strong>Description: </strong>${data.profile.description}`;
    const logoImg = document.createElement("img");
    logoImg.src = `${data.profile.image}`;
    logoImg.alt = "Company Logo";
    logoImg.width = 100;
    logoImg.height = 100;
    logoImg.style.float = "right";
    infoDiv.appendChild(logoImg);
  })
  .catch((error) => console.error(error));

async function loadData() {
  try {
    const response = await fetch(chartEndPointLink);
    const data = await response.json();
    const prices = data.historical.map((d) => d.close);
    const dates = data.historical.map((d) => d.date);
    const chart = new Chart(chartDraw, {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Close",
            data: prices,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderwidth: 0.5,
            borderWidth: 1,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

loadData();

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
