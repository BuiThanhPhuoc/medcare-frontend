import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// ==========================================
// IMPORT CONTEXT & PROVIDERS
// ==========================================
import { CartProvider } from './contexts/CartContext';

// ==========================================
// 1. IMPORT PAGES
// ==========================================
import Home from './pages/Home/Home';
import PostDetail from './pages/Home/PostDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForceChangePassword from './pages/Auth/ForceChangePassword';

import PatientDashboard from './pages/Patient/PatientDashboard';
import BookAppointment from './pages/Patient/Book/BookAppointment';
import MedicalHistory from './pages/Patient/History/MedicalHistory';
import PatientProfile from './pages/Patient/Profile/PatientProfile';
import MyAppointments from './pages/Patient/Appointments/MyAppointments';
import MedicineOrdering from './pages/Patient/Medicines/MedicineOrdering';
import CartPage from './pages/Patient/Medicines/CartPage';
import DrugOrderDetail from './pages/Patient/Medicines/DrugOrderDetail';
import DrugOrderHistory from './pages/Patient/Medicines/DrugOrderHistory';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Examine from './pages/Doctor/Examine/Examine';
import DoctorMedicalRecord from './pages/Doctor/Examine/DoctorMedicalRecord';
import DoctorVitalSignsPage from './pages/Doctor/Examine/DoctorVitalSignsPage';
import DoctorLabIndicationPage from './pages/Doctor/Examine/DoctorLabIndicationPage';
import LabTechnicianLayout from './pages/Layout/LabTechnicianLayout';
import LabDashboard from './pages/Lab/LabDashboard';
import LabOrderDetail from './pages/Lab/LabOrderDetail';
import ReceptionLabFees from './pages/Reception/LabFees/ReceptionLabFees';

import ReceptionDashboard from './pages/Reception/ReceptionDashboard';
import ReceptionCheckIn from './pages/Reception/Checkin/ReceptionCheckIn';
import ReceptionMySchedule from './pages/Reception/Schedule/MySchedule';
import Billing from './pages/Bill/Billing';
import BillingInvoiceDetail from './pages/Bill/BillingInvoiceDetail';
import PaymentSuccess from './pages/Bill/PaymentSuccess';
import PaymentFailed from './pages/Bill/PaymentFailed';

import AdminDashboard from './pages/Admin/AdminDashboard';
import MedicineManager from './pages/Admin/Medicine/MedicineManager';
import MedicineInventoryPage from './pages/Admin/Medicine/MedicineInventoryPage';
import MedicineCatalogPage from './pages/Admin/Medicine/MedicineCatalogPage';
import MedicineBatchPage from './pages/Admin/Medicine/MedicineBatchPage';
import AdminDrugOrders from './pages/Admin/Orders/AdminDrugOrders';
import LabTestsManager from './pages/Admin/LabTests/LabTestsManager';
import LabTestCategoriesManager from './pages/Admin/LabTests/LabTestCategoriesManager';

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
import LabTechnicianList from './pages/Admin/LabTechnician/LabTechnicianList';
import LabTechnicianCreate from './pages/Admin/LabTechnician/LabTechnicianCreate';
import LabTechnicianEdit from './pages/Admin/LabTechnician/LabTechnicianEdit';
import LabTechnicianShow from './pages/Admin/LabTechnician/LabTechnicianShow';

import SpecialtyList from './pages/Admin/Specialty/SpecialtyList';
import SpecialtyForm from './pages/Admin/Specialty/SpecialtyForm';

// ==========================================
// 4. IMPORT SCHEDULE COMPONENTS
// ==========================================
import ScheduleRegister from './pages/Doctor/Schedule/ScheduleRegister';
import MySchedule from './pages/Doctor/Schedule/MySchedule';
import DoctorSchedule from './pages/Admin/Schedule/Doctor/DoctorSchedule';
import ReceptionistList from './pages/Admin/Receptionist/ReceptionistList';
import ReceptionistCreate from './pages/Admin/Receptionist/ReceptionistCreate';
import ReceptionistEdit from './pages/Admin/Receptionist/ReceptionistEdit';
import ReceptionistShow from './pages/Admin/Receptionist/ReceptionistShow';
import ReceptionistScheduleList from './pages/Admin/Schedule/Receptionist/ReceptionistList';
import ReceptionistSchedule from './pages/Admin/Schedule/Receptionist/ReceptionistSchedule';
import UserList from './pages/Admin/User/UserList';
import AdminAppointmentCalendar from './pages/Admin/Appointment/AdminAppointmentCalendar';

