import {createContext, useReducer, useContext} from "react"; /* Hooks de React */

export const StateContext = createContext(); /* Inicializamos la "manguera de datos" (2:08:30), usamos createContext y useContext para crear esta "manguera o capa de datos" */

export const StateProvider = ({reducer, initialState, children}) => { /* Este stateProvider está conectado directamente con Index.js, que es donde estamos renderizando todo el App, StateProvider se encarga de darle la "capa de datos" o "manguera de datos" a todo el App*//* Los parámetros que recibe StateProvider son reducer, initialState (Estado inicial) y children (todo el app, componentes etc.) */
    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    )
};

export const UseStateValue = () => useContext(StateContext); /* Usamos el hook useContext (pasando como parámetro el StateContext). Esto permite usar o consumir el dato enviado en cualquiera de los componentes. En este caso, useStateValue nos va a dar la variable isOpen (que va a ser true o false) y también nos va a dar la función dispatch que nos va a permitir "inyectar" cualquier variación. (Mirar Header.js linea 13*/ 

