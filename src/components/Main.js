import { useState, useEffect, useRef} from "react";
import "./Main.css"
import Post from "./Post";
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import FlipMove from "react-flip-move";
import { UseStateValue } from "../Stateprovider";

const Main = () => {

    const [{user}, dispatch] = UseStateValue(); /* Usamos user en Main.js para guardar el usuario (Parte 2: 3:00:19), los usamos para los parámetros username y avatar en línea 39 y 40 (handleSubmit) */

    const [posts, setPosts] = useState([]); /* Array vacío, aquí se alamacenarán los títulos y mensajes de cada post (1:19:00) */
    const [input, setInput] = useState({ /* Con useState pasamos un objeto que contiene un título y texto en blanco */
        text: "",
    });

    const [likes, setLikes] = useState([]);

    const mainPosts = useRef(null);

    useEffect(() => { /* UseEffect recibe 2 parámetros una función flecha y un array vacío de manera que solo se ejecuta cada vez que se refresque */
        db.collection("posts").orderBy("timestamp", "asc").onSnapshot(snapshot => setPosts(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
        })))); /* Método que genera un snapshot "pantallazo" */

        closeMm(); /* Cierra post__info (Post.js) cuando el usuario cierra sesión */
        
    }, []);

    /* Con useEffect decimos que acceda a la base de datos de Firestore (db), a la colección "posts". En la colección posts sacar un pantallazo o snapshot a todos los documentos que haya y para cada pantallazo, cambia "setPosts" por snapshot.docs.map() --> Esto es un objeto que lo que hace es acceder a todos los docs y configurar un objeto Parte 2(53:00)*/

    /* orderBy() es un método que nos permite ordenar elementos, en este caso, lo que harça es ordenar según la fecha de creación de los posts/docs en el servidor, "desc" significa que nos los ordene en dirección descendente */

    const closeMm = () => { /* Cierra post__info (Post.js) cuando el usuario cierra sesión */
        const postmessm = db.collection("posts").where("messmenu", "==", true);

        postmessm.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    messmenu: false,
                })
            })
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault(); /* Método que impide que la pantalla se refresque */

        if(input.text){ /* Si el usuario ha escrito algo en input.title e input.text */
            db.collection("posts").add({
                text: input.text,
                username: user?.displayName, /* Graba el nombre de usuario que ha hecho el post */
                avatar: user?.photoURL, /* Guarda el avatar de usuario que ha hecho el post */
                email: user?.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: false, /* Propiedad que controla los likes a los posts (Parte 2: 7:20) (BD Firebase) */
                likes: likes,
                sameuser: false,
                messmenu: false,
            }); /* El objeto db sale del archivo firebase.js, en firebase hay que inicializar una constante llamada db que es la que inicia la base de datos Firestore.
            
            Se accede a una colección donde se van a crear objetos "posts" usando el método add({})*/

            /* timestamp es una marca de tiempo y nos devuelve la hora en la que los posts se han publicado (hora del servidor), esto nos permite ordenarlos cronológicamente de forma correcta */

            /*setPost([input, ...posts]);  Devuelve un array con el input y todos los posts que se han hecho por los usuarios */

            setInput({ /* Usamos de nuevo setInput para limpiar la barra depués de haber enviado el mensaje */
                text: "",
            });

            setTimeout(updateScroll, 125);


        } else{ alert("Escribe un mensaje.")} /* Si el usuario no escribe nada o solo escribe en uno de los dos inputs no se envía el mensaje y recibe un alert */
        /* Los tres puntos (...) es un operador llamado "Spread operator" (1:48:00)*/

    };



    const updateScroll = () => {

        if(Post) {
        
            let scrollHeight = (window.innerHeight*0.8);

            console.log(Post)

            mainPosts.current.scroll({top: 0, left: 0, behavior: 'smooth',});

        }

    };


    /*https://www.cluemediator.com/auto-scroll-to-the-bottom-in-a-react-chat-application#cacd*/

    return (
        <div className="main">
            <div className="main__posts" ref={mainPosts}> 
            <div className="post__width">
            {            
                <FlipMove>
                    {posts.map(({id, data:{text, isActive, username, avatar, likes, sameuser, messmenu}}) => <Post key={id} id={id} text={text} isActive={isActive} username={username} avatar={avatar} likes={likes} sameuser={sameuser} messmenu={messmenu}/>)}
               </FlipMove> 
               
               /* ({id, data:{title, text}}) --> Desestructuración de objeto docs, y dentro de ese una desestructuración de las propiedades en data (data es otro objeto que está dentro de doc)  Parte 2 (58:00) */
               

               /* .map itera el array de objetos posts y por cada objeto coloca un título y un texto determinado con la ayuda de las propiedades title y text que se consiguen por la destructuración de posts (Para mas info mirar Post.js)*/

               /* Likes: Pasamos isActive creando un prop isActive */

               /* FlipMove: Componente de librería de animación de React */

               /* username y avatar: Lo usamos para que guarde el avatar y el usuario del que hizo el post */
            }
            </div>
            <div className="main__postsBack"></div>
            </div>
                       
            <div className="main__input">
                <Box component="form" noValidate autoComplete="off">
                    <div class="main__inputForm">
                        {/* <TextField id="standard-basic" label="Titulo" variant="standard" value={input.title} onChange={e => setInput({...input, title: e.target.value})}/>
                        El valor de este input depende de lo que ponga en input.title pero como se ve mas arriba el valor de input.title es 0 por lo que este input no te va a dejar escribir. Por lo tanto, es necesario crear una función que se ejecute cuando haya algún cambio "OnChange". Esta función agregará lo que el usuario escriba (e.target.value) más lo que haya ya escrito (...input) (1:20:00) dejando (en este caso) el text tal y como está */}

                        <TextField className="main__inputFormText" id="outlined-basic" label="Mensaje" variant="outlined" color="primary" value={input.text} onChange={e => setInput({...input, text: e.target.value})}/>
                    </div>
                    <button className="button" type="submit" onClick={handleSubmit}></button>
                    {/* Con el button vamos a insertar lo que haya almacenado a la variable input, para ello primero hay que aplicarle al botón "type=submit" */}
                </Box>
            </div>
        </div>
    );
}

export default Main;