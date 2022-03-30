import "./Post.css";
import { Avatar, avatarClasses, IconButton} from "@mui/material";
import {useCallback, useRef} from "react";
import { UseStateValue } from "../Stateprovider";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { db } from "../firebase";
import { forwardRef, useState, useEffect } from "react"; /* Lo usamos para animaciones de Librería react-flip-move */

/* Para usar las animaciones hay que englobar todo el componente hijo con forwardRef, este método también añade un parámetro llamado ref y también, en el componente padre (Main.js) donde englobaremos el componente que queramos que tenga las animaciones con el componente <FlipMove/>, por último añadimos mas abajo en return en el div Post una propiedad llamada ref={ref} */

const Post = forwardRef(({id,text, isActive, username, avatar, likes, sameuser, messmenu}, ref) => { /* Recibe de forma destructurada id, title, text (de posts) e isActive */

     const [{isopen, user, darkMode}, dispatch] = UseStateValue(); /* Usamos user para definir el avatar del usuario en los posts */

       const userData = {
            "usuario" : user?.displayName,
            "email" : user?.email,
            "avaurl" : user?.photoURL,
        }

     const removePost = () => { /* Elimina el post */
        db.collection("posts").doc(id).delete();
     }

     /* Para eliminar el post debemos obtener el id, para ello creamos un prop en main.js en Post (linea 70). También se recomienda crear un prop llamado key cada vez que se usa el método .map para que react sea capaz de identificar el componente concreto que cambia o se modifica de manera que solo se refresque o se renderice ese componente (Parte 2: 1:43:00)*/

     const likePost = () => {
        const likedPost = db.collection("posts").doc(id); /* Con esto localizamos el documento al cual se le ha dado like (con doc(id)) */ 

        likedPost.get().then(doc => likedPost.update({
            isActive: !doc.data().isActive,
            likes: isActive ? removeLikes() : [userData, ...likes],  /* Devuelve array de objetos (userData)*/ 
        }));

        /* El método get permite recuperar el post al que hemos dado like, nos retorna una promesa y esta promesa nos retorna el doc para actualizarlo (update). En este caso cambiaremos el valor de isActive al opuesto con (!) */

          /*console.log(db.collection("posts").where("likes", "array-contains-any", [user?.displayName]).get())*/ /* Bien */

          console.log(user?.email === "davirck@gmail.com" ? "true" : "false");
     }

     const removeLikes = () => { /* Elimina el like del usuario si isActive es verdadero y viceversa (al revés a propósito línea 27) */

        const newLikesArray = likes.filter(array => {return array.email !== user?.email}); /* filter devuelve un array de objetos (userData) con las condiciones puestas dentro del método, en este caso le pedimos que nos devuelva un array de objetos sin el objeto que tenga el email del usuario (userData.email === user?.email) */

        return newLikesArray;
     }

    useEffect(() => { /* Cuando el usuario entra y se carga la aplicación comprueba si en el array de objetos (likes) se incluye el email de usuario, sino se incluye isActive es false, si el email de usuario se encuentra en el array de objetos isActive es true */
        const checkPosts = db.collection("posts").doc(id);

        checkPosts.get().then(doc => checkPosts.update({
            isActive: likes.some(object => object.email === user?.email),  
        })); /* El método some comprueba si algún elemento del array cumple con la condición escrita, devuelve un booleano (true o false) */

        const checkDeleteIconTrue = db.collection("posts").where("email", "==", user?.email).get() /* Obtiene los posts cuyo email de usuario (autor de los posts) es el mismo que el usuario logueado, cada post o mensaje contiene un campo llamado email que registra el email del autor del mensaje */

        checkDeleteIconTrue.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    sameuser: true,
                })
            })
        }) /* En estos posts pasará sameuser a true y mostrará la opción "Eliminar mensaje" */

        /* No se puede usar la función de la linea 51 con checkDeleteIcon ya que esta devuelve un "collection", primero hay que definir un documento y actualizar el campo (field) que queramos uno a uno con forEach() */

         const checkDeleteIconFalse = db.collection("posts").where("email", "!=", user?.email).get() /* Obtiene los posts cuyo email de usuario (autor de los posts) no es el mismo que el usuario logueado */

        checkDeleteIconFalse.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    sameuser: false,
                }) /* En estos posts pasará sameuser a false y no mostrará la opción "Eliminar mensaje" */
            })
        });    

    });


    const toggleMm = () => {
        const Mmclicked = db.collection("posts").doc(id); /* Coge la id del posts clickado */

        Mmclicked.get().then(doc => Mmclicked.update({
            messmenu: !doc.data().messmenu,  /* Cambia messmenu por el valor contrario del que esté (true/false) */
        }));

    }

    const listContainer = useRef(null); /* Lista de likes en post__infoLike */

    const likeul = useRef(null); /* Ul de lista donde se muestran los likes */
    
    const postlayer = useRef(null); /* Capa que tapa las otras funciones del post cuando el usuario abre el menu de "Ver Likes" */

    const arrayLikes = () => { /* Crea la lista de likes de cada post */

        if (likes.length > 0) {

        let numberOfListItems = likes.length;

        for (let i = 0; i < numberOfListItems; i++) {
            
            let listItem = document.createElement('li');

            listItem.innerHTML = "<img src=" + likes[i].avaurl + ">" + likes[i].usuario; /* Mostramos solo el usuario y la url del avatar del objeto userData */

            likeul.current.appendChild(listItem);
        }

        /*if(listContainer.current.hasChildNodes() === true) {
            while (listElement.hasChildNodes() === true) {
                listElement.removeChild(listElement.firstChild);
            }
        }*/

        } else { /* Si no hay likes muestra este mensaje */

            let noItem = document.createElement('h5');

            noItem.innerHTML = "Este mensaje no tiene likes."

            likeul.current.appendChild(noItem);
        }

         listContainer.current.classList.remove("hide"); /* Muestra el menu de likes */

         postlayer.current.classList.remove("hide"); /* Muestra la capa */
        
    }

    const arrayLikesRemove = () => {       

        while (likeul.current.firstChild) {
            likeul.current.removeChild(likeul.current.firstChild); /* Al cerrar el menú de likes elimina los likes mostrados */
        }

        listContainer.current.classList.add("hide"); /* Oculta el post de likes */

        postlayer.current.classList.add("hide"); /* Oculta la capa */
        
    }

    return (  
        <div className={user?.displayName === username ? `${darkMode ? "post--own blue" : "post--own pown--light"}` : `${darkMode ? "post dark" : "post post--light"}`} ref={ref}>
            <div className={`${user?.displayName === username ? `${darkMode ? "post__layer blue" : "post__layer pown--light"}` : `${darkMode ? "post__layer dark" : "post__layer post--light"}`} hide`} ref={postlayer}>
            </div>
            <div class="post__header">
                <div class="post__user">
                    <Avatar className="avatar" src={avatar}/>
                    {username}
                </div>
            </div>
            <div className="post__body">
                <h4>{text}</h4>
            </div>
            <div className="post__like">
                    <IconButton onClick={likePost}>
                        <FavoriteBorderIcon className={isActive ? `${darkMode ? "like__active--dark" : "like__active--light"}` : ""}/> {/* Operador ternario: si se pulsa en el icono el botón cambiara a otro color y si se vuelve a pulsar el botón volverá al color de antes (todo depende de que valor tenga isActive) */}
                    </IconButton>
                    <h5 className={likes.length === 0 ? "hide" : ""}>{likes.length}</h5>
                    <IconButton onClick={toggleMm}>
                        <MoreVertIcon/>
                    </IconButton>
            </div>
            <div className={messmenu ? "post__info" : "post__info hide"}>
                <ul className={darkMode ? "dark" : "ul--light"}>
                    <li onClick={arrayLikes}>Ver likes</li>
                    <li className={sameuser || user?.email === "davirck@gmail.com" ? `${darkMode ? "li--dark" : "li--light"}` : "hide"} onClick={removePost}>Eliminar mensaje</li>
                </ul>
                <div className="post__infoLike hide" ref={listContainer}>
                    <ul className={darkMode ? "dark ul__border--dark" : "ul--light"} ref={likeul}>
                    </ul>  
                    <div className={darkMode ? "post__infoLikeButt orange" : "post__infoLikeButt blue"}>
                    {/*`${likeul.current.firstChild ? "post__infoLikeButt" : "hide"}`*/}
                        <IconButton onClick={arrayLikesRemove}>
                            <CloseIcon className="IconButton__close"/>
                        </IconButton>
                    </div>
                </div>
            </div>         
        </div>
    );
});

export default Post;
