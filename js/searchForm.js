class SearchForm {
  constructor(searchBox, searchButton, loader) {
    this.searchBox = searchBox;
    this.searchButton = searchButton;
    this.loader = loader;
    this.timeout = 0;

    this.searchButton.addEventListener("click", () => {
      this.autoSearchDebounce();
      this.queryAddress();
    });
    this.searchBox.addEventListener("keyup", () => this.autoSearchDebounce());
  }

  showLoader() {
    this.loader.style.display = "unset";
  }

  hideLoader() {
    this.loader.style.display = "none";
  }

  queryAddress() {
    window.location.search = `query=${this.searchBox.value}`;
  }

  autoSearchDebounce() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      this.showLoader();
      await searchResults.getNameAndSymbol(this.searchBox.value);
      this.hideLoader();
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  const searchButton = document.getElementById("searchButton");
  const loader = document.getElementById("loading");

  new SearchForm(searchBox, searchButton, loader);
});
