import {
  DefaultLayout,
  HeaderOnlyLayout,
  NoneHeaderFooterLayout,
  AdminLayout,
} from "@/components/layout";
import { Navigate } from "react-router-dom";

import Home from "@/pages/homePage"
import About from "@/pages/aboutMePage"
import Services from "@/pages/servicesPage"
import News from '@/pages/news/newsPage'
import Contact from '@/pages/contactPage'
import Recruitment from '@/pages/recruitmentPage'
import NotFound from '@/pages/NotFoundPage'
import ServiceDetailPage from "@/pages/serviceDetailPage"
import ProductDetail from "@/pages/ProductDetail"
import Products from "@/pages/Products"



import AdminLoginPage from '@/pages/managers/AdminLoginPage'
import NewsDetail from '@/pages/news/NewsDetail'

//admin dashboard
import ManagerDashboard from "@/pages/managers/DashboardPage"
//admin services
import ManagerServices from "@/pages/managers/ServicesPage"
//admin blogs
import ManagerBlogs from "@/pages/managers/BlogsPage"
import BlogsListPage from "@/components/admin/blogs/blogList"
import BlogViewPage from "@/components/admin/blogs/blogView"
import BlogsNewPage from "@/components/admin/blogs/blogNew"

//admin 
import ManagerRecruitment from "@/pages/managers/RecruitmentPage"

//admin 
import ManagerContact from "@/pages/managers/ContactPage"

//admin 
import AllComponentsPageAdmin from "@/pages/managers/AllComponent"

//admin 
import ConfigPage from "@/pages/managers/ConfigPage"
import AboutConfig from "@/pages/managers/ConfigPage/AboutConfig"
import HomeConfig from "@/pages/managers/ConfigPage/HomeConfig"
import HeaderConfig from "@/pages/managers/ConfigPage/HeaderConfig"
import FooterConfig from "@/pages/managers/ConfigPage/FooterConfig"
import OverviewPageConfig from "@/pages/managers/ConfigPage/OverviewPageConfig"


//manager service
import ServicesPage from "../pages/managers/ServicesPage";
import ServiceOverview from "../pages/managers/service/ServiceOverview";
import ServiceList from "../pages/managers/service/ServiceList";
import ServiceBooking from "@/pages/managers/service/ServiceBookings";
import ServiceCustomer from "@/pages/managers/service/ServiceCustomers";
// import ServiceReview from "@/pages/managers/service/ServiceReviews";


import AdminZonePage from "@/pages/managers/AdminZonePage"
import ProfilePage from "@/pages/managers/ProfilePage"

//admin 
import WebsiteTemplatePage from "@/pages/managers/WebsiteTemplatePage"
import WebsiteTemplateList from "@/components/admin/listWebDesign/ListWebsite"
import WebsiteTemplateDetail from "@/components/admin/listWebDesign/DetailWebsite";
import WebsiteTemplateEdit from "@/components/admin/listWebDesign/EditWebsite";

//admin 
import MarketingPage from "@/pages/managers/MarketingPage"
import ListPage from "@/pages/managers/MarketingPage/ListPage"
import AddPage from "@/pages/managers/MarketingPage/AddPage"
import EditPage from "@/pages/managers/MarketingPage/EditPage"
import ViewPage from "@/pages/managers/MarketingPage/ViewPage"
// import OverviewPage from "@/components/admin/marketing/OverviewPage"
// import CampaignsPage from "@/components/admin/marketing/CampaignsPage"
// import EmailPage from "@/components/admin/marketing/EmailPage"
// import SEOPage from "@/components/admin/marketing/SEOPage"
// import SocialPage from "@/components/admin/marketing/SocialPage"

//admin 
import TermsOfServicePage from "@/pages/TermsOfServicePage"


// tất cả components
import ChartAreaGradient from "@/components/adminComponent/chart"
import TopSellingProducts from "@/components/adminComponent/TopSellingProducts"
import BuyersProfile from "@/components/adminComponent/BuyersProfile"
import CarStatistics from "@/components/adminComponent/CarStatistics"
import CheckRadioSwitch from "@/components/adminComponent/CheckRadioSwitch"
import DefaultInputs from "@/components/adminComponent/DefaultInputs"
import Dropzone from "@/components/adminComponent/Dropzone"
import ForgotPassword from "@/components/adminComponent/ForgotPassword"
import LatestTransactions from "@/components/adminComponent/LatestTransactions"
import Login from "@/components/adminComponent/Login"
import SignIn from "@/components/adminComponent/SignIn"
import MilesStatistics from "@/components/adminComponent/MilesStatistics"
import NewCustomersDropdown from "@/components/adminComponent/NewCustomersDropdown"
import RecentOrders from "@/components/adminComponent/RecentOrders"
import ReminderTable from "@/components/adminComponent/ReminderTable"
import ResetPassword from "@/components/adminComponent/ResetPassword"
import RevenueChart from "@/components/adminComponent/RevenueChart"
import SelectInputs from "@/components/adminComponent/SelectInputs"
import Signup from "@/components/adminComponent/Signup"
import SignUp1 from "@/components/adminComponent/SignUp1"
import TodaySales from "@/components/adminComponent/TodaySales"
import TopProducts from "@/components/adminComponent/TopProducts"
import TotalRevenueChart from "@/components/adminComponent/TotalRevenueChart"
import VisitorInsights from "@/components/adminComponent/VisitorInsights"
import WebsiteVisitorsDonut from "@/components/adminComponent/WebsiteVisitorsDonut"
import TaskList from "@/components/adminComponent/TaskList"




