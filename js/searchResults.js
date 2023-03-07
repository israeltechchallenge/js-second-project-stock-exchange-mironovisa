const baseUrl =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3";

function highlightText(text, searchTerm) {
  const regex = new RegExp(searchTerm, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

function getNameAndSymbol(name) {
  let endpoint = `${baseUrl}/search?query=${name}&limit=10&exchange=NASDAQ`;
  resultsDiv.innerHTML = "<h1>.your_search_results:</h1>";
  return fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let promises = [];
      for (let i = 0; i < 10; i++) {
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
            const firstPEl = resultsDiv.querySelectorAll("p")[0];
            if (firstPEl) {
              firstPEl.innerHTML = `Changes Percentage: ${highlightText(
                data.profile.changesPercentage + "%",
                name
              )}`;
              firstPEl.classList.add(changesNegPoz);
              const triangleIcon = document.createElement("span");
              triangleIcon.classList.add("triangle");
              triangleIcon.classList.add(
                data.profile.changesPercentage > 0 ? "positive" : "negative"
              );
              firstPEl.appendChild(triangleIcon);
            }
            const nameEl = resultsDiv.querySelectorAll("div a")[i];
            const nameText = nameEl.textContent;
            nameEl.innerHTML = highlightText(nameText, name);
          })
          .catch((error) => (imgEl.style.display = "none"));
        promises.push(promise);
        resultsDiv.innerHTML += `
        <div>
          <a href="company.html?symbol=${symbol}">
            ${highlightText(data[i].name, name)}, (${highlightText(
          symbol,
          name
        )})
            <img src="" data-symbol="${symbol}" alt="${
          data[i].name
        } icon" width="50" height="50">
          </a><p></p>
          <br>
        </div>
      `;
      }
      return Promise.all(promises);
    })
    .catch((error) => console.log(error));
}
