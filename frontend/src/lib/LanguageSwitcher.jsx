import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Lấy ngôn ngữ hiện tại trực tiếp từ i18n
  // i18next thường trả về 'en-US', ta dùng .split('-')[0] để lấy 'en' cho khớp với resource của bạn
  const currentLang = i18n.language?.split('-')[0] || 'vn';

  const changeLanguage = async (lng) => {
    console.log('Requesting change to:', lng);
    await i18n.changeLanguage(lng);
    // Sau khi change, i18next sẽ tự kích hoạt re-render cho useTranslation
  };

  return (
    <div className="language-switcher">
      <button
        className={`btn btn-sm ${currentLang === 'vn' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
        onClick={() => changeLanguage('vn')}
      >
        VN
      </button>
      <button
        className={`btn btn-sm ${currentLang === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;