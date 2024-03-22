
import './App.css';
import Navbar from './Styles/NavBar'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/HomePage/Home';
import Login from './Pages/LoginPage/Login';
import Register from './Pages/RegisterPage/Register';
import './App.css';
import Mypage from './Pages/Mypage/MyPage';
import { AuthProvider } from './Context/AuthContext';
const App = () => {
 
  return (
    <AuthProvider>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/mypage' element={<Mypage /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
    
  );
};

export default App