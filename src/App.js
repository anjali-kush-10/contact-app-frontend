import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import Auth from './Components/Auth';
import Home from './Components/Home';
import AdminPanel from './Components/AdminPanel';
import ManageContact from './Components/ManageContact';
import ManageUsers from './Components/ManageUsers';
import ViewContact from './Components/ViewContact';
import axios from 'axios';
import { useEffect } from 'react';

function App() {

  const authToken = localStorage.getItem('token');

  const apiHeader = {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }

  const fetchPermission = () => {
    axios.get("http://localhost:4000/user/fetch-permission", apiHeader)
      .then((response) => {
        localStorage.setItem('role', JSON.stringify(response.data.data));
      }).catch((error) => {
        console.log(error.message);
      });
  }

  useEffect(() => {
    fetchPermission()
  }, [])

  return (
    <>
      <Auth />
      <Routes>

        <Route path='/' element={<Home />}></Route>
        <Route path='/admin' element={<AdminPanel />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/managecontact' element={<ManageContact />}></Route>
        <Route path='/manageusers' element={<ManageUsers />}></Route>
        <Route path='/viewcontact/:id' element={<ViewContact />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </>
  );
}

export default App;
