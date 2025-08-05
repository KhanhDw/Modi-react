
import { DefaultLayout, HeaderOnlyLayout, NoneHeaderFooterLayout, AdminLayout } from "../components/layout"
import { Navigate } from "react-router-dom"

import Home from "../pages/homePage"
import About from "../pages/aboutMePage"
import Services from "../pages/servicesPage"
import News from '../pages/newsPage'
import Contact from '../pages/contactPage'
import Recruitment from '../pages/recruitmentPage'
import NotFound from '../pages/notFoundPage'
import ServiceDetailPage from "../pages/serviceDetailPage";

import AdminLoginPage from '../pages/managers/AdminLoginPage'
import NewsDetail from '../pages/detailNewsPage'

//admin
import ManagerDashboard from "../pages/managers/DashboardPage"
import ManagerServices from "../pages/managers/ServicesPage"
import ManagerNews from "../pages/managers/NewsPage"
import ManagerRecruitment from "../pages/managers/RecruitmentPage"
import ManagerContact from "../pages/managers/ContactPage"

import TermsOfServicePage from "../pages/TermsOfServicePage"




const publicRoutes = [
    { path: "/", component: Home, layout: DefaultLayout },
    { path: "/about", component: About, layout: DefaultLayout },
    { path: "/services", component: Services, layout: DefaultLayout },
    { path: "/news", component: News, layout: DefaultLayout },
    { path: "/contact", component: Contact, layout: DefaultLayout },
    { path: "/careers", component: Recruitment, layout: DefaultLayout },
    { path: "/terms-of-services", component: TermsOfServicePage, layout: DefaultLayout },
    { path: "*", component: NotFound, layout: NoneHeaderFooterLayout },
    { path: "/services/:slug", component: ServiceDetailPage, layout: DefaultLayout },

    { path: "/1", component: NewsDetail, layout: DefaultLayout },
    { path: "/login", component: AdminLoginPage, layout: NoneHeaderFooterLayout },
]


const privateRoutes = [
    // redirect /managers -> /managers/dashboard
    { path: "/managers", component: () => <Navigate to="/managers/dashboard" replace={true} /> },

    //admin routes
    { path: "/managers/dashboard", component: ManagerDashboard, layout: AdminLayout },
    { path: "/managers/services", component: ManagerServices, layout: AdminLayout },
    { path: "/managers/news", component: ManagerNews, layout: AdminLayout },
    { path: "/managers/recruitment", component: ManagerRecruitment, layout: AdminLayout },
    { path: "/managers/contact", component: ManagerContact, layout: AdminLayout },

]


export { publicRoutes, privateRoutes }
export { publicRoutes, privateRoutes }