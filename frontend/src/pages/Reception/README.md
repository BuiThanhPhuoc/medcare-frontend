# Reception Dashboard

Dashboard cho nhân viên Lễ Tân / Thu Ngân

## 📁 Cấu trúc thư mục

```
Reception/
├── ReceptionDashboard.jsx          # Main component (orchestrator)
├── components/                     # UI Components
│   ├── ReceptionHeader.jsx         # Header + Time + Logout
│   ├── QuickActionsBar.jsx         # Action links
│   ├── QuickStats.jsx              # 4 stat cards
│   ├── PersonalInfo.jsx            # Personal info section
│   └── ScheduleWidgets.jsx         # Today shifts + Weekly schedule
├── hooks/                          # Custom React Hooks
│   ├── useCurrentTime.js           # Current time management
│   └── useReceptionUser.js         # Auth + user data
├── constants/                      # Constants & Mock Data
│   └── mockData.js                 # Mock data for components
├── services/                       # API Services
│   └── receptionService.js         # API calls (ready for backend)
├── CSS/
│   └── Reception.css               # Styles
└── README.md                       # This file
```

## 🎯 Kiến trúc & Luồng Dữ Liệu

```
ReceptionDashboard (Main)
├── useReceptionUser() → user, logout logic
├── useCurrentTime() → currentTime (updated every 60s)
│
├── ReceptionHeader (user, currentTime, onLogout)
├── QuickActionsBar (actions from mockData)
├── QuickStats (stats from mockData)
├── TodayShifts (currentTime)
├── PersonalInfo (personalInfo from mockData + user.username)
└── WeeklySchedule (currentTime)
```

## 🔧 Cách sử dụng

### Import Dashboard
```jsx
import ReceptionDashboard from '@/pages/Reception/ReceptionDashboard';

// Sử dụng trong route
<Route path="/reception-dashboard" element={<ReceptionDashboard />} />
```

### Thêm dữ liệu mới
1. **Mock data**: Edit `constants/mockData.js`
2. **API data**: Implement trong `services/receptionService.js`
3. **Pass to components**: Update props từ `ReceptionDashboard`

## 📝 Hướng dẫn Mở rộng

### 1. Thêm component mới
```jsx
// components/NewComponent.jsx
const NewComponent = ({ data }) => {
  return <div>...</div>;
};
export default NewComponent;
```

### 2. Thêm hook mới
```jsx
// hooks/useNewHook.js
export const useNewHook = () => {
  // logic
  return data;
};
```

### 3. Thêm API call
```jsx
// Trong services/receptionService.js
async getNewData() {
  const response = await api.get('/api/reception/new-data');
  return response.data;
}
```

## 🚀 Chuyển từ Mock Data sang API

**Hiện tại**: Toàn bộ data là mock (trong `constants/mockData.js`)

**Khi backend sẵn sàng**:
1. Uncomment các API calls trong `ReceptionDashboard.jsx`
2. Thay `MOCK_*` constants bằng gọi `receptionService`
3. Handle loading & error states

**Ví dụ**:
```jsx
// Trước
const stats = MOCK_STATS;

// Sau
const [stats, setStats] = useState(null);
useEffect(() => {
  receptionService.getStats(user.id)
    .then(data => setStats(data))
    .catch(err => console.error(err));
}, [user.id]);
```

## 🎨 Styling

- CSS classes được định nghĩa trong `CSS/Reception.css`
- **Không dùng inline styles** (ngoại trừ dynamic values)
- Consistent với design system của ứng dụng

## 🧪 Testing Tips

- Test each component independently với mock props
- Test hooks với `@testing-library/react-hooks`
- Mock `localStorage` trong auth tests
- Mock `api` service khi test data fetching

---

**Người tạo**: Auto-refactor  
**Ngày**: 2026-03-19  
**Trạng thái**: ✅ Ready for development
