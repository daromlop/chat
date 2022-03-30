import "./Header.css";
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { Avatar, Switch} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from "@mui/material";
import { UseStateValue } from "../Stateprovider";
import { actionTypes } from "../reducer";
import { auth } from "../firebase";
import { db } from "../firebase";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const Header = () => {

    const [{isopen, user, darkMode}, dispatch] = UseStateValue(); /* isopen es una desestructuración de initialState (situado en reducer.js), con esto, todo el componente tiene acceso a la variable isopen y puede cambiar su valor con dispatch (2:19:00)
    
    Esto nos sirve también para consultar en que estado está la variable isopen ya que tenemos que consumirla.*/

    /* Capturamos aquí el objeto user (Parte 2: 17:06) para crear el avatar*/

    const toggleMenu = () => { /* Función que cambia el valor de isopen --> true/false */
        dispatch({ /* Con esta función se vuelve a "inyectar" los datos una vez cambiados, inyectamos un objeto con dos valores */
            type: actionTypes.TOGGLE_MENU, /* Seleccionamos el tipo de datos que se van a cambiar, en este caso usamos TOGGLE_MENU (situado en reducer.js) (TOGGLE_MENU es un tipo de dispatch) */

            /* Importamos actionTypes (ya que es un objeto) en linea 9 */

            isopen: !isopen, /* Aquí indicamos que isopen tenga el valor contrario del que tenga asignado */
        }); 
    };

    /* Con esto se inyecta los datos modificados en la "capa de datos" pero para que esto surta efecto el app tiene que "escuchar" el cambio y para ello hay que usar reducer.js */

    const signout = () => { /* Método que permite salir al usuario, nos retorna una promesa */
        auth.signOut().then((user)=> dispatch({ /* Nos devuelve el usuario y el usuario se devuelve como nulo usando dispatch y reducer lo escucha como nulo o null */
            type: actionTypes.SET_USER,
            user: null,
        })); 
    };


    return (
        <div className={darkMode ? "header dark" : "header blue"}>
            <div className="header__left">
                <div className="logo">
                    <ChatIcon className="logo__icon"/>
                    <h2>CHAT</h2>
                </div>
            </div>
            <div className={!user ? "header__right hideBm" : "header__right"}>
                <IconButton onClick={toggleMenu}> {/* Cuando se haga click se ejecuta la función toggleMenu */}
                    <MenuIcon className="MenuIcon" fontSize="large"/>
                </IconButton>
                <div className={`header__menu ${isopen ? "header__menu--hide" : ""} ${darkMode ? "dark" : "light"}`}>
                    <div className={darkMode ? "header__menuTop dark" : "header__menuTop blue"}>
                        <Button className={darkMode ? "ButtonBackDark" : "ButtonBack"} onClick={toggleMenu} variant="outlined">VOLVER<ArrowForwardIcon className="ArrowIcon"/></Button>
                        <Avatar src={user?.photoURL}/> {/* Avatar de usuario con imagen (Componente Fireb, (user?) esto es un conditional chaining que lo hace es proteger a la app en el cde que user todavía sea null, así evitamos que la app se "rompa" de inicio */}
                        <div className="UserWelcome">
                            <h4>Bienvenido</h4>
                            <h4>{user?.displayName}</h4> {/* conditional chaining */}
                        </div>
                        {user && <Button color="secondary" onClick={signout} variant="contained">Cerrar sesión</Button>} {/* Condicionales en React --> Si user tiene algún valor (si existe) muestra el botón signout sino existe no lo muestra */}
                    </div>
                    <div className="header__menuBottom">
                        <Switch checked={darkMode} onChange={() => {
                            dispatch({
                                type: actionTypes.SET_DARKMODE,
                                darkMode: !darkMode, /* Si darkMode es verdadero se pondra en falso y viceversa (!) */
                            });
                        }}/> {/* Componente de material UI */}

                        {/* Switch tiene una propiedad llamada "checked" en la cual pasaremos la variable darkmode (origen reducer.js) */}
                        <DarkModeOutlinedIcon/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;