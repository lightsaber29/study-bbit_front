import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'api/axios';
import { setMember } from 'store/memberSlice';
import routes from './routes';
import Loading from './components/Loading';
import { setNotifications } from 'store/notificationSlice';
import ScrollToTop from './components/ScrollToTop';

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

          const notiResponse = await axios.get('/api/noti?size=20');
          if (notiResponse.data?.content) {
            dispatch(setNotifications(notiResponse.data.content));
          }
        }
      } catch (error) {
        console.log("not logged in");
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop />
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
  );
}

export default App;