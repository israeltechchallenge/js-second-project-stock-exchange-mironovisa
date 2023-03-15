let searchBoxValue = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("resultsDiv");
showLoader = () => {
  document.getElementById("loading").style.display = "unset";
};
hideloader = () => {
  document.getElementById("loading").style.display = "none";
};
endpointFunction = () => {
  showLoader();
  let endpoint =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
    searchBoxValue.value +
    "&amp;limit=10&amp;exchange=NASDAQ";
  async function getNameAndSymbol() {
    await fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.length);
        resultsDiv.innerHTML = "";
        for (let i = 0; i < 10; i++) {
          resultsDiv.innerHTML += `<a href = "/company.html?symbol=${data[i].symbol}">${data[i].name}, (${data[i].symbol})</a><hr><br>`;
        }
      })
      .catch((error) => console.log("error"));
  }
  hideloader();
  getNameAndSymbol();
};

searchButton.addEventListener("click", endpointFunction);

/*Questions!
1. Why isn't searchButton.addEventListener working while being in the beginning of the page?
2. How can I make endpointFunction more lovely, what can I get rid of?
3. How to work with showLoader and hideloader functions in a better way?


*/
