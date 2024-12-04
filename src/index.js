import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { Provider } from 'react-redux';
import store, { persistor } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import './styles/index.css';
import './styles/tailwind.css';

// 레이아웃을 관리할 컴포넌트
const Layout = () => {
  const location = useLocation();
  const hideLayout = new URLSearchParams(location.search).get('hideLayout') === 'true';

  return (
    <div className={hideLayout ? '' : 'max-w-screen-lg container mx-auto p-6'}>
      {!hideLayout && <Header />}
      <App />
      {!hideLayout && <Footer />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);