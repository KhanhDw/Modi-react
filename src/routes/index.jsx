import { lazy } from "react";
import {
  DefaultLayout,
  NoneHeaderFooterLayout,
  AdminLayout,
} from "@/components/layout";
import { Navigate } from "react-router-dom";

// Public pages
const Home = lazy(() => import("@/pages/homePage"));
const About = lazy(() => import("@/pages/aboutMePage"));
const Services = lazy(() => import("@/pages/servicesPage"));
const News = lazy(() => import("@/pages/news/newsPage"));
const Contact = lazy(() => import("@/pages/contactPage"));
const MarketingOutlet = lazy(() => import("@/pages/marketingPage"));
const ArticleDetail = lazy(() => import("@/pages/marketing/article-detail"));
const Marketing = lazy(() => import("@/pages/marketing/marketing-list_page"));
const Recruitment = lazy(() => import("@/pages/recruitmentPage"));
const NotFound = lazy(() => import("@/pages/NotFoundPage"));
const ServiceDetailPage = lazy(() => import("@/pages/serviceDetailPage"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Products = lazy(() => import("@/pages/Products"));
const NewsDetail = lazy(() => import("@/pages/news/NewsDetail"));
const AdminLoginPage = lazy(() => import("@/pages/managers/AdminLoginPage"));

// Admin pages
const ManagerDashboard = lazy(() => import("@/pages/managers/DashboardPage"));
const ManagerBlogs = lazy(() => import("@/pages/managers/BlogsPage"));
const BlogsListPage = lazy(() => import("@/components/admin/blogs/blogList"));
const BlogViewPage = lazy(() => import("@/components/admin/blogs/blogView"));
const BlogsNewPage = lazy(() => import("@/components/admin/blogs/blogNew"));
const ManagerRecruitment = lazy(() =>
  import("@/pages/managers/RecruitmentPage")
);
const ManagerContact = lazy(() => import("@/pages/managers/ContactPage"));
const AllComponentsPageAdmin = lazy(() =>
  import("@/pages/managers/AllComponent")
);

// Config pages
const ConfigPage = lazy(() => import("@/pages/managers/ConfigPage"));
const AboutConfig = lazy(() =>
  import("@/pages/managers/ConfigPage/AboutConfig")
);
const HomeConfig = lazy(() => import("@/pages/managers/ConfigPage/HomeConfig"));
const HeaderConfig = lazy(() =>
  import("@/pages/managers/ConfigPage/HeaderConfig")
);
const FooterConfig = lazy(() =>
  import("@/pages/managers/ConfigPage/FooterConfig")
);
const ContactConfig = lazy(() =>
  import("@/pages/managers/ConfigPage/ContactConfig")
);

// Service manager
const ServicesPage = lazy(() => import("@/pages/managers/ServicesPage"));
const ServiceOverview = lazy(() =>
  import("@/pages/managers/service/ServiceOverview")
);
const ServiceList = lazy(() => import("@/pages/managers/service/ServiceList"));
const ServiceBooking = lazy(() =>
  import("@/pages/managers/service/ServiceBookings")
);
const ServiceCustomer = lazy(() =>
  import("@/pages/managers/service/ServiceCustomers")
);

// Admin zone
const AdminZonePage = lazy(() => import("@/pages/managers/AdminZonePage"));
const ProfilePage = lazy(() => import("@/pages/managers/ProfilePage"));

// Website templates
const WebsiteTemplatePage = lazy(() =>
  import("@/pages/managers/WebsiteTemplatePage")
);
const WebsiteTemplateList = lazy(() =>
  import("@/components/admin/listWebDesign/ListWebsite")
);
const WebsiteTemplateDetail = lazy(() =>
  import("@/components/admin/listWebDesign/DetailWebsite")
);
const WebsiteTemplateEdit = lazy(() =>
  import("@/components/admin/listWebDesign/EditWebsite")
);

// Marketing manager
const MarketingPage = lazy(() => import("@/pages/managers/MarketingPage"));
const ListPage = lazy(() => import("@/pages/managers/MarketingPage/ListPage"));
const AddPage = lazy(() => import("@/pages/managers/MarketingPage/AddPage"));
const EditPage = lazy(() => import("@/pages/managers/MarketingPage/EditPage"));
const ViewPage = lazy(() => import("@/pages/managers/MarketingPage/ViewPage"));

// Terms
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));

