import { postInfo, getInfo } from '../../../api/crudApi.js';
import CityModel from '../../../models/cityModel.js';

export class RegCity extends HTMLElement {
  constructor() {
    super();
    this.regions = [];
    this.loadRegions();
  }

  async loadRegions() {
    this.regions = (await getInfo("regions")) || [];
    this.render();
    this.saveData();
    this.cancelEvent();
  }

  render() {
    this.innerHTML = /* html */ `
      <div class="card mt-3">
        <div class="card-header">
          Registro de City <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataCity">
            <div class="row">
              <div class="col">
                <label for="name" class="form-label">Nombre de la City</label>
                <input type="text" class="form-control" id="name" name="name" required>
              </div>
              <div class="col">
                <label for="regionId" class="form-label">Región</label>
                <select class="form-select" id="regionId" name="regionId" required>
                  <option value="">Seleccione una región</option>
                  ${this.regions.map(r => `<option value="${r.id}">${r.name}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col text-center">
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
    this.querySelector('#btnCancelar').addEventListener('click', (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('cancel-city', { bubbles: true, composed: true }));
    });
  };

  saveData = () => {
    const frmRegistro = this.querySelector('#frmDataCity');
    frmRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());

      postInfo("cities", datos)
        .then((response) => {
          if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
          return response.json();
        })
        .then((responseData) => {
          this.dispatchEvent(new CustomEvent('city-added', { detail: responseData, bubbles: true, composed: true }));
          frmRegistro.reset();
        })
        .catch((error) => console.error('Error al guardar city:', error.message));
    });
  };
}

customElements.define('reg-city', RegCity);
