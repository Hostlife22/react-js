import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AuthProvider from './hoc/AuthProvider';
import RequireAuth from './hoc/RequireAuth';
import About from './pages/Aboutpage';
import Blog from './pages/Blogpage';
import Createpost from './pages/Createpost';
import Editpost from './pages/Editpost';
import Home from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Notfound from './pages/Notfoundpage';
import Singlepage from './pages/Singlepage';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="about" element={<About />}>
            <Route path="contacts" element={<p>Out contact</p>} />
            <Route path="team" element={<p>Out team</p>} />
          </Route>
          <Route path="about-us" element={<Navigate to="/about" replace />} />
          <Route path="posts" element={<Blog />} />
          <Route path="posts/:id" element={<Singlepage />} />
          <Route path="posts/:id/edit" element={<Editpost />} />
          <Route
            path="posts/new"
            element={
              <RequireAuth>
                <Createpost />
              </RequireAuth>
            }
          />
          <Route path="login" element={<Loginpage />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
