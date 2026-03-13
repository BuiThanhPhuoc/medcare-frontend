# 🖼️ Images Folder

Nơi lưu trữ tất cả hình ảnh của ứng dụng MedCare:

## Cấu trúc đề xuất:

```
images/
├── logos/               # Logo phòng khám, brand
│   ├── logo.png
│   ├── logo-white.png
│   └── favicon.ico
├── doctors/             # Hình ảnh bác sĩ
│   └── doctor-avatar.jpg
├── patients/            # Hình ảnh bệnh nhân
│   └── patient-avatar.jpg
├── icons/               # Icons tùy chỉnh (nếu không dùng FontAwesome)
│   ├── appointment.svg
│   ├── medical-history.svg
│   └── medicine.svg
├── banners/             # Banner & Hero Images
│   ├── home-hero.jpg
│   ├── about.jpg
│   └── services.jpg
├── illustrations/       # Hình minh họa SVG
│   ├── empty-state.svg
│   └── success.svg
└── screenshots/         # Screenshots cho documentation
    └── demo.png
```

### Cách import hình ảnh trong React:

```jsx
// Trong Component:
import doctorImage from '../assets/images/doctors/doctor-avatar.jpg';

// Dùng trong JSX:
<img src={doctorImage} alt="Doctor" />

// Hoặc dùng path trực tiếp:
<img src="/src/assets/images/doctors/doctor-avatar.jpg" alt="Doctor" />
```

### Lưu ý:
- Nén hình ảnh trước khi upload để giảm kích thước (dùng TinyPNG, ImageOptim)
- Dùng định dạng phù hợp:
  - **JPG**: Hình ảnh chụp thực tế
  - **PNG**: Logo, Icons (có nền trong suốt)
  - **SVG**: Icons, Illustrations (có kích thước)
  - **WebP**: Tương lai, kích thước nhỏ hơn