const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/about", component: About, layout: DefaultLayout },
  { path: "/services", component: Services, layout: DefaultLayout },
  { path: "/services/:slug", component: ServiceDetailPage, layout: DefaultLayout },
  { path: "/news", component: News, layout: DefaultLayout },
  { path: "/news/:slug", component: NewsDetail, layout: DefaultLayout },
  { path: "/contact", component: Contact, layout: DefaultLayout },
  { path: "/careers", component: Recruitment, layout: DefaultLayout },
  { path: "/terms-of-services", component: TermsOfServicePage, layout: DefaultLayout },
  { path: "/login", component: AdminLoginPage, layout: NoneHeaderFooterLayout },
  { path: "*", component: NotFound, layout: NoneHeaderFooterLayout },
  { path: "/Products", component: Products, layout: DefaultLayout },
  { path: "/Products/:id", component: ProductDetail, layout: DefaultLayout },
]

const privateRoutes = [
  // redirect /managers -> /managers/dashboard
  { path: "/managers", component: () => <Navigate to="/managers/dashboard" replace={true} /> },

  //admin routes
  { path: "/managers/dashboard", component: ManagerDashboard, layout: AdminLayout },
  {
    path: "/managers/page-config", component: ConfigPage, layout: AdminLayout,
    children: [
      { path: "", component: OverviewPageConfig, layout: AdminLayout },
      { path: "header", component: HeaderConfig, layout: AdminLayout },
      { path: "footer", component: FooterConfig, layout: AdminLayout },
      { path: "home", component: HomeConfig, layout: AdminLayout },
      { path: "about", component: AboutConfig, layout: AdminLayout },
    ]
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
    // children: [
    //     { path: "overview", component: OverviewPage },
    //     { path: "campaigns", component: CampaignsPage },
    //     { path: "seo", component: SEOPage },
    //     { path: "social", component: SocialPage },
    //     { path: "email", component: EmailPage },
    // ],
  },
  // { path: "/managers/services", component: ManagerServices, layout: AdminLayout },
  //Service
  {
    path: "/managers/services",
    component: ServicesPage,
    layout: AdminLayout,
    children: [
      { index: true, component: ServiceOverview },
      { path: "service_overview", component: ServiceOverview },
      { path: "service_list", component: ServiceList },
      { path: "service_booking", component: ServiceBooking },
      { path: "service_customer", component: ServiceCustomer },
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
    ]
  },
  { path: "/managers/recruitment", component: ManagerRecruitment, layout: AdminLayout },
  { path: "/managers/contact", component: ManagerContact, layout: AdminLayout },
  { path: "/managers/components", component: AllComponentsPageAdmin, layout: AdminLayout },

  { path: "/managers/admin-zone", component: AdminZonePage, layout: AdminLayout },
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
  { path: "/managers/components/chart", component: ChartAreaGradient, layout: AdminLayout },
  { path: "/managers/components/topsellingproducts", component: TopSellingProducts, layout: AdminLayout },
  { path: "/managers/components/BuyersProfile", component: BuyersProfile, layout: AdminLayout },
  { path: "/managers/components/CarStatistics", component: CarStatistics, layout: AdminLayout },
  { path: "/managers/components/CheckRadioSwitch", component: CheckRadioSwitch, layout: AdminLayout },
  { path: "/managers/components/DefaultInputs", component: DefaultInputs, layout: AdminLayout },
  { path: "/managers/components/Dropzone", component: Dropzone, layout: AdminLayout },
  { path: "/managers/components/ForgotPassword", component: ForgotPassword, layout: AdminLayout },
  { path: "/managers/components/LatestTransactions", component: LatestTransactions, layout: AdminLayout },
  { path: "/managers/components/Login", component: Login, layout: AdminLayout },
  { path: "/managers/components/SignIn", component: SignIn, layout: AdminLayout },
  { path: "/managers/components/MilesStatistics", component: MilesStatistics, layout: AdminLayout },
  { path: "/managers/components/NewCustomersDropdown", component: NewCustomersDropdown, layout: AdminLayout },
  { path: "/managers/components/RecentOrders", component: RecentOrders, layout: AdminLayout },
  { path: "/managers/components/ReminderTable", component: ReminderTable, layout: AdminLayout },
  { path: "/managers/components/ResetPassword", component: ResetPassword, layout: AdminLayout },
  { path: "/managers/components/RevenueChart", component: RevenueChart, layout: AdminLayout },
  { path: "/managers/components/SelectInputs", component: SelectInputs, layout: AdminLayout },
  { path: "/managers/components/Signup", component: Signup, layout: AdminLayout },
  { path: "/managers/components/SignUp1", component: SignUp1, layout: AdminLayout },
  { path: "/managers/components/TodaySales", component: TodaySales, layout: AdminLayout },
  { path: "/managers/components/TopProducts", component: TopProducts, layout: AdminLayout },
  { path: "/managers/components/TotalRevenueChart", component: TotalRevenueChart, layout: AdminLayout },
  { path: "/managers/components/VisitorInsights", component: VisitorInsights, layout: AdminLayout },
  { path: "/managers/components/WebsiteVisitorsDonut", component: WebsiteVisitorsDonut, layout: AdminLayout },
  { path: "/managers/components/tacklist", component: TaskList, layout: AdminLayout },


]


export { publicRoutes, privateRoutes };
