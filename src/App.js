import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'api/axios';
import { setMember } from 'store/memberSlice';
import routes from './routes';
import Loading from './components/Loading';

function App() {


  return (
    <div className="max-w-screen-lg container mx-auto p-6">
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;