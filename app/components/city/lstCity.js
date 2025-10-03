import { getInfo, deleteInfo } from "../../../api/crudApi.js";

export class LstCity extends HTMLElement {
  constructor() {
    super();
    this.cities = [];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.cities = (await getInfo("cities")) || [];
    this.regions = (await getInfo("regions")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Cities</h3>
        <button type="button" class="btn btn-primary" id="btnAddCity">Añadir nueva City</button>
      </div>

      ${
        this.cities.length > 0
          ? `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Region</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.cities
                  .map((c) => {
                    const region = this.regions.find((r) => r.id == c.regionId);
                    return `
                      <tr>
                        <th scope="row">${c.id}</th>
                        <td>${c.name}</td>
                        <td>${region ? region.name : "Sin región"}</td>
                        <td>
                          <button class="btn btn-outline-primary btn-sm btnEdit" data-id="${c.id}">Editar</button>
                          <button class="btn btn-outline-danger btn-sm btnDelete" data-id="${c.id}">Eliminar</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          `
          : `<p class="text-muted">No hay ciudades registradas.</p>`
      }
    `;

    const btnAdd = this.querySelector("#btnAddCity");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this.innerHTML = `<reg-city></reg-city>`;
        const regForm = this.querySelector("reg-city");

        regForm.addEventListener("city-added", () => {
          this.loadData();
        });

        regForm.addEventListener("cancel-city", () => {
          this.render();
        });
      });
    }

    this.querySelectorAll(".btnDelete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("¿Seguro que quieres eliminar esta ciudad? Se eliminarán también las compañías asociadas. Si deseas conservar las compañías, primero cámbiales la ciudad.")) {
          const resp = await deleteInfo("cities", id);
          if (resp.ok) {
            this.loadData();
          } else {
            alert("Error eliminando la ciudad");
          }
        }
      });
    });

    this.querySelectorAll(".btnEdit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const city = this.cities.find((c) => c.id == id);

        this.innerHTML = `<edit-city></edit-city>`;
        const editForm = this.querySelector("edit-city");
        editForm.data = city;

        editForm.addEventListener("city-updated", () => {
          this.loadData();
        });

        editForm.addEventListener("cancel-edit", () => {
          this.render();
        });
      });
    });
  }
}

customElements.define("lst-city", LstCity);
