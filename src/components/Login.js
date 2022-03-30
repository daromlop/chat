import { auth, provider } from "../firebase";
import { Button } from "@mui/material";
import { actionTypes } from "../reducer";
import { UseStateValue } from "../Stateprovider";
import "./Login.css"

const Login = () => {

    const [{user}, dispatch] = UseStateValue();

    const signin = () => {
        auth.signInWithPopup(provider).then(result => dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
        })).catch(err => (alert(err.message)));  /* El objeto auth tiene un método llamado signInWithPopup, como argumento pasamos provider que es el objeto de Google que necesitamos para hacer el signin, esto retorna una promesa. Si el usuario se loguea correctamente tendremos un resultado (result) y haremos dispatch a ese resultado creando un objeto con propiedades actionType y user. Este user va a ser el objeto result con el parámetro user (3:00:50) 
        
        Una vez obtenido se "inyecta" en la capa con dispatch (3:03:20) y va también al estado inicial de reducer.js
        
        Si fallara el primer bloque (then) se ejecutaría el segundo bloque (catch) y devolvería un error*/
    }

    return (
        <div className="login">
            <h1>¡Entra con tu cuenta de Google y empieza a chatear!</h1>
            <Button variant="contained" onClick={signin}>Iniciar sesión con Google</Button>
        </div>
    );
}

export default Login; /* Usamos el Login en App.js */