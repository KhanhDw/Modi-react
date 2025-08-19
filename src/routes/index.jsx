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

import ManagerBlogs from "../pages/managers/BlogsPage"
import BlogsListPage from "../pages/managers/blogs/blogList"
import BlogViewPage from "../pages/managers/blogs/blogView"
import BlogsNewPage from "../pages/managers/blogs/blogNew"


import ManagerRecruitment from "../pages/managers/RecruitmentPage"
import ManagerContact from "../pages/managers/ContactPage"
import AllComponentsPageAdmin from "../pages/managers/AllComponent"

import ConfigHomePage from "@/pages/managers/ConfigHomePage"
import AboutConfig from "@/pages/managers/AboutConfig"
import AdminZonePage from "@/pages/managers/AdminZonePage"

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

import ChartAreaGradient from "../components/adminComponent/chart"




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
    {
        path: "/managers/news", component: ManagerBlogs, layout: AdminLayout,
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
    { path: "/managers/about-config", component: AboutConfig, layout: AdminLayout },
    { path: "/managers/admin-zone", component: AdminZonePage, layout: AdminLayout },
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



    { path: "/managers/components/chart", component: ChartAreaGradient, layout: AdminLayout },


]


export { publicRoutes, privateRoutes }