import { getInfo, deleteInfo } from "../../../api/crudApi.js";

export class LstBranch extends HTMLElement {
  constructor() {
    super();
    this.branches = [];
    this.companies = [];
    this.cities = [];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.branches = (await getInfo("branches")) || [];
    this.companies = (await getInfo("companies")) || [];
    this.cities = (await getInfo("cities")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Branches</h3>
        <button type="button" class="btn btn-primary" id="btnAddBranch">Añadir nueva Branch</button>
      </div>

      ${
        this.branches.length > 0
          ? `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Número Comercial</th>
                  <th scope="col">Dirección</th>
                  <th scope="col">Email</th>
                  <th scope="col">Contacto</th>
                  <th scope="col">Teléfono</th>
                  <th scope="col">Compañía</th>
                  <th scope="col">Ciudad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.branches
                  .map((b) => {
                    const company = this.companies.find((c) => c.id == b.companyId);
                    const city = this.cities.find((ct) => ct.id == b.cityId);

                    return `
                      <tr>
                        <th scope="row">${b.id}</th>
                        <td>${b.numberComercial}</td>
                        <td>${b.address}</td>
                        <td>${b.email}</td>
                        <td>${b.contactName}</td>
                        <td>${b.phone}</td>
                        <td>${company ? company.name : "N/A"}</td>
                        <td>${city ? city.name : "N/A"}</td>
                        <td>
                          <button class="btn btn-outline-primary btn-sm btnEdit" data-id="${b.id}">Editar</button>
                          <button class="btn btn-outline-danger btn-sm btnDelete" data-id="${b.id}">Eliminar</button>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          `
          : `<p class="text-muted">No hay sucursales registradas.</p>`
      }
    `;

    const btnAdd = this.querySelector("#btnAddBranch");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this.innerHTML = `<reg-branch></reg-branch>`;
        const regForm = this.querySelector("reg-branch");

        regForm.addEventListener("branch-added", () => {
          this.loadData();
        });

        regForm.addEventListener("cancel-branch", () => {
          this.render();
        });
      });
    }

    this.querySelectorAll(".btnDelete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("¿Seguro que quieres eliminar esta sucursal?")) {
          const resp = await deleteInfo("branches", id);
          if (resp.ok) {
            this.loadData();
          } else {
            alert("Error eliminando la sucursal");
          }
        }
      });
    });

    this.querySelectorAll(".btnEdit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const branch = this.branches.find((b) => b.id == id);

        this.innerHTML = `<edit-branch></edit-branch>`;
        const editForm = this.querySelector("edit-branch");
        editForm.data = { ...branch, companies: this.companies, cities: this.cities };

        editForm.addEventListener("branch-updated", () => {
          this.loadData();
        });

        editForm.addEventListener("cancel-edit", () => {
          this.render();
        });
      });
    });
  }
}

customElements.define("lst-branch", LstBranch);
