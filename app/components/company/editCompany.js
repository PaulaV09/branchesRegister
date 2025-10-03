import { patchInfo, getInfo } from "../../../api/crudApi.js";

export class EditCompany extends HTMLElement {
  constructor() {
    super();
    this.company = null;
    this.cities = [];
  }

  async connectedCallback() {
    this.cities = (await getInfo("cities")) || [];
    this.render();
  }

  set data(company) {
    this.company = company;
    this.render();
  }

  render() {
    if (!this.company) return;

    this.innerHTML = /* html */ `
      <div>
        <h3>Editar Company</h3>
        <form id="formEditCompany">
          <div class="row mb-3">
            <div class="col">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" value="${this.company.name}" required />
            </div>
            <div class="col">
              <label for="niu" class="form-label">NIU</label>
              <input type="text" class="form-control" id="niu" value="${this.company.niu}" required />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="address" class="form-label">Dirección</label>
              <input type="text" class="form-control" id="address" value="${this.company.address}" required />
            </div>
            <div class="col">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" value="${this.company.email}" required />
            </div>
          </div>

          <div class="mb-3">
            <label for="cityId" class="form-label">Ciudad</label>
            <select class="form-select" id="cityId" required>
              <option value="">Seleccione una ciudad</option>
              ${this.cities
                .map(
                  (c) =>
                    `<option value="${c.id}" ${c.id == this.company.cityId ? "selected" : ""}>${c.name}</option>`
                )
                .join("")}
            </select>
          </div>

          <button type="submit" class="btn btn-success">Guardar cambios</button>
          <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#formEditCompany");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = this.querySelector("#name").value.trim();
      const niu = this.querySelector("#niu").value.trim();
      const address = this.querySelector("#address").value.trim();
      const email = this.querySelector("#email").value.trim();
      const cityId = this.querySelector("#cityId").value;

      if (!name || !niu || !address || !email || !cityId) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const resp = await patchInfo("companies", this.company.id, { name, niu, address, email, cityId });

      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("company-updated"));
      } else {
        alert("Error al actualizar la compañía");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-edit"));
    });
  }
}

customElements.define("edit-company", EditCompany);
