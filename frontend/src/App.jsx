import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PatientHome from './pages/Patient/PatientHome';
import BookAppointment from './pages/Patient/Book/BookAppointment'; 
import MedicalHistory from './pages/Patient/History/MedicalHistory';

import DoctorHome from './pages/Doctor/DoctorHome';
import Examine from './pages/Doctor/Examine/Examine';

import ReceptionHome from './pages/Reception/ReceptionHome';
import Reception from './pages/Reception/Reception';
import Billing from './pages/Bill/Billing';

import AdminHome from './pages/Admin/AdminHome';
import Admin from './pages/Admin/Admin';

// Import Layouts
import PatientLayout from './pages/Layout/PatientLayout';
import DoctorLayout from './pages/Layout/DoctorLayout';
import ReceptionLayout from './pages/Layout/ReceptionLayout';
import AdminLayout from './pages/Layout/AdminLayout';

import PostList from './pages/Admin/Post/PostList';
import PostCreate from './pages/Admin/Post/PostCreate';
import PostEdit from './pages/Admin/Post/PostEdit';
import PostTrashed from './pages/Admin/Post/PostTrashed';
import DoctorList from './pages/Admin/Doctor/DoctorList';
import DoctorCreate from './pages/Admin/Doctor/DoctorCreate';
import DoctorEdit from './pages/Admin/Doctor/DoctorEdit';

// Import Chuyên khoa
import SpecialtyList from './pages/Admin/Specialty/SpecialtyList';
import SpecialtyForm from './pages/Admin/Specialty/SpecialtyForm';

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
          <Route path="/patient-home" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Tổng quan bệnh nhân"><PatientHome /></PatientLayout></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Đặt lịch khám"><BookAppointment /></PatientLayout></ProtectedRoute>} /> 
          <Route path="/medical-history" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Hồ sơ bệnh án"><MedicalHistory /></PatientLayout></ProtectedRoute>} />
          
          {/* PRIVATE ROUTES BÁC SĨ */}
          <Route path="/doctor-home" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Tổng quan bác sĩ"><DoctorHome /></DoctorLayout></ProtectedRoute>} />
          <Route path="/examine" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Khám bệnh"><Examine /></DoctorLayout></ProtectedRoute>} />

          {/* PRIVATE ROUTES LỄ TÂN */}
          <Route path="/reception-home" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionLayout pageTitle="Tổng quan lễ tân"><ReceptionHome /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/reception" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Quản lý tiếp tân"><Reception /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Quản lý hóa đơn"><Billing /></ReceptionLayout></ProtectedRoute>} />

          {/* PRIVATE ROUTES ADMIN */}
          <Route path="/admin-home" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Tổng quan admin"><AdminHome /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản lý hệ thống"><Admin /></AdminLayout></ProtectedRoute>} />
          
        {/* CRUD BÁC SĨ */}
        <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Bác Sĩ"><DoctorList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/doctors/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Bác Sĩ"><DoctorCreate /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/doctors/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Bác Sĩ"><DoctorEdit /></AdminLayout></ProtectedRoute>} />
        
        {/* CRUD BÀI VIẾT */}
        <Route path="/admin/posts" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Bài Viết"><PostList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/posts/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Bài Viết"><PostCreate /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/posts/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Bài Viết"><PostEdit /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/posts/trashed" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Bài Viết Đã Xóa"><PostTrashed /></AdminLayout></ProtectedRoute>} />
        
        {/* CRUD CHUYÊN KHOA */}
        <Route path="/admin/specialties" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Chuyên Khoa"><SpecialtyList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/specialties/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Chuyên Khoa"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/specialties/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Chuyên Khoa"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />
      
      </Routes>
      </div>
    </Router>
  );
}

export default App;