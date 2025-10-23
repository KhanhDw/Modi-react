import { useLanguage } from "@/contexts/LanguageContext";

// Component Điều khoản Sử dụng
const TermsOfServicePage = () => {
  const { t } = useLanguage();

  // Để dễ dàng truy cập, chúng ta có thể tạo một mảng từ JSON
  // Lưu ý: t('...', { returnObjects: true }) là một mẫu phổ biến với các thư viện như i18next
  // Ở đây, chúng ta giả định 't' có thể trả về mảng/đối tượng nếu key trỏ đến chúng.
  const otherItems =
    t("TermsOfServicePage.sections.otherItems", { returnObjects: true }) || [];
  const registrationItems =
    t("TermsOfServicePage.sections.membershipRegistration.items", {
      returnObjects: true,
    }) || [];
  const prohibitionItems =
    t("TermsOfServicePage.sections.prohibitions.items", {
      returnObjects: true,
    }) || [];

  return (
    // Nền chính của trang, sử dụng màu slate tối và font chữ mặc định
    <div className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-300 font-sans min-h-screen p-4 sm:p-6 md:p-8">
      {/* Container chính cho nội dung, căn giữa và có chiều rộng tối đa */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        {/* Tiêu đề chính */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            {t("TermsOfServicePage.header.title")}
          </h1>
          <p className="text-slate-400 mt-2">
            {t("TermsOfServicePage.header.lastUpdated")}
          </p>
        </header>

        {/* Phần nội dung chính */}
        <main className="space-y-8">
          {/* Mục 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.generalTerms.title")}
            </h2>
            <p className="leading-relaxed">
              {t("TermsOfServicePage.sections.generalTerms.paragraph1")}
            </p>
            <p className="leading-relaxed mt-4">
              {t("TermsOfServicePage.sections.generalTerms.paragraph2")}
            </p>
          </section>

          {/* Mục 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.ourServices.title")}
            </h2>
            <p className="leading-relaxed">
              {t("TermsOfServicePage.sections.ourServices.content")}
            </p>
          </section>

          {/* Mục 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.yourResponsibilities.title")}
            </h2>
            <p className="leading-relaxed">
              {t("TermsOfServicePage.sections.yourResponsibilities.content")}
            </p>
          </section>

          {/* Mục 4 & 5 trong một grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
                {t("TermsOfServicePage.sections.ageLimit.title")}
              </h2>
              <p className="leading-relaxed">
                {t("TermsOfServicePage.sections.ageLimit.content")}
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
                {t("TermsOfServicePage.sections.contentUsage.title")}
              </h2>
              <p className="leading-relaxed">
                {t("TermsOfServicePage.sections.contentUsage.content")}
              </p>
            </section>
          </div>

          {/* Mục 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.membershipRegistration.title")}
            </h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              {registrationItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Mục 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.memberInfoUpdate.title")}
            </h2>
            <p className="leading-relaxed">
              {t("TermsOfServicePage.sections.memberInfoUpdate.content")}
            </p>
          </section>

          {/* Mục 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
              {t("TermsOfServicePage.sections.prohibitions.title")}
            </h2>
            <p className="leading-relaxed mb-3">
              {t("TermsOfServicePage.sections.prohibitions.intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed bg-white dark:bg-slate-900/50 p-4 rounded-lg">
              {prohibitionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Các mục còn lại */}
          {otherItems.map((item, index) => (
            <section key={index}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-cyan-400 pl-4">
                {item.title}
              </h2>
              <p className="leading-relaxed">{item.content}</p>
            </section>
          ))}
        </main>

        {/* Phần chân trang chứa thông tin liên hệ */}
        <footer className="mt-12 border-t border-slate-700 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t("TermsOfServicePage.footer.title")}
          </h2>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg text-center">
            <p className="font-bold text-lg text-gray-900 dark:text-white">
              {t("TermsOfServicePage.footer.companyName")}
            </p>
            <p className="mt-2">
              <strong>{t("TermsOfServicePage.footer.addressLabel")}</strong>{" "}
              {t("TermsOfServicePage.footer.addressValue")}
            </p>
            <p>
              <strong>{t("TermsOfServicePage.footer.phoneLabel")}</strong>{" "}
              {t("TermsOfServicePage.footer.phoneValue")}
            </p>
            <p>
              <strong>{t("TermsOfServicePage.footer.faxLabel")}</strong>{" "}
              {t("TermsOfServicePage.footer.faxValue")}
            </p>
            <p>
              <strong>{t("TermsOfServicePage.footer.emailLabel")}</strong>{" "}
              {t("TermsOfServicePage.footer.emailValue")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
