import { getInfo, deleteInfo } from "../../../api/crudApi.js";

export class LstRegion extends HTMLElement {
  constructor() {
    super();
    this.regions = [];
    this.countries = [];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.regions = (await getInfo("regions")) || [];
    this.countries = (await getInfo("countries")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Regions</h3>
        <button type="button" class="btn btn-primary" id="btnAddRegion">Añadir nueva Region</button>
      </div>

      ${
        this.regions.length > 0
          ? `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Country</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.regions
                  .map((r) => {
                    const country = this.countries.find((c) => c.id == r.countryId);
                    return `
                      <tr>
                        <th scope="row">${r.id}</th>
                        <td>${r.name}</td>
                        <td>${country ? country.name : "N/A"}</td>
                        <td>
                          <button class="btn btn-outline-primary btn-sm btnEdit" data-id="${r.id}">Editar</button>
                          <button class="btn btn-outline-danger btn-sm btnDelete" data-id="${r.id}">Eliminar</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          `
          : `<p class="text-muted">No hay regiones registradas.</p>`
      }
    `;

    // Evento Añadir
    const btnAdd = this.querySelector("#btnAddRegion");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this.innerHTML = `<reg-region></reg-region>`;
        const regForm = this.querySelector("reg-region");

        regForm.addEventListener("region-added", () => {
          this.loadData();
        });

        regForm.addEventListener("cancel-region", () => {
          this.render();
        });
      });
    }

    this.querySelectorAll(".btnDelete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("¿Seguro que quieres eliminar esta región? Se eliminarán también las ciudades asociadas. Si deseas conservar las ciudades, primero cámbiales la región.")) {
          const resp = await deleteInfo("regions", id);
          if (resp.ok) {
            this.loadData();
          } else {
            alert("Error eliminando la región");
          }
        }
      });
    });

    this.querySelectorAll(".btnEdit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const region = this.regions.find((r) => r.id == id);

        this.innerHTML = `<edit-region></edit-region>`;
        const editForm = this.querySelector("edit-region");
        editForm.data = { ...region, countries: this.countries };

        editForm.addEventListener("region-updated", () => {
          this.loadData();
        });

        editForm.addEventListener("cancel-edit", () => {
          this.render();
        });
      });
    });
  }
}

customElements.define("lst-region", LstRegion);
