import { postInfo, getInfo } from "../../../api/crudApi.js";
import BranchModel from "../../../models/branchModel.js";

export class RegBranch extends HTMLElement {
  constructor() {
    super();
    this.companies = [];
    this.cities = [];
    this.loadOptions();
  }

  async loadOptions() {
    this.companies = (await getInfo("companies")) || [];
    this.cities = (await getInfo("cities")) || [];
    this.render();
    this.saveData();
    this.cancelEvent();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">
          Registro de Branch <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataBranch">
            <div class="row">
              <div class="col">
                <label class="form-label">Número Comercial</label>
                <input type="text" class="form-control" name="numberComercial" required />
              </div>
              <div class="col">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-control" name="address" required />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="email" required />
              </div>
              <div class="col">
                <label class="form-label">Nombre de Contacto</label>
                <input type="text" class="form-control" name="contactName" required />
              </div>
              <div class="col">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" name="phone" required />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col">
                <label class="form-label">Compañía</label>
                <select class="form-select" name="companyId" required>
                  <option value="">Seleccione una compañía</option>
                  ${this.companies.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
                </select>
              </div>
              <div class="col">
                <label class="form-label">Ciudad</label>
                <select class="form-select" name="cityId" required>
                  <option value="">Seleccione una ciudad</option>
                  ${this.cities.map((ct) => `<option value="${ct.id}">${ct.name}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="row mt-3 text-center">
              <div class="col">
                <button type="submit" class="btn btn-success">Guardar</button>
                <button type="button" class="btn btn-dark" id="btnCancelar">Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  cancelEvent = () => {
    this.querySelector("#btnCancelar").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-branch", { bubbles: true, composed: true }));
    });
  };

  saveData = () => {
    const form = this.querySelector("#frmDataBranch");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(form).entries());

      postInfo("branches", datos)
        .then((response) => {
          if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
          return response.json();
        })
        .then((responseData) => {
          this.dispatchEvent(new CustomEvent("branch-added", { detail: responseData, bubbles: true, composed: true }));
          form.reset();
        })
        .catch((error) => console.error("Error al guardar branch:", error.message));
    });
  };
}

customElements.define("reg-branch", RegBranch);
