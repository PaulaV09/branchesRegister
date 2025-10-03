import { postInfo, getInfo } from "../../../api/crudApi.js";
import RegionModel from "../../../models/regionModel.js";

export class RegRegion extends HTMLElement {
  constructor() {
    super();
    this.countries = [];
    this.loadCountries();
  }

  async loadCountries() {
    this.countries = (await getInfo("countries")) || [];
    this.render();
    this.saveData();
    this.cancelEvent();
    this.disableFrm(false);
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">
          Registro de Región <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataRegion">
            <div class="row">
              <div class="col">
                <label for="name" class="form-label">Nombre de la Región</label>
                <input type="text" class="form-control" id="name" name="name" required>
              </div>
              <div class="col">
                <label for="countryId" class="form-label">País</label>
                <select class="form-control" id="countryId" name="countryId" required>
                  <option value="">Seleccione un país</option>
                  ${this.countries
                    .map((c) => `<option value="${c.id}">${c.name}</option>`)
                    .join("")}
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
      this.dispatchEvent(new CustomEvent("cancel-region", { bubbles: true, composed: true }));
    });
  };

  resetForm = () => {
    const frmRegistro = this.querySelector("#frmDataRegion");
    frmRegistro.reset();
    this.querySelector("#idView").innerHTML = "";
  };

  saveData = () => {
    const frmRegistro = this.querySelector("#frmDataRegion");
    frmRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());

      postInfo("regions", datos)
        .then((response) => {
          if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
          return response.json();
        })
        .then((responseData) => {
          this.viewData(responseData.id);
          this.dispatchEvent(new CustomEvent("region-added", { detail: responseData, bubbles: true, composed: true }));
          this.resetForm();
        })
        .catch((error) => console.error("Error al guardar región:", error.message));
    });
  };

  viewData = (id) => {
    this.querySelector("#idView").innerHTML = id;
  };

  disableFrm = (estado) => {
    const frmRegistro = this.querySelector("#frmDataRegion");
    Object.entries(RegionModel).forEach(([key, value]) => {
      if (frmRegistro.elements[key]) {
        frmRegistro.elements[key].value = value;
        frmRegistro.elements[key].disabled = estado;
      }
    });
  };
}

customElements.define("reg-region", RegRegion);
