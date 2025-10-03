import { patchInfo } from "../../../api/crudApi.js";

export class EditCountry extends HTMLElement {
  constructor() {
    super();
    this.country = null; 
  }

  connectedCallback() {
    this.render();
  }

  set data(country) {
    this.country = country;
    this.render();
  }

  render() {
    if (!this.country) return;

    this.innerHTML = /* html */ `
      <div>
        <h3>Editar Country</h3>
        <form id="formEditCountry">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" value="${this.country.name}" required />
          </div>
          <button type="submit" class="btn btn-success">Guardar cambios</button>
          <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#formEditCountry");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = this.querySelector("#name").value.trim();

      if (!name) {
        alert("El nombre es obligatorio");
        return;
      }

      const resp = await patchInfo("countries", this.country.id, { name });

      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("country-updated"));
      } else {
        alert("Error al actualizar el país");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-edit"));
    });
  }
}

customElements.define("edit-country", EditCountry);