// Admin components
const ChartAreaGradient = lazy(() =>
  import("@/components/adminComponent/chart")
);
const TopSellingProducts = lazy(() =>
  import("@/components/adminComponent/TopSellingProducts")
);
const BuyersProfile = lazy(() =>
  import("@/components/adminComponent/BuyersProfile")
);
const CarStatistics = lazy(() =>
  import("@/components/adminComponent/CarStatistics")
);
const CheckRadioSwitch = lazy(() =>
  import("@/components/adminComponent/CheckRadioSwitch")
);
const DefaultInputs = lazy(() =>
  import("@/components/adminComponent/DefaultInputs")
);
const Dropzone = lazy(() => import("@/components/adminComponent/Dropzone"));
const ForgotPassword = lazy(() =>
  import("@/components/adminComponent/ForgotPassword")
);
const LatestTransactions = lazy(() =>
  import("@/components/adminComponent/LatestTransactions")
);
const Login = lazy(() => import("@/components/adminComponent/Login"));
const SignIn = lazy(() => import("@/components/adminComponent/SignIn"));
const MilesStatistics = lazy(() =>
  import("@/components/adminComponent/MilesStatistics")
);
const NewCustomersDropdown = lazy(() =>
  import("@/components/adminComponent/NewCustomersDropdown")
);
const RecentOrders = lazy(() =>
  import("@/components/adminComponent/RecentOrders")
);
const ReminderTable = lazy(() =>
  import("@/components/adminComponent/ReminderTable")
);
const ResetPassword = lazy(() =>
  import("@/components/adminComponent/ResetPassword")
);
const RevenueChart = lazy(() =>
  import("@/components/adminComponent/RevenueChart")
);
const SelectInputs = lazy(() =>
  import("@/components/adminComponent/SelectInputs")
);
const Signup = lazy(() => import("@/components/adminComponent/Signup"));
const SignUp1 = lazy(() => import("@/components/adminComponent/SignUp1"));
const TodaySales = lazy(() => import("@/components/adminComponent/TodaySales"));
const TopProducts = lazy(() =>
  import("@/components/adminComponent/TopProducts")
);
const TotalRevenueChart = lazy(() =>
  import("@/components/adminComponent/TotalRevenueChart")
);
const VisitorInsights = lazy(() =>
  import("@/components/adminComponent/VisitorInsights")
);
const WebsiteVisitorsDonut = lazy(() =>
  import("@/components/adminComponent/WebsiteVisitorsDonut")
);
const TaskList = lazy(() => import("@/components/adminComponent/TaskList"));
const ReaderDetailService = lazy(() =>
  import("@/components/admin/services/ReadDetailService")
);

const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/about", component: About, layout: DefaultLayout },
  { path: "/services", component: Services, layout: DefaultLayout },
  { path: "/services/:parentSlug", component: Services, layout: DefaultLayout },
  {
    path: "/services/:parentSlug/:slug",
    component: ServiceDetailPage,
    layout: DefaultLayout,
  },
  {
    path: "/services/detail/:slug",
    component: ServiceDetailPage,
    layout: DefaultLayout,
  },
  {
    path: "/marketing",
    component: MarketingOutlet,
    layout: DefaultLayout,
    children: [
      { path: "", component: Marketing, layout: DefaultLayout },
      { path: ":slug", component: ArticleDetail, layout: DefaultLayout },
    ],
  },
  { path: "/news", component: News, layout: DefaultLayout },
  { path: "/news/:slug", component: NewsDetail, layout: DefaultLayout },
  { path: "/contact", component: Contact, layout: DefaultLayout },
  { path: "/careers", component: Recruitment, layout: DefaultLayout },
  {
    path: "/terms-of-services",
    component: TermsOfServicePage,
    layout: DefaultLayout,
  },
  { path: "/login", component: AdminLoginPage, layout: NoneHeaderFooterLayout },
  { path: "*", component: NotFound, layout: NoneHeaderFooterLayout },
  { path: "/Products", component: Products, layout: DefaultLayout },
  { path: "/Products/:id", component: ProductDetail, layout: DefaultLayout },
];

