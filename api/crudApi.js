const URL_API = 'http://localhost:3000';
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

const getInfo = async (category) => {
    try {
        const respuesta = await fetch(`${URL_API}/${category}`);
        if (respuesta.ok) {
            return await respuesta.json();
        } else if (respuesta.status === 401) {
            console.log('La URL no es correcta');
        } else if (respuesta.status === 404) {
            console.log(`El recurso en la categoría "${category}" no existe`);
        } else {
            console.log('Se presentó un error en la petición, consulte al Administrador');
        }
    } catch (error) {
        console.error('Error en GET:', error.message);
    }
};

const postInfo = async (category, datos) => {
    try {
        return await fetch(`${URL_API}/${category}`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en POST:', error.message);
    }
};

const patchInfo = async (category, id, datos) => {
    try {
        return await fetch(`${URL_API}/${category}/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en PATCH:', error.message);
    }
};

const deleteInfo = async (category, id) => {
    try {
        return await fetch(`${URL_API}/${category}/${id}`, {
            method: "DELETE",
            headers: myHeaders
        });
    } catch (error) {
        console.error('Error en DELETE:', error.message);
    }
};

export {
    getInfo,
    postInfo,
    patchInfo,
    deleteInfo
};