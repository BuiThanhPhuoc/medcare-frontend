import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// 1. IMPORT PAGES
// ==========================================
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForceChangePassword from './pages/Auth/ForceChangePassword';

import PatientDashboard from './pages/Patient/PatientDashboard';
import BookAppointment from './pages/Patient/Book/BookAppointment';
import MedicalHistory from './pages/Patient/History/MedicalHistory';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Examine from './pages/Doctor/Examine/Examine';

import ReceptionDashboard from './pages/Reception/ReceptionDashboard';
import Reception from './pages/Reception/Reception';
import Billing from './pages/Bill/Billing';

import AdminDashboard from './pages/Admin/AdminDashboard';
import MedicineManager from './pages/Admin/Medicine/MedicineManager';

// ==========================================
// 2. IMPORT LAYOUTS
// ==========================================
import GuestLayout from './pages/Layout/GuestLayout';
import PatientLayout from './pages/Layout/PatientLayout';
import DoctorLayout from './pages/Layout/DoctorLayout';
import ReceptionLayout from './pages/Layout/ReceptionLayout';
import AdminLayout from './pages/Layout/AdminLayout';

// ==========================================
// 3. IMPORT ADMIN CRUD COMPONENTS
// ==========================================
import PostList from './pages/Admin/Post/PostList';
import PostCreate from './pages/Admin/Post/PostCreate';
import PostEdit from './pages/Admin/Post/PostEdit';
import PostTrashed from './pages/Admin/Post/PostTrashed';

import DoctorList from './pages/Admin/Doctor/DoctorList';
import DoctorCreate from './pages/Admin/Doctor/DoctorCreate';
import DoctorEdit from './pages/Admin/Doctor/DoctorEdit';
import DoctorShow from './pages/Admin/Doctor/DoctorShow';

import SpecialtyList from './pages/Admin/Specialty/SpecialtyList';
import SpecialtyForm from './pages/Admin/Specialty/SpecialtyForm';

// ==========================================
// 4. IMPORT SCHEDULE COMPONENTS
// ==========================================
import ScheduleRegister from './pages/Doctor/Schedule/ScheduleRegister';
import MySchedule from './pages/Doctor/Schedule/MySchedule';
import DoctorSchedule from './pages/Admin/Schedule/DoctorSchedule';


// ==========================================
// 🛑 LÍNH GÁC 1: PUBLIC ROUTE (Chống "ảo giác" đăng xuất)
// Dành cho các trang Guest. Nếu đã đăng nhập thì đá vào Dashboard.
// ==========================================
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) user = JSON.parse(userStr);
  } catch (error) {
    localStorage.removeItem('user');
  }

  // Nếu đã đăng nhập rồi mà cố tình ra ngoài -> Đá về lại đúng nhà của mình
  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (user.role === 'receptionist') return <Navigate to="/reception-dashboard" replace />;
    return <Navigate to="/patient-dashboard" replace />;
  }

  // Nếu chưa đăng nhập thì cho xem trang
  return children;
};


// ==========================================
// 🛡️ LÍNH GÁC 2: PROTECTED ROUTE (Frontend Auth)
// Dành cho các trang nội bộ. Nếu đi sai role hoặc chưa đăng nhập thì chặn lại.
// ==========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) user = JSON.parse(userStr);
  } catch (error) {
    localStorage.removeItem('user');
  }

  // 1. Chưa đăng nhập -> Đá về trang Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đi sai "địa bàn" (Sai Role) -> Đá về đúng nhà của người đó
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (user.role === 'receptionist') return <Navigate to="/reception-dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/patient-dashboard" replace />;
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
          {/* ========================================== */}
          {/* PUBLIC ROUTES (Chỉ ai CHƯA đăng nhập mới vào được) */}
          {/* ========================================== */}
          <Route path="/" element={<PublicRoute><GuestLayout><Home /></GuestLayout></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><GuestLayout><Login /></GuestLayout></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><GuestLayout><Register /></GuestLayout></PublicRoute>} />
          <Route path="/force-change-password" element={<PublicRoute><GuestLayout><ForceChangePassword /></GuestLayout></PublicRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES BỆNH NHÂN */}
          {/* ========================================== */}
          <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="patient.title"><PatientDashboard /></PatientLayout></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="patient.bookAppointment"><BookAppointment /></PatientLayout></ProtectedRoute>} />
          <Route path="/medical-history" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="patient.history"><MedicalHistory /></PatientLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES BÁC SĨ */}
          {/* ========================================== */}
          <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="doctor.title"><DoctorDashboard /></DoctorLayout></ProtectedRoute>} />
          <Route path="/examine" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="doctor.examine"><Examine /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/schedules/register" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="doctor.register_schedule"><ScheduleRegister /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="doctor.my_schedule"><MySchedule /></DoctorLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES LỄ TÂN */}
          {/* ========================================== */}
          <Route path="/reception-dashboard" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionLayout pageTitle="reception.dashboard"><ReceptionDashboard /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/reception" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="reception.manage_reception"><Reception /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="reception.billing"><Billing /></ReceptionLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES ADMIN */}
          {/* ========================================== */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.title"><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/schedules" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.approveSchedules"><DoctorSchedule /></AdminLayout></ProtectedRoute>} />

          {/* CRUD BÁC SĨ */}
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.manageDoctors"><DoctorList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.addDoctor"><DoctorCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.editDoctor"><DoctorEdit /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.doctorDetails"><DoctorShow /></AdminLayout></ProtectedRoute>} />

          {/* CRUD BÀI VIẾT */}
          <Route path="/admin/posts" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.managePosts"><PostList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.addPost"><PostCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.editPost"><PostEdit /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/trashed" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.trashedPosts"><PostTrashed /></AdminLayout></ProtectedRoute>} />

          {/* CRUD CHUYÊN KHOA */}
          <Route path="/admin/specialties" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.specialties"><SpecialtyList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/specialties/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.addSpecialty"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/specialties/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.editSpecialty"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/medicines" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="admin.manageMedicines"><MedicineManager /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;