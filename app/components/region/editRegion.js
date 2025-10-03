import { patchInfo } from "../../../api/crudApi.js";

export class EditRegion extends HTMLElement {
  constructor() {
    super();
    this.region = null;
    this.countries = [];
  }

  set data({ id, name, countryId, countries }) {
    this.region = { id, name, countryId };
    this.countries = countries;
    this.render();
  }

  render() {
    if (!this.region) return;

    this.innerHTML = /* html */ `
      <div>
        <h3>Editar Región</h3>
        <form id="formEditRegion">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" value="${this.region.name}" required />
          </div>
          <div class="mb-3">
            <label for="countryId" class="form-label">País</label>
            <select class="form-control" id="countryId" required>
              ${this.countries
                .map(
                  (c) =>
                    `<option value="${c.id}" ${c.id == this.region.countryId ? "selected" : ""}>${c.name}</option>`
                )
                .join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-success">Guardar cambios</button>
          <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#formEditRegion");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = this.querySelector("#name").value.trim();
      const countryId = this.querySelector("#countryId").value;

      if (!name || !countryId) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const resp = await patchInfo("regions", this.region.id, { name, countryId });
      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("region-updated"));
      } else {
        alert("Error al actualizar región");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-edit"));
    });
  }
}

customElements.define("edit-region", EditRegion);
