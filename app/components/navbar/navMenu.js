import { getInfo } from "../../../api/crudApi.js";

export class NavMenu extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  async connectedCallback() {
    await this.checkDependencies();
  }

  render() {
    this.innerHTML = /* html */ `
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">CRUD App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
            aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarMenu">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" href="#" data-category="countries">Countries</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" data-category="regions">Regions</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" data-category="cities">Cities</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" data-category="companies">Companies</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" data-category="branches">Branches</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    this.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        if (!e.target.classList.contains("disabled")) {
          let mainContent = document.querySelector("#mainContent");
          if (category === "countries") {
            mainContent.innerHTML = `<lst-country></lst-country>`;
          } else if (category === "regions") {
            mainContent.innerHTML = `<lst-region></lst-region>`;
          } else if (category === "cities") {
            mainContent.innerHTML = `<lst-city></lst-city>`;
          } else if (category === "companies") {
            mainContent.innerHTML = `<lst-company></lst-company>`;
          } else if (category === "branches") {
            mainContent.innerHTML = `<lst-branch></lst-branch>`;
          }
        }
      });
    });
  }

  async checkDependencies() {
    const countries = (await getInfo("countries")) || [];
    const regions = (await getInfo("regions")) || [];
    const cities = (await getInfo("cities")) || [];
    const companies = (await getInfo("companies")) || [];
    const branches = (await getInfo("branches")) || [];

    if (countries.length > 0) {
      this.enableLink("regions");
    }
    if (countries.length > 0 && regions.length > 0) {
      this.enableLink("cities");
    }
    if (countries.length > 0 && regions.length > 0 && cities.length > 0) {
      this.enableLink("companies");
    }
    if (
      countries.length > 0 &&
      regions.length > 0 &&
      cities.length > 0 &&
      companies.length > 0
    ) {
      this.enableLink("branches");
    }
  }

  enableLink(category) {
    const link = this.querySelector(`a[data-category="${category}"]`);
    if (link) {
      link.classList.remove("disabled");
    }
  }
}

customElements.define("nav-menu", NavMenu);
