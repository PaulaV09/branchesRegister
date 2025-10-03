import { getInfo, deleteInfo } from "../../../api/crudApi.js";

export class LstCompany extends HTMLElement {
  constructor() {
    super();
    this.companies = [];
    this.cities = [];
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    this.companies = (await getInfo("companies")) || [];
    this.cities = (await getInfo("cities")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Companies</h3>
        <button type="button" class="btn btn-primary" id="btnAddCompany">Añadir nueva Company</button>
      </div>

      ${
        this.companies.length > 0
          ? `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>NIU</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.companies
                  .map((c) => {
                    const city = this.cities.find((ct) => ct.id == c.cityId);
                    return `
                      <tr>
                        <td>${c.id}</td>
                        <td>${c.name}</td>
                        <td>${c.niu}</td>
                        <td>${c.address}</td>
                        <td>${c.email}</td>
                        <td>${city ? city.name : "Sin ciudad"}</td>
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
          : `<p class="text-muted">No hay compañías registradas.</p>`
      }
    `;

    const btnAdd = this.querySelector("#btnAddCompany");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this.innerHTML = `<reg-company></reg-company>`;
        const regForm = this.querySelector("reg-company");

        regForm.addEventListener("company-added", () => {
          this.loadData();
        });

        regForm.addEventListener("cancel-company", () => {
          this.render();
        });
      });
    }

    this.querySelectorAll(".btnDelete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("¿Seguro que quieres eliminar esta compañía? Se eliminarán también las marcas asociadas. Si deseas conservar las marcas, primero cámbiales la compañía.")) {
          const resp = await deleteInfo("companies", id);
          if (resp.ok) {
            this.loadData();
          } else {
            alert("Error eliminando la compañía");
          }
        }
      });
    });

    this.querySelectorAll(".btnEdit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const company = this.companies.find((c) => c.id == id);

        this.innerHTML = `<edit-company></edit-company>`;
        const editForm = this.querySelector("edit-company");
        editForm.data = company;

        editForm.addEventListener("company-updated", () => {
          this.loadData();
        });

        editForm.addEventListener("cancel-edit", () => {
          this.render();
        });
      });
    });
  }
}

customElements.define("lst-company", LstCompany);
