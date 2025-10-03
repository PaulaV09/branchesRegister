import { patchInfo, getInfo } from "../../../api/crudApi.js";

export class EditCity extends HTMLElement {
  constructor() {
    super();
    this.city = null;
    this.regions = [];
  }

  async connectedCallback() {
    this.regions = (await getInfo("regions")) || [];
    this.render();
  }

  set data(city) {
    this.city = city;
    this.render();
  }

  render() {
    if (!this.city) return;

    this.innerHTML = /* html */ `
      <div>
        <h3>Editar City</h3>
        <form id="formEditCity">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" value="${this.city.name}" required />
          </div>
          <div class="mb-3">
            <label for="regionId" class="form-label">Región</label>
            <select class="form-select" id="regionId" required>
              <option value="">Seleccione una región</option>
              ${this.regions.map(r => `
                <option value="${r.id}" ${r.id == this.city.regionId ? "selected" : ""}>${r.name}</option>
              `).join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-success">Guardar cambios</button>
          <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#formEditCity");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = this.querySelector("#name").value.trim();
      const regionId = this.querySelector("#regionId").value;

      if (!name || !regionId) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const resp = await patchInfo("cities", this.city.id, { name, regionId });

      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("city-updated"));
      } else {
        alert("Error al actualizar la ciudad");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-edit"));
    });
  }
}

customElements.define("edit-city", EditCity);
