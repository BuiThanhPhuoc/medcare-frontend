import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientHome from './pages/PatientHome';
import BookAppointment from './pages/BookAppointment'; 
import MedicalHistory from './pages/MedicalHistory';

import DoctorHome from './pages/DoctorHome';
import Examine from './pages/Examine';

import ReceptionHome from './pages/ReceptionHome';
import Reception from './pages/Reception';
import Billing from './pages/Billing';

import AdminHome from './pages/AdminHome';
import Admin from './pages/Admin';

// ==========================================
// 🛡️ LÍNH GÁC BẢO VỆ ROUTE (FRONTEND AUTH)
// ==========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Chưa đăng nhập -> Đá về trang Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đi sai "địa bàn" (Sai Role) -> Đá về đúng nhà của người đó
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'doctor') return <Navigate to="/doctor-home" replace />;
    if (user.role === 'receptionist') return <Navigate to="/reception-home" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-home" replace />;
    return <Navigate to="/patient-home" replace />;
  }

  // 3. Đúng Role -> Cho phép vào xem giao diện
  return children;
};
// ==========================================

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* PUBLIC ROUTES (Ai cũng vào được) */}
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          
          {/* ========================================== */}
          {/* PRIVATE ROUTES BỆNH NHÂN */}
          <Route path="/patient-home" element={<ProtectedRoute allowedRoles={['patient']}><PatientHome /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} /> 
          <Route path="/medical-history" element={<ProtectedRoute allowedRoles={['patient']}><MedicalHistory /></ProtectedRoute>} />
          
          {/* PRIVATE ROUTES BÁC SĨ */}
          <Route path="/doctor-home" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorHome /></ProtectedRoute>} />
          <Route path="/examine" element={<ProtectedRoute allowedRoles={['doctor']}><Examine /></ProtectedRoute>} />

          {/* PRIVATE ROUTES LỄ TÂN */}
          <Route path="/reception-home" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionHome /></ProtectedRoute>} />
          <Route path="/reception" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><Reception /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><Billing /></ProtectedRoute>} />

          {/* PRIVATE ROUTES ADMIN */}
          <Route path="/admin-home" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;