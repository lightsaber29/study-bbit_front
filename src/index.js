import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { Provider } from 'react-redux';
import store, { persistor } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Header/>
        <App/>
        <Footer/>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);