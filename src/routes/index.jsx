import {
  DefaultLayout,
  HeaderOnlyLayout,
  NoneHeaderFooterLayout,
  AdminLayout,
} from "../components/layout";
import { Navigate } from "react-router-dom";

import Home from "../pages/homePage";
import About from "../pages/aboutMePage";
import Services from "../pages/servicesPage";
import News from "../pages/newsPage";
import Contact from "../pages/contactPage";
import Recruitment from "../pages/recruitmentPage";
import NotFound from "../pages/NotFoundPage";
import ServiceDetailPage from "../pages/serviceDetailPage";

import AdminLoginPage from "../pages/managers/AdminLoginPage";
import NewsDetail from "../pages/NewsDetail";

//admin
import ManagerDashboard from "../pages/managers/DashboardPage";

//manager service
import ServicesPage from "../pages/managers/ServicesPage";
import ServiceOverview from "../pages/managers/service/ServiceOverview";
import ServiceList from "../pages/managers/service/ServiceList";
import ServiceBooking from "@/pages/managers/service/ServiceBookings";
import ServiceCustomer from "@/pages/managers/service/ServiceCustomers";
// import ServiceReview from "@/pages/managers/service/ServiceReviews";

import ManagerNews from "../pages/managers/NewsPage";
import ManagerRecruitment from "../pages/managers/RecruitmentPage";
import ManagerContact from "../pages/managers/ContactPage";
import AllComponentsPageAdmin from "../pages/managers/AllComponent";

import ConfigHomePage from "@/pages/managers/ConfigHomePage";
import AboutConfig from "@/pages/managers/AboutConfig";
import AdminZonePage from "@/pages/managers/AdminZonePage";

import WebsiteTemplatePage from "@/pages/managers/WebsiteTemplatePage";
import WebsiteTemplateList from "@/components/admin/listWebDesign/ListWebsite";
import WebsiteTemplateDetail from "@/components/admin/listWebDesign/DetailWebsite";
import WebsiteTemplateEdit from "@/components/admin/listWebDesign/EditWebsite";

import MarketingPage from "@/pages/managers/MarketingPage";
import OverviewPage from "@/pages/managers/marketing/OverviewPage";
import CampaignsPage from "@/pages/managers/marketing/CampaignsPage";
import EmailPage from "@/pages/managers/marketing/EmailPage";
import SEOPage from "@/pages/managers/marketing/SEOPage";
import SocialPage from "@/pages/managers/marketing/SocialPage";
// import  CampaignForm  from "@/components/admin/marketing/campaigns/campaign-form";
// import  CampaignDetailModal  from "@/components/admin/marketing/campaigns/campaign-detail-modal";
// import  CampaignsTable  from "@/components/admin/marketing/campaigns/campaigns-table";
// import  KeywordForm  from "@/components/admin/marketing/seo/keyword-form";
// import  SEOAnalytics  from "@/components/admin/marketing/seo/seo-analytics";
// import  SocialCalendar  from "@/components/admin/marketing/social/social-calendar";
// import  SocialAnalytics  from "@/components/admin/marketing/social/social-analytics";

import TermsOfServicePage from "../pages/TermsOfServicePage";

import ChartAreaGradient from "../components/adminComponent/chart";

const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/about", component: About, layout: DefaultLayout },
  { path: "/services", component: Services, layout: DefaultLayout },
  {
    path: "/services/:slug",
    component: ServiceDetailPage,
    layout: DefaultLayout,
  },
  { path: "/news", component: News, layout: DefaultLayout },
  { path: "/contact", component: Contact, layout: DefaultLayout },
  { path: "/careers", component: Recruitment, layout: DefaultLayout },
  {
    path: "/terms-of-services",
    component: TermsOfServicePage,
    layout: DefaultLayout,
  },
  { path: "/login", component: AdminLoginPage, layout: NoneHeaderFooterLayout },
  { path: "/news/:id", component: NewsDetail, layout: DefaultLayout },
  { path: "*", component: NotFound, layout: NoneHeaderFooterLayout },
];

const privateRoutes = [
  // redirect /managers -> /managers/dashboard
  {
    path: "/managers",
    component: () => <Navigate to="/managers/dashboard" replace={true} />,
  },
  {
    path: "/managers/marketing",
    component: () => (
      <Navigate to="/managers/marketing/overview" replace={true} />
    ),
  },

  //admin routes
  {
    path: "/managers/dashboard",
    component: ManagerDashboard,
    layout: AdminLayout,
  },
  {
    path: "/managers/home-config",
    component: ConfigHomePage,
    layout: AdminLayout,
  },
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
    ],
  },

  { path: "/managers/news", component: ManagerNews, layout: AdminLayout },
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
    path: "/managers/about-config",
    component: AboutConfig,
    layout: AdminLayout,
  },
  {
    path: "/managers/admin-zone",
    component: AdminZonePage,
    layout: AdminLayout,
  },
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

  {
    path: "/managers/components/chart",
    component: ChartAreaGradient,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };
