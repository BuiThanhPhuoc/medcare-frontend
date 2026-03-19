-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 19, 2026 lúc 09:53 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `medcare_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','checked-in','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status`, `payment_status`, `created_at`) VALUES
(1, 2, 2, '2026-04-15', '08:30:00', 'completed', 'paid', '2026-02-23 07:32:51'),
(2, 3, 2, '2026-04-15', '09:30:00', 'pending', 'unpaid', '2026-02-23 07:42:18'),
(3, 1, 2, '2026-02-27', '18:00:00', 'pending', 'unpaid', '2026-02-26 06:46:21'),
(4, 1, 2, '2026-02-26', '14:00:00', 'pending', 'unpaid', '2026-02-26 06:53:53'),
(5, 1, 2, '2026-02-27', '00:00:00', 'pending', 'unpaid', '2026-02-27 04:35:47'),
(6, 1, 2, '2026-02-27', '12:00:00', 'completed', 'paid', '2026-02-27 04:37:39'),
(7, 6, 2, '2026-02-27', '13:00:00', 'pending', 'unpaid', '2026-02-27 05:20:20'),
(8, 1, 2, '2026-02-27', '12:30:00', 'completed', 'paid', '2026-02-27 05:28:58'),
(9, 1, 2, '2026-03-02', '13:40:00', 'completed', 'paid', '2026-03-02 06:35:24'),
(10, 7, 2, '2026-03-03', '16:43:00', 'pending', 'unpaid', '2026-03-02 06:43:40'),
(11, 3, 2, '2026-03-05', '10:05:00', 'pending', 'unpaid', '2026-03-04 01:05:03'),
(12, 7, 2, '2026-03-05', '11:06:00', 'pending', 'unpaid', '2026-03-04 01:06:28'),
(13, 3, 2, '2026-03-04', '08:10:00', 'completed', 'paid', '2026-03-04 01:08:36'),
(14, 3, 2, '2026-03-05', '12:59:00', 'pending', 'unpaid', '2026-03-04 03:59:33'),
(15, 3, 2, '2026-03-13', '13:18:00', 'pending', 'unpaid', '2026-03-13 02:18:40'),
(16, 3, 8, '2026-03-15', '21:00:00', 'pending', 'unpaid', '2026-03-15 13:40:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Tin tức Y tế', 'tin-tuc-y-te', 'Cập nhật tin tức y tế, dịch bệnh và hoạt động của bệnh viện', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(2, 'Kiến thức Sức khỏe', 'kien-thuc-suc-khoe', 'Bài viết chia sẻ kiến thức phòng và chữa bệnh cơ bản', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(3, 'Dinh dưỡng & Đời sống', 'dinh-duong-doi-song', 'Tư vấn chế độ ăn uống, tập luyện nâng cao sức khỏe', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(4, 'Mẹ & Bé', 'me-va-be', 'Kiến thức chăm sóc thai kỳ, mẹ bầu và sức khỏe trẻ sơ sinh', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(5, 'Bệnh học', 'benh-hoc', 'Từ điển tra cứu chi tiết về các loại bệnh lý', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(6, 'Cẩm nang Dược phẩm', 'cam-nang-duoc-pham', 'Hướng dẫn sử dụng thuốc an toàn và hiệu quả', '2026-03-16 02:50:23', '2026-03-16 02:50:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `experience` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `full_name`, `phone`, `specialty`, `experience`, `description`, `address`, `status`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 8, 'ThS.BS Nguyễn Ngọc Lan', '0988111222', 'Khoa khám bệnh', 0, 'Kinh nghiệm nhiều năm', '12a,đường 34,phường 56,thành phố 78', 'Đang hoạt động', 'http://localhost:5000/uploads/1773579712965-62005960.png', '2026-03-15 13:01:53', '2026-03-15 13:20:49'),
(2, 14, 'ThS.BS Nguyễn Mạnh Hùng', '0328123456', 'Khoa Nội cơ – xương – khớp', 10, '1231323', 'Quận 2, TP.HCM', 'Ngừng hoạt động', 'http://localhost:5000/uploads/1773580903919-595431806.png', '2026-03-15 13:21:32', '2026-03-15 13:21:43'),
(3, 15, 'ThS.BS Trần Thị Phương Anh', '0328741852', 'Khoa Truyền máu', 15, 'Kinh nghiệm nhiều năm trong nghề', 'abcd', 'Active', 'http://localhost:5000/uploads/1773796325339-803079431.png', '2026-03-18 01:12:05', '2026-03-18 01:12:05'),
(4, 16, 'ThS.BS Bùi Thanh Phước', '0898425906', 'Khoa Tai – mũi – họng', 17, 'Chuyên khoa trong lĩnh vực này', '14,đường 15,Thành phố Thủ Đức,Thành phố Hồ Chí Minh', 'Active', 'http://localhost:5000/uploads/1773797578961-31982282.png', '2026-03-18 01:32:59', '2026-03-18 01:32:59'),
(5, 17, 'ThS.BS Lê Nhật Minh', '0328987412', 'Khoa Phụ sản', 0, '123', '963258', 'Active', 'http://localhost:5000/uploads/1773797837178-102947571.png', '2026-03-18 01:37:17', '2026-03-18 01:37:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `shift` varchar(20) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`id`, `doctor_id`, `work_date`, `shift`, `status`, `created_at`) VALUES
(3, 1, '2026-03-23', 'morning', 'approved', '2026-03-17 15:33:37'),
(4, 1, '2026-03-23', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(5, 1, '2026-03-24', 'morning', 'approved', '2026-03-17 15:33:37'),
(6, 1, '2026-03-24', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(7, 1, '2026-03-25', 'morning', 'approved', '2026-03-17 15:33:37'),
(8, 1, '2026-03-25', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(9, 1, '2026-03-26', 'morning', 'approved', '2026-03-17 15:33:37'),
(10, 1, '2026-03-26', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(11, 1, '2026-03-27', 'morning', 'approved', '2026-03-17 15:33:37'),
(12, 1, '2026-03-27', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(13, 1, '2026-03-28', 'morning', 'approved', '2026-03-17 15:33:37'),
(14, 1, '2026-03-28', 'afternoon', 'approved', '2026-03-17 15:33:37'),
(15, 3, '2026-03-23', 'morning', 'approved', '2026-03-18 01:13:40'),
(16, 3, '2026-03-24', 'morning', 'approved', '2026-03-18 01:13:40'),
(17, 3, '2026-03-25', 'morning', 'approved', '2026-03-18 01:13:40'),
(18, 3, '2026-03-26', 'morning', 'approved', '2026-03-18 01:13:40'),
(19, 3, '2026-03-27', 'morning', 'approved', '2026-03-18 01:13:40'),
(20, 3, '2026-03-28', 'morning', 'approved', '2026-03-18 01:13:40'),
(21, 4, '2026-03-23', 'morning', 'pending', '2026-03-18 01:33:49'),
(22, 4, '2026-03-23', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(23, 4, '2026-03-24', 'morning', 'pending', '2026-03-18 01:33:49'),
(24, 4, '2026-03-24', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(25, 4, '2026-03-25', 'morning', 'pending', '2026-03-18 01:33:49'),
(26, 4, '2026-03-25', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(27, 4, '2026-03-26', 'morning', 'pending', '2026-03-18 01:33:49'),
(28, 4, '2026-03-26', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(29, 4, '2026-03-27', 'morning', 'pending', '2026-03-18 01:33:49'),
(30, 4, '2026-03-27', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(31, 4, '2026-03-28', 'morning', 'pending', '2026-03-18 01:33:49'),
(32, 4, '2026-03-28', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(33, 4, '2026-03-30', 'morning', 'pending', '2026-03-18 01:33:49'),
(34, 4, '2026-03-30', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(35, 4, '2026-03-31', 'morning', 'pending', '2026-03-18 01:33:49'),
(36, 4, '2026-03-31', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(37, 4, '2026-04-01', 'morning', 'pending', '2026-03-18 01:33:49'),
(38, 4, '2026-04-01', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(39, 4, '2026-04-02', 'morning', 'pending', '2026-03-18 01:33:49'),
(40, 4, '2026-04-02', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(41, 4, '2026-04-03', 'morning', 'pending', '2026-03-18 01:33:49'),
(42, 4, '2026-04-03', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(43, 4, '2026-04-04', 'morning', 'pending', '2026-03-18 01:33:49'),
(44, 4, '2026-04-04', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(45, 4, '2026-04-06', 'morning', 'pending', '2026-03-18 01:33:49'),
(46, 4, '2026-04-06', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(47, 4, '2026-04-07', 'morning', 'pending', '2026-03-18 01:33:49'),
(48, 4, '2026-04-07', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(49, 4, '2026-04-08', 'morning', 'pending', '2026-03-18 01:33:49'),
(50, 4, '2026-04-08', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(51, 4, '2026-04-09', 'morning', 'pending', '2026-03-18 01:33:49'),
(52, 4, '2026-04-09', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(53, 4, '2026-04-10', 'morning', 'pending', '2026-03-18 01:33:49'),
(54, 4, '2026-04-10', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(55, 4, '2026-04-11', 'morning', 'pending', '2026-03-18 01:33:49'),
(56, 4, '2026-04-11', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(57, 4, '2026-04-13', 'morning', 'pending', '2026-03-18 01:33:49'),
(58, 4, '2026-04-13', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(59, 4, '2026-04-14', 'morning', 'pending', '2026-03-18 01:33:49'),
(60, 4, '2026-04-14', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(61, 4, '2026-04-15', 'morning', 'pending', '2026-03-18 01:33:49'),
(62, 4, '2026-04-15', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(63, 4, '2026-04-16', 'morning', 'pending', '2026-03-18 01:33:49'),
(64, 4, '2026-04-16', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(65, 4, '2026-04-17', 'morning', 'pending', '2026-03-18 01:33:49'),
(66, 4, '2026-04-17', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(67, 4, '2026-04-18', 'morning', 'pending', '2026-03-18 01:33:49'),
(68, 4, '2026-04-18', 'afternoon', 'pending', '2026-03-18 01:33:49'),
(69, 5, '2026-03-23', 'morning', 'pending', '2026-03-18 01:38:21'),
(70, 5, '2026-03-23', 'afternoon', 'pending', '2026-03-18 01:38:21'),
(71, 5, '2026-03-24', 'morning', 'pending', '2026-03-18 01:38:21'),
(72, 5, '2026-03-24', 'afternoon', 'pending', '2026-03-18 01:38:21'),
(73, 5, '2026-03-25', 'morning', 'pending', '2026-03-18 01:38:21'),
(74, 5, '2026-03-26', 'morning', 'pending', '2026-03-18 01:38:21'),
(75, 5, '2026-03-26', 'afternoon', 'pending', '2026-03-18 01:38:21'),
(76, 5, '2026-03-27', 'afternoon', 'pending', '2026-03-18 01:38:21'),
(77, 5, '2026-03-28', 'morning', 'pending', '2026-03-18 01:38:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `diagnosis` text NOT NULL,
  `prescription` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`id`, `appointment_id`, `diagnosis`, `prescription`, `note`, `created_at`) VALUES
(1, 1, 'Viêm họng cấp tính', 'Kháng sinh Amoxicillin 500mg, Paracetamol 500mg', 'Uống nhiều nước ấm, kiêng đồ lạnh', '2026-02-23 07:57:35'),
(2, 6, '1231', '123', '123', '2026-02-27 04:49:18'),
(3, 8, 'Hoooooooooo', 'Paracetamon x 10 viên', '123', '2026-02-27 05:30:16'),
(4, 9, '123', '123', '123', '2026-03-02 06:37:06'),
(5, 13, '123', '123', '123', '2026-03-04 01:09:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `import_price` decimal(10,2) NOT NULL,
  `expiry_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `quantity`, `price`, `import_price`, `expiry_date`, `created_at`) VALUES
(1, 'Paracetamol 500mg', 1000, 2000.00, 500.00, '2028-12-31', '2026-02-26 06:17:03'),
(2, '123', 123, 123.00, 123.00, '2026-04-01', '2026-03-13 02:28:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','transfer','card') DEFAULT 'cash',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `appointment_id`, `total_amount`, `payment_method`, `created_at`) VALUES
(1, 1, 500000.00, 'cash', '2026-02-23 08:02:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `title`, `category_id`, `author_id`, `status`, `excerpt`, `content`, `thumbnail`, `meta_title`, `meta_description`, `published_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '123', 4, NULL, 'published', '123', '123', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvC_belEucQUGeerP5iXbu5IT8Q28bwJDigA&s', '123', '123', '2026-03-16 10:03:00', '2026-03-16 03:03:31', '2026-03-16 03:03:31', NULL),
(2, '321', NULL, NULL, 'draft', '132', '321', 'https://www.youtube.com/watch?v=1XzY2ij_vL4&list=RD1XzY2ij_vL4&start_radio=1', '231', '43531451', '2026-03-15 10:03:00', '2026-03-16 03:04:07', '2026-03-16 03:27:15', NULL),
(3, 'gfga', 6, NULL, 'draft', '434124', '115243', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQArgMBIgACEQEDEQH/', '12334', '341234123', '2026-03-14 10:12:00', '2026-03-16 03:12:51', '2026-03-16 03:22:04', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_tag`
--

CREATE TABLE `post_tag` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `post_tag`
--

INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(3, 2),
(3, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specialties`
--

CREATE TABLE `specialties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `specialties`
--

INSERT INTO `specialties` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Khoa khám bệnh', 'khoa-kham-benh', 'Tổ chức khám bệnh ngoại trú, phân loại và phân luồng bệnh nhân.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(2, 'Khoa Hồi sức cấp cứu', 'khoa-hoi-suc-cap-cuu', 'Tiếp nhận, xử trí và điều trị tích cực các bệnh nhân cấp cứu nặng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(3, 'Khoa Nội tổng hợp', 'khoa-noi-tong-hop', 'Khám và điều trị nội trú các bệnh lý nội khoa chung.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(4, 'Khoa Nội tim mạch', 'khoa-noi-tim-mach', 'Chẩn đoán và điều trị các bệnh lý tim mạch, huyết áp.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(5, 'Khoa Nội tiêu hóa', 'khoa-noi-tieu-hoa', 'Điều trị các bệnh lý liên quan đến dạ dày, ruột, gan, mật.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(6, 'Khoa Nội cơ – xương – khớp', 'khoa-noi-co-xuong-khop', 'Chẩn đoán và điều trị các bệnh lý về hệ cơ, xương và khớp.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(7, 'Khoa Nội thận – tiết niệu', 'khoa-noi-than-tiet-nieu', 'Điều trị bệnh lý về thận và đường tiết niệu nội khoa.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(8, 'Khoa Nội tiết', 'khoa-noi-tiet', 'Khám và điều trị bệnh đái tháo đường, tuyến giáp và các bệnh nội tiết khác.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(9, 'Khoa Dị ứng', 'khoa-di-ung', 'Chẩn đoán và điều trị các bệnh lý dị ứng, miễn dịch lâm sàng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(10, 'Khoa Huyết Học lâm sàng', 'khoa-huyet-hoc-lam-sang', 'Điều trị các bệnh lý liên quan đến máu và cơ quan tạo máu.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(11, 'Khoa Truyền nhiễm', 'khoa-truyen-nhiem', 'Cách ly, chẩn đoán và điều trị các bệnh do vi sinh vật lây truyền.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(12, 'Khoa Lao', 'khoa-lao', 'Chẩn đoán, điều trị và quản lý các bệnh nhân lao phổi, lao ngoài phổi.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(13, 'Khoa Da Liễu', 'khoa-da-lieu', 'Khám và điều trị các bệnh lý về da, lông, tóc, móng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(14, 'Khoa Thần kinh', 'khoa-than-kinh', 'Điều trị các bệnh lý thuộc hệ thần kinh trung ương và ngoại biên.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(15, 'Khoa Tâm thần', 'khoa-tam-than', 'Khám, tư vấn và điều trị các rối loạn tâm lý, tâm thần.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(16, 'Khoa Y học cổ truyền', 'khoa-y-hoc-co-truyen', 'Khám chữa bệnh bằng thuốc Đông y, châm cứu, xoa bóp bấm huyệt.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(17, 'Khoa Lão học', 'khoa-lao-hoc', 'Chăm sóc sức khỏe, điều trị bệnh lý đặc thù cho người cao tuổi.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(18, 'Khoa Nhi', 'khoa-nhi', 'Khám, điều trị và chăm sóc sức khỏe toàn diện cho trẻ em.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(19, 'Khoa Ngoại tổng hợp', 'khoa-ngoai-tong-hop', 'Khám và phẫu thuật điều trị các bệnh lý ngoại khoa chung.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(20, 'Khoa Ngoại thần kinh', 'khoa-ngoai-than-kinh', 'Phẫu thuật điều trị các chấn thương và bệnh lý sọ não, cột sống.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(21, 'Khoa Ngoại lồng ngực', 'khoa-ngoai-long-nguc', 'Phẫu thuật các bệnh lý lồng ngực, phổi và tim mạch ngoại khoa.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(22, 'Khoa Ngoại tiêu hóa', 'khoa-ngoai-tieu-hoa', 'Phẫu thuật ống tiêu hóa, gan, mật, tụy.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(23, 'Khoa Ngoại thận – tiết niệu', 'khoa-ngoai-than-tiet-nieu', 'Phẫu thuật các bệnh lý đường tiết niệu và cơ quan sinh dục nam.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(24, 'Khoa Chấn thương chỉnh hình', 'khoa-chan-thuong-chinh-hinh', 'Xử trí, phẫu thuật chấn thương và phục hồi dị tật xương khớp.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(25, 'Khoa Bỏng', 'khoa-bong', 'Cấp cứu, điều trị, phẫu thuật tạo hình và phục hồi tổn thương do bỏng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(26, 'Khoa Phẫu thuật gây mê hồi sức', 'khoa-phau-thuat-gay-me-hoi-suc', 'Thực hiện công tác vô cảm, gây mê và hồi sức trước, trong, sau phẫu thuật.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(27, 'Khoa Phụ sản', 'khoa-phu-san', 'Chăm sóc thai kỳ, đỡ đẻ và điều trị các bệnh lý phụ khoa.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(28, 'Khoa Tai – mũi – họng', 'khoa-tai-mui-hong', 'Khám, nội soi và điều trị các bệnh lý vùng tai, mũi, họng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(29, 'Khoa Răng – hàm – mặt', 'khoa-rang-ham-mat', 'Chăm sóc sức khỏe răng miệng, nha khoa thẩm mỹ và phẫu thuật hàm mặt.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(30, 'Khoa mắt', 'khoa-mat', 'Khám đo thị lực, chẩn đoán và phẫu thuật các bệnh lý về mắt.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(31, 'Khoa Vật lý trị liệu', 'khoa-vat-ly-tri-lieu', 'Tập luyện vật lý trị liệu, phục hồi chức năng vận động cho bệnh nhân.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(32, 'Khoa Y học hạt nhân', 'khoa-y-hoc-hat-nhan', 'Ứng dụng đồng vị phóng xạ trong chẩn đoán hình ảnh và điều trị ung bướu.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(33, 'Khoa Truyền máu', 'khoa-truyen-mau', 'Tiếp nhận, sàng lọc, lưu trữ và cung cấp chế phẩm máu an toàn.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(34, 'Khoa Lọc máu (thận nhân tạo)', 'khoa-loc-mau', 'Thực hiện lọc máu, chạy thận nhân tạo chu kỳ cho bệnh nhân suy thận.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(35, 'Khoa Huyết học', 'khoa-huyet-hoc', 'Khoa cận lâm sàng thực hiện các xét nghiệm chuyên sâu về tế bào máu.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(36, 'Khoa Hóa Sinh', 'khoa-hoa-sinh', 'Khoa cận lâm sàng phân tích các chỉ số hóa sinh trong máu, dịch cơ thể.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(37, 'Khoa Vi sinh', 'khoa-vi-sinh', 'Khoa cận lâm sàng nuôi cấy, phân lập vi sinh vật và làm kháng sinh đồ.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(38, 'Khoa Chẩn đoán hình ảnh', 'khoa-chan-doan-hinh-anh', 'Thực hiện siêu âm, chụp X-quang, CT Scanner, MRI phục vụ lâm sàng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(39, 'Khoa Thăm dò chức năng', 'khoa-tham-do-chuc-nang', 'Thực hiện điện tâm đồ, điện não đồ, hô hấp ký và các đo lường chức năng.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(40, 'Khoa Nội soi', 'khoa-noi-soi', 'Thực hiện các thủ thuật nội soi tiêu hóa, hô hấp để chẩn đoán và can thiệp.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(41, 'Khoa Giải phẫu bệnh', 'khoa-giai-phau-benh', 'Xét nghiệm tế bào học, mô bệnh học nhằm chẩn đoán bản chất khối u.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(42, 'Khoa Chống nhiễm khuẩn', 'khoa-chong-nhiem-khuan', 'Giám sát, quản lý và phòng ngừa nhiễm khuẩn trong toàn bộ bệnh viện.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(43, 'Khoa Dược', 'khoa-duoc', 'Cung ứng, quản lý, pha chế thuốc và tư vấn thông tin sử dụng thuốc.', '2026-03-14 02:55:40', '2026-03-14 02:55:40'),
(44, 'Khoa Dinh dưỡng', 'khoa-dinh-duong', 'Xây dựng khẩu phần ăn, tư vấn và cung cấp chế độ dinh dưỡng bệnh lý.', '2026-03-14 02:55:40', '2026-03-14 02:55:40');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Covid-19', 'covid-19', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(2, 'Tim mạch', 'tim-mach', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(3, 'Tiểu đường', 'tieu-duong', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(4, 'Dinh dưỡng', 'dinh-duong', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(5, 'Ung thư', 'ung-thu', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(6, 'Tiêm chủng', 'tiem-chung', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(7, 'Nhi khoa', 'nhi-khoa', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(8, 'Làm đẹp', 'lam-dep', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(9, 'Sức khỏe tâm thần', 'suc-khoe-tam-than', '2026-03-16 02:50:23', '2026-03-16 02:50:23'),
(10, 'Xương khớp', 'xuong-khop', '2026-03-16 02:50:23', '2026-03-16 02:50:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('patient','doctor','receptionist','admin') DEFAULT 'patient',
  `is_locked` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_first_login` tinyint(1) DEFAULT 1,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `phone`, `email`, `password`, `role`, `is_locked`, `created_at`, `is_first_login`, `status`) VALUES
(1, 'phuocbui', '0912345678', 'phuoc@gmail.com', '$2b$10$.brzMsRAFKax3CtyzLMYOuvNjGvlUZ9OWoV7FgQrFrX.6Yz9cgSBO', 'patient', 0, '2026-02-23 07:09:19', 1, 'active'),
(2, 'bacsitest', '0988888888', 'bacsi@gmail.com', '$2b$10$NSTF5VMIW0s7JWE9MtXfk.32bDsMCFI0WrtEYJdEk1V58TMoVBcRK', 'doctor', 0, '2026-02-23 07:30:36', 1, 'active'),
(3, 'ThanhPhuoc', '0911111111', 'buiphuoc010123@gmail.com', '$2b$10$GPKf5UmyEhKs5xRj9wSqNOj2qs5G.BthcZ3ifpmC38isENZFMpM/G', 'patient', 0, '2026-02-23 07:41:42', 0, 'active'),
(4, 'letan1', '0922113344', 'letan@gmail.com', '$2b$10$6YifNQ8J9KQ2EC7bEYzBeuiKofnd5e7FYNhzJe4zvOxPRztEkXjCi', 'receptionist', 0, '2026-02-23 07:51:28', 0, 'active'),
(5, 'admin', '0322222222', 'admin@gmail.com', '$2b$10$O1wEpgagEWkCR1lFxzrszOXbR8edjtwrGp.qs0N5Nrae5xwLyBkPS', 'admin', 0, '2026-02-26 06:02:38', 0, 'active'),
(6, 'patient', '0312345678', 'patient1@gmail.com', '$2b$10$bRrjNCKGzcq1y6rTvmmreOk/lSeYtU0aN2OvfVwXx9HNhoKqRPGLm', 'patient', 0, '2026-02-27 05:19:17', 1, 'active'),
(7, 'Thanh', '0974185296', 'tn822798@gmail.com', '$2b$10$qP3JuZKVVby5MUBhr8qUGuKsDgk41WFg2vIDP/s8Yrbg6X4T6dJeC', 'patient', 0, '2026-03-02 06:42:37', 1, 'active'),
(8, 'NguyenNgocLan', '0988111222', 'nguyenngoclan@gmail.com', '$2b$10$/xFtts6LdwuLbYZ/9sugiudkXrYN5Md/j8H7awU/SIdp0hYWz3vey', 'doctor', 0, '2026-03-15 13:01:53', 0, 'active'),
(14, 'NguyenManhHung', '0328123456', 'nguyenmanhhung@gmail.com', '$2b$10$Wl0r/6hR9Fl011ytJFikqep3f86Bdm5ch8cFczkwny1kl20zTVy3y', 'doctor', 0, '2026-03-15 13:21:32', 0, 'inactive'),
(15, 'TranThiPhuongAnh', '0328741852', 'tranthiphuonganh@gmail.com', '$2b$10$xF94bLpLYNx8v5YxXCPEpu13A2ii6WOiCZ57dvpm85ct0csD.XUX2', 'doctor', 0, '2026-03-18 01:12:05', 0, 'active'),
(16, 'buithanhphuoc', '0898425906', 'btp@gmail.com', '$2b$10$XbdsMSzJTaXzRlVtUxXiUuLDMqqu4t1NfH0TrdOZxQD0EfsZB360e', 'doctor', 0, '2026-03-18 01:32:59', 0, 'active'),
(17, 'LeNhatMinh', '0328987412', 'lenhatminh@gmail.com', '$2b$10$c0hhsmamCJkT47rwS39jPuZ.jK0jWUWsSY9EnINkGZz.luIXHrPam', 'doctor', 0, '2026-03-18 01:37:17', 0, 'active');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Chỉ mục cho bảng `post_tag`
--
ALTER TABLE `post_tag`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `specialties`
--
ALTER TABLE `specialties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `specialties`
--
ALTER TABLE `specialties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `post_tag`
--
ALTER TABLE `post_tag`
  ADD CONSTRAINT `post_tag_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
