import './App.css';
import Login from './components/Login';
import Header from './components/Header'
import Main from './components/Main';
import {UseStateValue} from "./Stateprovider" /* StateValue nos permite consumir o usar el estado de la variable */
import { useEffect } from 'react';
import { auth } from './firebase';
import { actionTypes } from './reducer';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {

    const [{isopen, user, darkMode}, dispatch] = UseStateValue();

    /* Para el login, introducimos otra variable (user) que tendrá el valor null al iniciar la App (2:52:50), cuando el usuario haga click en "Entrar cuenta de google" si el usuario es correcto se creará un usuario, habrá que usar dispatch para decirle a la App que ahora user es Verdadero o True, si es verdadero mostrará la app completa si es falso volverá al Login */

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user) { /* Si existe el usuario haz esto: */
               dispatch({ /* Se hace dispatch dentro de la manguera de datos y se busca al objeto que tenga: */
                type: actionTypes.SET_USER, 
                user: user, /* El usuario que hemos obtenido previamente */
               }) 
            }    
        }); /* Cada vez que cambia el usuario ejecuta lo que hay dentro */
        console.log(user);
    },[]); 
    
    /* UseEffect es uno de los hook más comunes, admite dos parámetros, una función flecha y un array. Esta función flecha se ejecuta cada vez que se refresque o se vuelva a renderizar el componente (solo si no hay ningún parámetro dentro de la función flecha)*/


    const dark = createTheme({ /* CreateTheme es componente de MUI */
    
        palette: {
            mode: 'dark',
             primary: {
                main: '#ff8300',
                dark: '#fca753',
            },
            secondary: {
            dark: '#fca753',
            main: '#ff8300',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#121212',
            },
        },
    });

    const light = createTheme({
        palette: {
            mode: "light",
            secondary: {
                main: '#a8e0ff',
                light: '#dbffff',
                dark: '#dbffff',
                contrastText: '#000000',
            },
             primary: {
                main: '#1691c2',
            },
        }
    })

  return (
    <div className="app">
        
        {
            !user ? ( /* Si no existe usuario se sigue enseñando login si existe uno pasa a enseñar App */

                <>
                    <Header/>  {/* React no permite que rendericemos 2 componentes a la vez por lo que eneste caso hay que recurrir a los fragments (Parte 2 1:57:20)*/}         
                    <Login/>
                </>

            ) : ( 

                <>
                    <ThemeProvider theme={darkMode ? dark : light}>
                        <CssBaseline/> {/* Componente de MUI que sirve para que el App acepte el cambio de modo dark a modo light */}
                        <Header/>
                        <div className={`app__central ${isopen ? "displayed" : ""}`}> {/* Este div va a tener la clase app__central solo en el caso de que isopen sea falso, si isopen es verdadero además de la clase central va a tener la clase "displayed". La nomenclatura utilizada se llama String Literals o plantillas literales, estas son cadenas texto que habilitan el uso de expresiones incrustadas*/}
                            <Main/>
                        </div>
                    </ThemeProvider>
                </>
            )
        }
    </div>
  );
}

export default App;
