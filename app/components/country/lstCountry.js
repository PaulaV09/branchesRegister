import { getInfo } from "../../../api/crudApi.js";
import { deleteInfo } from "../../../api/crudApi.js";
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
                        <button class="btn btn-outline-primary btn-sm btnEdit" data-id="${c.id}">Editar</button>
                        <button class="btn btn-outline-danger btn-sm btnDelete" data-id="${c.id}">Eliminar</button>
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

    const btnAdd = this.querySelector("#btnAddCountry");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        this.innerHTML = `<reg-country></reg-country>`;

        const regForm = this.querySelector("reg-country");

        regForm.addEventListener("country-added", (e) => {
          this.loadData();
        });

        regForm.addEventListener("cancel-country", () => {
          this.render();
        });
      });
    }

    this.querySelectorAll(".btnDelete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        if (confirm("¿Seguro que quieres eliminar este país? Se eliminarán también las regiones asociadas. Si deseas conservar las regiones, primero cámbiales el país.")) {
          const resp = await deleteInfo("countries", id);
          if (resp.ok) {
            this.loadData();
          } else {
            alert("Error eliminando el país");
          }
        }
      });
    });

    this.querySelectorAll(".btnEdit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const country = this.countries.find((c) => c.id == id);

        this.innerHTML = `<edit-country></edit-country>`;
        const editForm = this.querySelector("edit-country");
        editForm.data = country;

        editForm.addEventListener("country-updated", () => {
          this.loadData(); 
        });

        editForm.addEventListener("cancel-edit", () => {
          this.render(); 
        });
      });
    });
  }
}

customElements.define("lst-country", LstCountry);
