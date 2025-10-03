import { patchInfo } from "../../../api/crudApi.js";

export class EditBranch extends HTMLElement {
  constructor() {
    super();
    this.branch = null;
    this.companies = [];
    this.cities = [];
  }

  set data(data) {
    this.branch = data;
    this.companies = data.companies || [];
    this.cities = data.cities || [];
    this.render();
  }

  render() {
    if (!this.branch) return;

    this.innerHTML = /* html */ `
      <div>
        <h3>Editar Branch</h3>
        <form id="formEditBranch">
          <div class="row">
            <div class="col">
              <label class="form-label">Número Comercial</label>
              <input type="text" class="form-control" name="numberComercial" value="${this.branch.numberComercial}" required />
            </div>
            <div class="col">
              <label class="form-label">Dirección</label>
              <input type="text" class="form-control" name="address" value="${this.branch.address}" required />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" value="${this.branch.email}" required />
            </div>
            <div class="col">
              <label class="form-label">Nombre de Contacto</label>
              <input type="text" class="form-control" name="contactName" value="${this.branch.contactName}" required />
            </div>
            <div class="col">
              <label class="form-label">Teléfono</label>
              <input type="text" class="form-control" name="phone" value="${this.branch.phone}" required />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <label class="form-label">Compañía</label>
              <select class="form-select" name="companyId" required>
                <option value="">Seleccione una compañía</option>
                ${this.companies.map((c) => `<option value="${c.id}" ${c.id == this.branch.companyId ? "selected" : ""}>${c.name}</option>`).join("")}
              </select>
            </div>
            <div class="col">
              <label class="form-label">Ciudad</label>
              <select class="form-select" name="cityId" required>
                <option value="">Seleccione una ciudad</option>
                ${this.cities.map((ct) => `<option value="${ct.id}" ${ct.id == this.branch.cityId ? "selected" : ""}>${ct.name}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="row mt-3 text-center">
            <div class="col">
              <button type="submit" class="btn btn-success">Guardar cambios</button>
              <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    `;

    const form = this.querySelector("#formEditBranch");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(form).entries());

      const resp = await patchInfo("branches", this.branch.id, datos);

      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("branch-updated"));
      } else {
        alert("Error al actualizar la sucursal");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-edit"));
    });
  }
}

customElements.define("edit-branch", EditBranch);
