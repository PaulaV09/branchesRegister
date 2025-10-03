import { postInfo, getInfo } from "../../../api/crudApi.js";

export class RegRegion extends HTMLElement {
  constructor() {
    super();
    this.countries = [];
  }

  async connectedCallback() {
    this.countries = (await getInfo("countries")) || [];
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <div>
        <h3>Registrar Región</h3>
        <form id="formRegRegion">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" required />
          </div>
          <div class="mb-3">
            <label for="countryId" class="form-label">País</label>
            <select class="form-control" id="countryId" required>
              <option value="">Seleccione un país</option>
              ${this.countries.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-success">Guardar</button>
          <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
        </form>
      </div>
    `;

    const form = this.querySelector("#formRegRegion");
    const btnCancel = this.querySelector("#btnCancel");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = this.querySelector("#name").value.trim();
      const countryId = this.querySelector("#countryId").value;

      if (!name || !countryId) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const resp = await postInfo("regions", { name, countryId });
      if (resp.ok) {
        this.dispatchEvent(new CustomEvent("region-added"));
      } else {
        alert("Error al guardar región");
      }
    });

    btnCancel.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("cancel-region"));
    });
  }
}

customElements.define("reg-region", RegRegion);
