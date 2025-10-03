import { getInfo } from "../../../api/crudApi.js";

export class LstCountry extends HTMLElement {
  constructor() {
    super();
    this.countries = [];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.countries = (await getInfo("countries")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/country/countryStyle.css";
      </style>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Countries</h3>
        <button type="button" class="btn btn-primary" id="btnAddCountry">Añadir nuevo Country</button>
      </div>

      ${
        this.countries.length > 0
          ? `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.countries
                  .map(
                    (c) => `
                    <tr>
                      <th scope="row">${c.id}</th>
                      <td>${c.name}</td>
                      <td>
                        <button class="btn btn-outline-primary btn-sm">Editar</button>
                        <button class="btn btn-outline-danger btn-sm">Eliminar</button>
                      </td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          `
          : `<p class="text-muted">No hay países registrados.</p>`
      }
    `;

    // Evento para el botón de añadir
    const btnAdd = this.querySelector("#btnAddCountry");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        alert("Aquí abriremos el formulario para añadir un nuevo país");
        // 👆 Más adelante lo conectamos al form real
      });
    }
  }
}

customElements.define("lst-country", LstCountry);
