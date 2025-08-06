import slugify from "./slug";
import { useLanguage } from "../contexts/LanguageContext";


export default function getServiceBySlug(slug) {
    const { t } = useLanguage();

    if (!slug) {
        return ''; // Trả về "" nếu không có slug
    } else {

        const serviceKeys = [
            "stage1.0.title",
            "stage1.1.title",
            "stage2.0.title",
            "stage2.1.title",
            "stage2.2.title",
            "stage3.0.title",
            "stage3.1.title",
            "stage3.2.title",
            "footer.button"
        ];

        const listServices = serviceKeys.map(key => {
            const name = t(`home.PricingPage.${key}`);
            return { name, slug: slugify(name) };
        });

        return listServices.find(service => service.slug === slug);
    }
}
