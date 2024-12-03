import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'api/axios';
import { setMember } from 'store/memberSlice';
import routes from './routes';
import Loading from './components/Loading';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const memberResponse = await axios.get('/api/member');
        
        if (memberResponse.data) {
          dispatch(setMember({
            ...memberResponse.data,
            memberId: memberResponse.data.id 
          }));
        }
      } catch (error) {
        console.log("not logged in");
      }
    };

    checkLoginStatus();
  }, [dispatch]);

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