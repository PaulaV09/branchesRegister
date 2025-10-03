import { postInfo, getInfo } from "../../../api/crudApi.js";
import CompanyModel from "../../../models/companyModel.js";

export class RegCompany extends HTMLElement {
  constructor() {
    super();
    this.cities = [];
    this.loadCities();
  }

  async loadCities() {
    this.cities = (await getInfo("cities")) || [];
    this.render();
    this.saveData();
    this.cancelEvent();
    this.disableFrm(false);
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">
          Registro de Company <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataCompany">
            <div class="row">
              <div class="col">
                <label for="name" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="name" name="name" required>
              </div>
              <div class="col">
                <label for="niu" class="form-label">NIU</label>
                <input type="text" class="form-control" id="niu" name="niu" required>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="address" name="address" required>
              </div>
              <div class="col">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col">
                <label for="cityId" class="form-label">Ciudad</label>
                <select class="form-select" id="cityId" name="cityId" required>
                  <option value="">Seleccione una ciudad</option>
                  ${this.cities.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col text-center">
                <button type="submit" class="btn btn-success" id="btnGuardar">Guardar</button>
                <button type="button" class="btn btn-dark" id="btnCancelar">Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  cancelEvent = () => {
    this.querySelector("#btnCancelar").addEventListener("click", (e) => {
      e.preventDefault();
      this.resetForm();
      this.dispatchEvent(new CustomEvent("cancel-company", { bubbles: true, composed: true }));
    });
  };

  resetForm = () => {
    const frmRegistro = this.querySelector("#frmDataCompany");
    frmRegistro.reset();
    this.querySelector("#idView").innerHTML = "";
  };

  saveData = () => {
    const frmRegistro = this.querySelector("#frmDataCompany");
    frmRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());

      postInfo("companies", datos)
        .then((response) => {
          if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
          return response.json();
        })
        .then((responseData) => {
          this.viewData(responseData.id);
          this.dispatchEvent(new CustomEvent("company-added", { detail: responseData, bubbles: true, composed: true }));
          this.resetForm();
        })
        .catch((error) => console.error("Error al guardar company:", error.message));
    });
  };

  viewData = (id) => {
    this.querySelector("#idView").innerHTML = id;
  };

  disableFrm = (estado) => {
    const frmRegistro = this.querySelector("#frmDataCompany");
    Object.entries(CompanyModel).forEach(([key, value]) => {
      if (frmRegistro.elements[key]) {
        frmRegistro.elements[key].value = value;
        frmRegistro.elements[key].disabled = estado;
      }
    });
  };
}

customElements.define("reg-company", RegCompany);
