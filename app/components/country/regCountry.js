import { postInfo } from '../../../api/crudApi.js';
import CountryModel from '../../../models/countryModel.js';

export class RegCountry extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.saveData();
    this.cancelEvent();
    this.disableFrm(false); 
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/country/countryStyle.css";
      </style>
      <div class="card mt-3">
        <div class="card-header">
          Registro de Country <span class="badge rounded-pill text-bg-primary" id="idView"></span>
        </div>
        <div class="card-body">
          <form id="frmDataCountry">
            <div class="row">
              <div class="col">
                <label for="name" class="form-label">Nombre del Country</label>
                <input type="text" class="form-control" id="name" name="name" required>
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
    this.querySelector('#btnCancelar').addEventListener('click', (e) => {
      e.preventDefault();
      this.resetForm();
      this.dispatchEvent(new CustomEvent('cancel-country', { bubbles: true, composed: true }));
    });
  };

  resetForm = () => {
    const frmRegistro = this.querySelector('#frmDataCountry');
    frmRegistro.reset();
    this.querySelector('#idView').innerHTML = '';
  };

  saveData = () => {
    const frmRegistro = this.querySelector('#frmDataCountry');
    frmRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = Object.fromEntries(new FormData(frmRegistro).entries());

      postInfo("countries", datos)
        .then((response) => {
          if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
          return response.json();
        })
        .then((responseData) => {
          this.viewData(responseData.id);
          this.dispatchEvent(new CustomEvent('country-added', { detail: responseData, bubbles: true, composed: true }));
          this.resetForm();
        })
        .catch((error) => console.error('Error al guardar country:', error.message));
    });
  };

  viewData = (id) => {
    this.querySelector('#idView').innerHTML = id;
  };

  disableFrm = (estado) => {
    const frmRegistro = this.querySelector('#frmDataCountry');
    Object.entries(CountryModel).forEach(([key, value]) => {
      if (frmRegistro.elements[key]) {
        frmRegistro.elements[key].value = value;
        frmRegistro.elements[key].disabled = estado;
      }
    });
  };
}

customElements.define('reg-country', RegCountry);