const privateRoutes = [
  {
    path: "/managers",
    component: () => (
      <Navigate
        to="/managers/dashboard"
        replace={true}
      />
    ),
  },

  //admin routes
  {
    path: "/managers/dashboard",
    component: ManagerDashboard,
    layout: AdminLayout,
  },
  {
    path: "/managers/page-config",
    component: ConfigPage,
    layout: AdminLayout,
    children: [
      { path: "header", component: HeaderConfig, layout: AdminLayout },
      { path: "footer", component: FooterConfig, layout: AdminLayout },
      { path: "home", component: HomeConfig, layout: AdminLayout },
      { path: "about", component: AboutConfig, layout: AdminLayout },
      { path: "contact", component: ContactConfig, layout: AdminLayout },
    ],
  },
  {
    path: "/managers/marketing",
    component: MarketingPage,
    layout: AdminLayout,
    children: [
      { path: "", component: ListPage },
      { path: "add", component: AddPage },
      { path: ":id/view", component: ViewPage },
      { path: ":id/edit", component: EditPage },
    ],
  },
  //Service
  {
    path: "/managers/services",
    component: ServicesPage,
    layout: AdminLayout,
    children: [
      { path: "service_overview", component: ServiceOverview },
      { path: "service_list", component: ServiceList },
      { path: "service_booking", component: ServiceBooking },
      { path: "service_customer", component: ServiceCustomer },
      { path: "read-detail/:slug", component: ReaderDetailService },
    ],
  },
  {
    path: "/managers/news",
    component: ManagerBlogs,
    layout: AdminLayout,
    children: [
      { path: "", component: BlogsListPage },
      { path: "new", component: BlogsNewPage },
      { path: ":id/view", component: BlogViewPage },
      { path: ":id/edit", component: BlogsNewPage },
    ],
  },
  {
    path: "/managers/recruitment",
    component: ManagerRecruitment,
    layout: AdminLayout,
  },
  { path: "/managers/contact", component: ManagerContact, layout: AdminLayout },
  {
    path: "/managers/components",
    component: AllComponentsPageAdmin,
    layout: AdminLayout,
  },

  {
    path: "/managers/admin-zone",
    component: AdminZonePage,
    layout: AdminLayout,
  },
  { path: "/managers/profile", component: ProfilePage, layout: AdminLayout },
  {
    path: "/managers/website-templates",
    component: WebsiteTemplatePage,
    layout: AdminLayout,
    children: [
      { path: "", component: WebsiteTemplateList },
      { path: "new", component: WebsiteTemplateEdit },
      { path: ":id", component: WebsiteTemplateDetail },
      { path: ":id/edit", component: WebsiteTemplateEdit },
    ],
  },

  // admin components
  {
    path: "/managers/components/chart",
    component: ChartAreaGradient,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/topsellingproducts",
    component: TopSellingProducts,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/BuyersProfile",
    component: BuyersProfile,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/CarStatistics",
    component: CarStatistics,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/CheckRadioSwitch",
    component: CheckRadioSwitch,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/DefaultInputs",
    component: DefaultInputs,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/Dropzone",
    component: Dropzone,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ForgotPassword",
    component: ForgotPassword,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/LatestTransactions",
    component: LatestTransactions,
    layout: AdminLayout,
  },
  { path: "/managers/components/Login", component: Login, layout: AdminLayout },
  {
    path: "/managers/components/SignIn",
    component: SignIn,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/MilesStatistics",
    component: MilesStatistics,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/NewCustomersDropdown",
    component: NewCustomersDropdown,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/RecentOrders",
    component: RecentOrders,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ReminderTable",
    component: ReminderTable,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ResetPassword",
    component: ResetPassword,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/RevenueChart",
    component: RevenueChart,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/SelectInputs",
    component: SelectInputs,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/Signup",
    component: Signup,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/SignUp1",
    component: SignUp1,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TodaySales",
    component: TodaySales,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TopProducts",
    component: TopProducts,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TotalRevenueChart",
    component: TotalRevenueChart,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/VisitorInsights",
    component: VisitorInsights,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/WebsiteVisitorsDonut",
    component: WebsiteVisitorsDonut,
    layout: AdminLayout,
  },
  {
    path: "/managers/components/tacklist",
    component: TaskList,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };
