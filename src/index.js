import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './Stateprovider';
import reducer, { initialState } from './reducer';

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}> {/* Parámetros importados desde reducer.js */}
        <App />    
    </StateProvider> {/*StateProvider "envuelve" a App pasándole todos los datos (2:15:00). El StateProvider le proporciona a la App el estado inicial o initialState y la función reducer para "escuchar" cualquier cambio en los datos*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
