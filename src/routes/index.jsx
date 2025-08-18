import { DefaultLayout, HeaderOnlyLayout, NoneHeaderFooterLayout, AdminLayout } from "../components/layout"
import { Navigate } from "react-router-dom"

import Home from "../pages/homePage"
import About from "../pages/aboutMePage"
import Services from "../pages/servicesPage"
import News from '../pages/newsPage'
import Contact from '../pages/contactPage'
import Recruitment from '../pages/recruitmentPage'
import NotFound from '../pages/NotFoundPage'
import ServiceDetailPage from "../pages/serviceDetailPage";

import AdminLoginPage from '../pages/managers/AdminLoginPage'
import NewsDetail from '../pages/NewsDetail'

//admin
import ManagerDashboard from "../pages/managers/DashboardPage"
import ManagerServices from "../pages/managers/ServicesPage"
import ManagerNews from "../pages/managers/NewsPage"
import ManagerRecruitment from "../pages/managers/RecruitmentPage"
import ManagerContact from "../pages/managers/ContactPage"
import AllComponentsPageAdmin from "../pages/managers/AllComponent"

import ConfigHomePage from "@/pages/managers/ConfigHomePage"
import AboutConfig from "@/pages/managers/AboutConfig"
import AdminZonePage from "@/pages/managers/AdminZonePage"
import ProfilePage from "@/pages/managers/ProfilePage"

import WebsiteTemplatePage from "@/pages/managers/WebsiteTemplatePage"
import WebsiteTemplateList from "@/components/admin/listWebDesign/ListWebsite"
import WebsiteTemplateDetail from "@/components/admin/listWebDesign/DetailWebsite";
import WebsiteTemplateEdit from "@/components/admin/listWebDesign/EditWebsite";

import MarketingPage from "@/pages/managers/MarketingPage"
import OverviewPage from "@/pages/managers/marketing/OverviewPage"
import CampaignsPage from "@/pages/managers/marketing/CampaignsPage"
import EmailPage from "@/pages/managers/marketing/EmailPage"
import SEOPage from "@/pages/managers/marketing/SEOPage"
import SocialPage from "@/pages/managers/marketing/SocialPage"

import TermsOfServicePage from "../pages/TermsOfServicePage"


// tất cả components
import ChartAreaGradient from "../components/adminComponent/chart"
import TopSellingProducts from "../components/adminComponent/TopSellingProducts"
import BuyersProfile from "../components/adminComponent/BuyersProfile"
import CarStatistics from "../components/adminComponent/CarStatistics"
import CheckRadioSwitch from "../components/adminComponent/CheckRadioSwitch"
import DefaultInputs from "../components/adminComponent/DefaultInputs"
import Dropzone from "../components/adminComponent/Dropzone"
import ForgotPassword from "../components/adminComponent/ForgotPassword"
import LatestTransactions from "../components/adminComponent/LatestTransactions"
import Login from "../components/adminComponent/Login"
import SignIn from "../components/adminComponent/SignIn"
import MilesStatistics from "../components/adminComponent/MilesStatistics"
import NewCustomersDropdown from "../components/adminComponent/NewCustomersDropdown"
import RecentOrders from "../components/adminComponent/RecentOrders"
import ReminderTable from "../components/adminComponent/ReminderTable"
import ResetPassword from "../components/adminComponent/ResetPassword"
import RevenueChart from "../components/adminComponent/RevenueChart"
import SelectInputs from "../components/adminComponent/SelectInputs"
import Signup from "../components/adminComponent/Signup"
import SignUp1 from "../components/adminComponent/SignUp1"
import TodaySales from "../components/adminComponent/TodaySales"
import TopProducts from "../components/adminComponent/TopProducts"
import TotalRevenueChart from "../components/adminComponent/TotalRevenueChart"
import VisitorInsights from "../components/adminComponent/VisitorInsights"
import WebsiteVisitorsDonut from "../components/adminComponent/WebsiteVisitorsDonut"




const publicRoutes = [
    { path: "/", component: Home, layout: DefaultLayout },
    { path: "/about", component: About, layout: DefaultLayout },
    { path: "/services", component: Services, layout: DefaultLayout },
    { path: "/services/:slug", component: ServiceDetailPage, layout: DefaultLayout },
    { path: "/news", component: News, layout: DefaultLayout },
    { path: "/contact", component: Contact, layout: DefaultLayout },
    { path: "/careers", component: Recruitment, layout: DefaultLayout },
    { path: "/terms-of-services", component: TermsOfServicePage, layout: DefaultLayout },
    { path: "/login", component: AdminLoginPage, layout: NoneHeaderFooterLayout },
    { path: "/news/:id", component: NewsDetail, layout: DefaultLayout },
    { path: "*", component: NotFound, layout: NoneHeaderFooterLayout },
]

const privateRoutes = [
    // redirect /managers -> /managers/dashboard
    { path: "/managers", component: () => <Navigate to="/managers/dashboard" replace={true} /> },
    { path: "/managers/marketing", component: () => <Navigate to="/managers/marketing/overview" replace={true} /> },

    //admin routes
    { path: "/managers/dashboard", component: ManagerDashboard, layout: AdminLayout },
    { path: "/managers/home-config", component: ConfigHomePage, layout: AdminLayout },
    {
        path: "/managers/marketing",
        component: MarketingPage,
        layout: AdminLayout,
        children: [
            { path: "overview", component: OverviewPage },
            { path: "campaigns", component: CampaignsPage },
            { path: "seo", component: SEOPage },
            { path: "social", component: SocialPage },
            { path: "email", component: EmailPage },
        ],
    },
    { path: "/managers/services", component: ManagerServices, layout: AdminLayout },
    { path: "/managers/news", component: ManagerNews, layout: AdminLayout },
    { path: "/managers/recruitment", component: ManagerRecruitment, layout: AdminLayout },
    { path: "/managers/contact", component: ManagerContact, layout: AdminLayout },
    { path: "/managers/components", component: AllComponentsPageAdmin, layout: AdminLayout },
    { path: "/managers/about-config", component: AboutConfig, layout: AdminLayout },
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
    //   { path: "/managers/website-templates/new", component: WebsiteTemplateEdit, layout: AdminLayout },
    //   { path: "/managers/website-templates/:id", component: WebsiteTemplateDetail, layout: AdminLayout },
    //   { path: "/managers/website-templates/:id/edit", component: WebsiteTemplateEdit, layout: AdminLayout },


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


]


export { publicRoutes, privateRoutes }