export const initialState = {
    isopen: false,
    user: null, /* Creamos en este objeto user con valor null (2:54:25) */
    darkMode: false, /* Variable para cambiar apariencia de la web (Switch) (1:49:20) */
}

export const actionTypes = {
    TOGGLE_MENU: "TOGGLE_MENU",
    SET_USER: "SET_USER", /* Creamos otro tipo de accion o actionType distinta para crear un usuario que haga login */
    SET_DARKMODE: "SET_DARKMODE"
}

const reducer = (state, action) => {

    console.log(action);

    // eslint-disable-next-line default-case
    switch (action.type) {
        case actionTypes.TOGGLE_MENU: /* En caso de que el actionTypes (la acción que hemos despachado) sea TOGGLE_MENU se retorna lo siguiente: */
            return {
                ...state, /* El estado o state tal como estaba */
                isopen: action.isopen, /* Pero se cambia isopen por la acción que hemos despachado */
            }
        
        case actionTypes.SET_USER: 
            return {
                ...state,
                user: action.user,
            }

            default: return state; /* Por defecto (sino "escucha" nada) devuelve state */

         case actionTypes.SET_DARKMODE: 
            return {
                ...state,
                darkMode: action.darkMode,
            }
    };

}; /* Reducer es una función que queda a la escucha, de manera que está "atento" por si en algunos de los componentes o elementos que forma la aplicación se ha alterado el estado inicial de isopen (initialState) 

La función reducer toma dos parámetros, uno de ellos es el estado (state) y otro es la acción (action)*/

export default reducer; /* La función por defecto a exportar de este archivo es reducer, al importarse por defecto no necesitamos las llaves {} cuando las vayamos a importar en otro componente */