import LabResultsPortal from './pages/Shared/LabResultsPortal';
import DoctorExaminedRecords from './pages/Doctor/DoctorExaminedRecords';


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
  } catch {
    localStorage.removeItem('user');
  }

  // Nếu đã đăng nhập rồi mà cố tình ra ngoài -> Đá về lại đúng nhà của mình
  // NHƯNG: Nếu là lần đầu đăng nhập (is_first_login = true), cho xem trang đổi mật khẩu
  if (token && user) {
    if (user.is_first_login === true || user.is_first_login === 1) {
      // Cho phép xem trang force-change-password
      return children;
    }
    
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (user.role === 'receptionist') return <Navigate to="/reception-dashboard" replace />;
    if (user.role === 'lab_technician') return <Navigate to="/lab-dashboard" replace />;
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
  } catch {
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
    if (user.role === 'lab_technician') return <Navigate to="/lab-dashboard" replace />;
    return <Navigate to="/patient-dashboard" replace />;
  }

  // 3. Đúng Role -> Cho phép vào xem giao diện
  return children;
};
// ==========================================

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
        <div className="app-container">
        <Routes>
          {/* ========================================== */}
          {/* PUBLIC ROUTES (Chỉ ai CHƯA đăng nhập mới vào được) */}
          {/* ========================================== */}
          <Route path="/" element={<PublicRoute><GuestLayout><Home /></GuestLayout></PublicRoute>} />
          <Route path="/post/:id" element={<GuestLayout><PostDetail /></GuestLayout>} />
          <Route path="/login" element={<PublicRoute><GuestLayout><Login /></GuestLayout></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><GuestLayout><Register /></GuestLayout></PublicRoute>} />
          <Route path="/force-change-password" element={<PublicRoute><GuestLayout><ForceChangePassword /></GuestLayout></PublicRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES BỆNH NHÂN */}
          {/* ========================================== */}
          <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Tổng quan bệnh nhân"><PatientDashboard /></PatientLayout></ProtectedRoute>} />
          <Route path="/my-appointments" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Lịch khám của tôi"><MyAppointments /></PatientLayout></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Đặt lịch khám"><BookAppointment /></PatientLayout></ProtectedRoute>} />
          <Route path="/medical-history" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Hồ sơ bệnh án"><MedicalHistory /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient-profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Hồ sơ cá nhân"><PatientProfile /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient/medicines" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Mua Thuốc Online"><MedicineOrdering /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient/cart" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Giỏ hàng"><CartPage /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient/orders" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Lịch sử đơn hàng"><DrugOrderHistory /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient/orders/:orderId" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Chi tiết đơn hàng"><DrugOrderDetail /></PatientLayout></ProtectedRoute>} />
          <Route path="/patient/lab-results" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout pageTitle="Xét nghiệm của tôi"><LabResultsPortal subtitle="Các chỉ định xét nghiệm gắn với lịch khám của bạn." /></PatientLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES BÁC SĨ */}
          {/* ========================================== */}
          <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Tổng quan bác sĩ"><DoctorDashboard /></DoctorLayout></ProtectedRoute>} />
          <Route path="/examine" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Hàng đợi khám"><Examine /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/examine/:appointmentId/write" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Viết bệnh án"><DoctorMedicalRecord /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/examine/:appointmentId/vitals" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Khám sức khỏe"><DoctorVitalSignsPage /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/examine/:appointmentId/lab" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Chỉ định xét nghiệm"><DoctorLabIndicationPage /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/medical-records" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Bệnh án đã khám"><DoctorExaminedRecords /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/lab-results" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Xét nghiệm"><LabResultsPortal subtitle="Chỉ định xét nghiệm trên các ca bạn phụ trách." /></DoctorLayout></ProtectedRoute>} />

          <Route path="/lab-dashboard" element={<ProtectedRoute allowedRoles={['lab_technician', 'admin']}><LabTechnicianLayout pageTitle="Hàng chờ xét nghiệm"><LabDashboard /></LabTechnicianLayout></ProtectedRoute>} />
          <Route path="/lab/order/:orderId" element={<ProtectedRoute allowedRoles={['lab_technician', 'admin']}><LabTechnicianLayout pageTitle="Nhập kết quả"><LabOrderDetail /></LabTechnicianLayout></ProtectedRoute>} />
          <Route path="/lab/all-results" element={<ProtectedRoute allowedRoles={['lab_technician', 'admin']}><LabTechnicianLayout pageTitle="Danh sách xét nghiệm"><LabResultsPortal subtitle="Toàn bộ chỉ định trong hệ thống." /></LabTechnicianLayout></ProtectedRoute>} />
          <Route path="/doctor/schedules/register" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Đăng ký lịch làm việc"><ScheduleRegister /></DoctorLayout></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout pageTitle="Lịch làm việc của tôi"><MySchedule /></DoctorLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES LỄ TÂN */}
          {/* ========================================== */}
          <Route path="/reception-dashboard" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionLayout pageTitle="Tổng quan lễ tân"><ReceptionDashboard /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/reception/checkin" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionLayout pageTitle="Check-in Bệnh nhân"><ReceptionCheckIn /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/reception/my-schedule" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionLayout pageTitle="Lịch của tôi"><ReceptionMySchedule /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Quản lý hóa đơn"><Billing /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/billing/:appointmentId" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Chi tiết hóa đơn"><BillingInvoiceDetail /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/reception/lab-fees" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Thu phí xét nghiệm"><ReceptionLabFees /></ReceptionLayout></ProtectedRoute>} />

          {/* VNPay return pages */}
          <Route path="/payment-success" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Thanh toán"><PaymentSuccess /></ReceptionLayout></ProtectedRoute>} />
          <Route path="/payment-failed" element={<ProtectedRoute allowedRoles={['receptionist', 'admin']}><ReceptionLayout pageTitle="Thanh toán"><PaymentFailed /></ReceptionLayout></ProtectedRoute>} />

          {/* ========================================== */}
          {/* PRIVATE ROUTES ADMIN */}
          {/* ========================================== */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Tổng quan admin"><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Phê duyệt Lịch khám"><AdminAppointmentCalendar /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Người Dùng"><UserList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/schedules" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Phê Duyệt Lịch Làm Việc"><DoctorSchedule /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/schedules/receptionists" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Lịch Lễ Tân"><ReceptionistScheduleList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/receptionists" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Lễ Tân"><ReceptionistList /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/receptionists/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Lễ Tân"><ReceptionistCreate /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/receptionists/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Lễ Tân"><ReceptionistEdit /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/receptionists/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Chi Tiết Lễ Tân"><ReceptionistShow /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/receptionists/:receptionistId/schedule" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Gán Lịch Lễ Tân"><ReceptionistSchedule /></AdminLayout></ProtectedRoute>} />

          {/* CRUD BÁC SĨ */}
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Bác Sĩ"><DoctorList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Bác Sĩ"><DoctorCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Bác Sĩ"><DoctorEdit /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/doctors/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Chi Tiết Bác Sĩ"><DoctorShow /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/lab-technicians" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Kỹ thuật viên xét nghiệm"><LabTechnicianList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/lab-technicians/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm KTV xét nghiệm"><LabTechnicianCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/lab-technicians/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa KTV xét nghiệm"><LabTechnicianEdit /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/lab-technicians/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Chi tiết KTV"><LabTechnicianShow /></AdminLayout></ProtectedRoute>} />

          {/* CRUD BÀI VIẾT */}
          <Route path="/admin/posts" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Bài Viết"><PostList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Bài Viết"><PostCreate /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Bài Viết"><PostEdit /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/posts/trashed" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Bài Viết Đã Xóa"><PostTrashed /></AdminLayout></ProtectedRoute>} />

          {/* CRUD CHUYÊN KHOA */}
          <Route path="/admin/specialties" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Chuyên Khoa"><SpecialtyList /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/specialties/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Thêm Chuyên Khoa"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/specialties/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Sửa Chuyên Khoa"><SpecialtyForm /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/medicines" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Kho Thuốc"><MedicineManager /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/medicines/inventory" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản lý kho thuốc"><MedicineInventoryPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/medicines/catalog" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Danh mục thuốc"><MedicineCatalogPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/medicines/batches" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản lý lô thuốc"><MedicineBatchPage /></AdminLayout></ProtectedRoute>} />
          
          {/* QUẢN LÝ ĐƠN THUỐC */}
          <Route path="/admin/drug-orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản Lý Đơn Thuốc"><AdminDrugOrders /></AdminLayout></ProtectedRoute>} />

          {/* CRUD XÉT NGHIỆM */}
          <Route path="/admin/lab-tests" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Quản lý xét nghiệm"><LabTestsManager /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/lab-test-categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Danh mục xét nghiệm"><LabTestCategoriesManager /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/lab-results" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout pageTitle="Danh sách xét nghiệm"><LabResultsPortal subtitle="Tổng quan chỉ định xét nghiệm trên toàn phòng khám." /></AdminLayout></ProtectedRoute>} />
        </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={true} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="light"
        />
      </div>
    </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;