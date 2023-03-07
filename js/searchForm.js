let searchBoxValue = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("resultsDiv");
const loaderP = document.getElementById("loading");

showLoader = () => {
  loaderP.style.display = "unset";
};

hideLoader = () => {
  loaderP.style.display = "none";
};
queryAddress = () => {
  window.location.search = `query=${searchBoxValue.value}`;
};
let timeout = 0;

autoSearchDebounce = () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    showLoader();
    await getNameAndSymbol(searchBoxValue.value);
    hideLoader();
  }, 500);
};

bothFunctions = () => {
  autoSearchDebounce();
};

searchButton.addEventListener("click", autoSearchDebounce, queryAddress);
searchBoxValue.addEventListener("keyup", autoSearchDebounce);
