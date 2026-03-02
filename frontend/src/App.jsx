import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment'; 
import Examine from './pages/Examine';
import Reception from './pages/Reception';
import Admin from './pages/Admin';
import MedicalHistory from './pages/MedicalHistory'; // <-- Fen đã import đúng rồi nè

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/reception" element={<Reception />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/book-appointment" element={<BookAppointment />} /> 
          <Route path="/examine" element={<Examine />} />
          
          {/* THÊM DÒNG ROUTE NÀY VÀO LÀ HẾT TRẮNG MÀN HÌNH NGAY */}
          <Route path="/medical-history" element={<MedicalHistory />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;