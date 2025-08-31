import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MainLayout from './layout/main_layout';
import History from './pages/history';
import Home from './pages/homePage';
import Login from './pages/login';
function App() {
 const [username, setUsername] = useState(localStorage.getItem("username") || null);
  return (
    <>
          <Router>
     <MainLayout username={username} setUsername={setUsername}>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/History" element={<History />} />
        <Route path="/Login" element={<Login setUsername={setUsername} />} />
       
      </Routes>
    
    </MainLayout> 
    </Router>
    </>
  )
}

export default App
