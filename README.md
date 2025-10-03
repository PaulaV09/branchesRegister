# 🌐 Sistema de Gestión con CRUD (Países, Regiones, Ciudades, Compañías y Sucursales)

Este proyecto es una aplicación web desarrollada en **JavaScript nativo con Web Components**, que permite gestionar diferentes entidades como Países, Regiones, Ciudades, Compañías y Sucursales. Se implementa un **CRUD** completo (Crear, Leer, Actualizar, Eliminar) para cada entidad, con interacciones dinámicas y listas desplegables dependientes entre ellas.

------

## 📂 Estructura del Proyecto

```
.
├── api
│   └── crudApi.js      # Funciones genéricas para el CRUD con fetch
|
├── app
│ └── components        # Componentes Web para cada módulo
│     ├── branch
│     │   ├── editBranch.js     # Editar sucursales
│     │   ├── lstBranch.js      # Listar sucursales
│     │   └── regBranch.js      # Registrar sucursales
│     │
│     ├── city
│     │   ├── editCity.js       # Editar ciudades
│     │   ├── lstCity.js        # Listar ciudades
│     │   └── regCity.js        # Registrar ciudades
│     │
│     ├── company   
│     │   ├── editCompany.js       # Editar compañías
│     │   ├── lstCompany.js        # Listar compañías
│     │   └── regCompany.js        # Registrar compañías
│     │
│     ├── country
│     │   ├── editCountry.js    # Editar países
│     │   ├── lstCountry.js     # Listar países
│     │   └── regCountry.js     # Registrar países
│     │
│     ├── navbar
│     │   └── navMenu.js        # Menú de navegación
│     │
│     └── region
│         ├── editRegion.js     # Editar regiones
│         ├── lstRegion.js      # Listar regiones
│         └── regRegion.js      # Registrar regiones
│
├── css/bootstrap             # Archivos de estilos Bootstrap
│   └── db.json               # Base de datos para JSON Server (prueba)
|
├── js/bootstrap              # Librerías JS de Bootstrap
|
├── models                    # Modelos de datos por entidad
│   ├── branchModel.js
│   ├── cityModel.js
│   ├── companyModel.js
│   ├── countryModel.js
│   └── regionModel.js
│
├── src
│   ├── app.js                # Punto de entrada principal de la app
|
├── index.html                # Interfaz principal de la aplicación
│
└── README.md                 # Documentación del proyecto
```

------

## ⚙️ Tecnologías Utilizadas

- **JavaScript (ES6+)**
- **Web Components**
- **Bootstrap 5** (estilos y maquetación)
- **JSON Server** (para simular una API REST con persistencia en `db.json`)
- **Fetch API** (para las peticiones HTTP)

------

## 🚀 Instalación y Configuración

1. **Clona este repositorio:**

   Bash

   ```
   git clone https://github.com/PaulaV09/branchesRegister
   ```

2. **Instala JSON Server** (si no lo tienes):

   Bash

   ```
   npm install -g json-server
   ```

3. **Inicia el servidor JSON** en la carpeta raíz:

   Bash

   ```
   json-server --watch db/db.json --port 3000
   ```

   Esto levantará la API REST en `http://localhost:3000`.

4. **Abre el archivo `src/index.html`** en tu navegador.

------

## 📌 Funcionalidades

✅ **CRUD completo** para cada entidad:

- Países (Countries)
- Regiones (Regions)
- Ciudades (Cities)
- Compañías (Companies)
- Sucursales (Branches)

✅ Uso de **listas desplegables dinámicas**:

- Las regiones dependen de los países registrados.
- Las ciudades dependen de las regiones.
- Las sucursales se asignan a una compañía y una ciudad.

✅ Confirmación al eliminar (con alertas). 

✅ Formularios dinámicos de registro y edición. 

✅ Interfaz construida con **Bootstrap 5**.

------

## 🗄️ Modelos de Datos

### Country

```JavaScript
const CountryModel = {
  id: '',
  name: ''
}
```

### Region

```javascript
const RegionModel = {
  id: '',
  name: '',
  countryId: ''
}
```

### City

```javascript
const CityModel = {
  id: '',
  name: '',
  regionId: ''
}
```

### Company

```javascript
const CompanyModel = {
  id: '',
  name: '',
  nit: '',
  address: '',
  phone: ''
}
```

### Branch

```javascript
const BranchModel = {
  id:'',
  numberComercial:'',
  address:'',
  email:'',
  contactName:'',
  phone:'',
  companyId:'',
  cityId:''
}
```

------

## 👩‍💻 Autor

Desarrollado por **Paula Andrea Viviescas Jaimes**

*Proyecto académico de práctica con JSON Server + Web Components*