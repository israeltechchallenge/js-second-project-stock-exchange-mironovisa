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
