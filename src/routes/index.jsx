import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Layouts - Được tải lười biếng để tối ưu hóa
const DefaultLayout = lazy(() => import("@/components/layout/DefaultLayout"));
const NoneHeaderFooterLayout = lazy(() =>
  import("@/components/layout/NoneHeaderFooterLayout")
);
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));

/**
 * ============================================================================
 * --- PUBLIC ROUTES ---
 * Các route này có thể được truy cập bởi bất kỳ người dùng nào.
 * Mỗi component trang được tải lười biếng để chỉ tải mã khi cần thiết.
 * ============================================================================
 */
export const publicRoutes = [
  // Core Pages
  {
    path: "/",
    component: lazy(() => import("@/pages/homePage")),
    layout: DefaultLayout,
  },
  {
    path: "/about",
    component: lazy(() => import("@/pages/aboutMePage")),
    layout: DefaultLayout,
  },
  {
    path: "/contact",
    component: lazy(() => import("@/pages/contactPage")),
    layout: DefaultLayout,
  },
  {
    path: "/careers",
    component: lazy(() => import("@/pages/recruitmentPage")),
    layout: DefaultLayout,
  },
  {
    path: "/terms-of-services",
    component: lazy(() => import("@/pages/TermsOfServicePage")),
    layout: DefaultLayout,
  },

  // Services Pages
  {
    path: "/services",
    component: lazy(() => import("@/pages/servicesPage")),
    layout: DefaultLayout,
  },
  {
    path: "/services/:parentSlug",
    component: lazy(() => import("@/pages/servicesPage")),
    layout: DefaultLayout,
  },
  {
    path: "/services/:parentSlug/:slug",
    component: lazy(() => import("@/pages/serviceDetailPage")),
    layout: DefaultLayout,
  },
  {
    path: "/services/detail/:slug",
    component: lazy(() => import("@/pages/serviceDetailPage")),
    layout: DefaultLayout,
  },

  // Marketing & News Pages
  {
    path: "/marketing",
    component: lazy(() => import("@/pages/marketingPage")), // Outlet Component
    layout: DefaultLayout,
    children: [
      {
        path: "",
        component: lazy(() => import("@/pages/marketing/marketing-list_page")),
      },
      {
        path: ":slug",
        component: lazy(() => import("@/pages/marketing/article-detail")),
      },
    ],
  },
  {
    path: "/news",
    component: lazy(() => import("@/pages/news/newsPage")),
    layout: DefaultLayout,
  },
  {
    path: "/news/:slug",
    component: lazy(() => import("@/pages/news/NewsDetail")),
    layout: DefaultLayout,
  },

  // Products Pages
  {
    path: "/Products",
    component: lazy(() => import("@/pages/Products")),
    layout: DefaultLayout,
  },
  {
    path: "/Products/:id",
    component: lazy(() => import("@/pages/ProductDetail")),
    layout: DefaultLayout,
  },

  // Authentication & System Pages
  {
    path: "/login",
    component: lazy(() => import("@/pages/managers/AdminLoginPage")),
    layout: NoneHeaderFooterLayout,
  },
  {
    path: "*",
    component: lazy(() => import("@/pages/NotFoundPage")),
    layout: NoneHeaderFooterLayout,
  },
];

/**
 * ============================================================================
 * --- PRIVATE ROUTES ---
 * Các route này yêu cầu xác thực và chỉ dành cho quản trị viên.
 * Tất cả các component và layout liên quan đến admin đều được tải lười biếng.
 * ============================================================================
 */
export const privateRoutes = [
  // Redirect base manager path to dashboard
  {
    path: "/managers",
    component: () => (
      <Navigate
        to="/managers/dashboard"
        replace={true}
      />
    ),
    layout: AdminLayout,
  },

  // Main Admin Pages
  {
    path: "/managers/dashboard",
    component: lazy(() => import("@/pages/managers/DashboardPage")),
    layout: AdminLayout,
  },
  {
    path: "/managers/recruitment",
    component: lazy(() => import("@/pages/managers/RecruitmentPage")),
    layout: AdminLayout,
  },
  {
    path: "/managers/contact",
    component: lazy(() => import("@/pages/managers/ContactPage")),
    layout: AdminLayout,
  },
  {
    path: "/managers/admin-zone",
    component: lazy(() => import("@/pages/managers/AdminZonePage")),
    layout: AdminLayout,
  },
  {
    path: "/managers/profile",
    component: lazy(() => import("@/pages/managers/ProfilePage")),
    layout: AdminLayout,
  },

  // Page Configuration
  {
    path: "/managers/page-config",
    component: lazy(() => import("@/pages/managers/ConfigPage")),
    layout: AdminLayout,
    children: [
      {
        path: "header",
        component: lazy(() =>
          import("@/pages/managers/ConfigPage/HeaderConfig")
        ),
      },
      {
        path: "footer",
        component: lazy(() =>
          import("@/pages/managers/ConfigPage/FooterConfig")
        ),
      },
      {
        path: "home",
        component: lazy(() => import("@/pages/managers/ConfigPage/HomeConfig")),
      },
      {
        path: "about",
        component: lazy(() =>
          import("@/pages/managers/ConfigPage/AboutConfig")
        ),
      },
      {
        path: "contact",
        component: lazy(() =>
          import("@/pages/managers/ConfigPage/ContactConfig")
        ),
      },
    ],
  },

  // Marketing Management
  {
    path: "/managers/marketing",
    component: lazy(() => import("@/pages/managers/MarketingPage")),
    layout: AdminLayout,
    children: [
      {
        path: "",
        component: lazy(() =>
          import("@/pages/managers/MarketingPage/ListPage")
        ),
      },
      {
        path: "add",
        component: lazy(() => import("@/pages/managers/MarketingPage/AddPage")),
      },
      {
        path: ":id/view",
        component: lazy(() =>
          import("@/pages/managers/MarketingPage/ViewPage")
        ),
      },
      {
        path: ":id/edit",
        component: lazy(() =>
          import("@/pages/managers/MarketingPage/EditPage")
        ),
      },
    ],
  },

  // Services Management
  {
    path: "/managers/services",
    component: lazy(() => import("@/pages/managers/ServicesPage")),
    layout: AdminLayout,
    children: [
      {
        path: "service_overview",
        component: lazy(() =>
          import("@/pages/managers/service/ServiceOverview")
        ),
      },
      {
        path: "service_list",
        component: lazy(() => import("@/pages/managers/service/ServiceList")),
      },
      {
        path: "service_booking",
        component: lazy(() =>
          import("@/pages/managers/service/ServiceBookings")
        ),
      },
      {
        path: "service_customer",
        component: lazy(() =>
          import("@/pages/managers/service/ServiceCustomers")
        ),
      },
      {
        path: "read-detail/:slug",
        component: lazy(() =>
          import("@/components/admin/services/ReadDetailService")
        ),
      },
    ],
  },

  // News (Blogs) Management
  {
    path: "/managers/news",
    component: lazy(() => import("@/pages/managers/BlogsPage")),
    layout: AdminLayout,
    children: [
      {
        path: "",
        component: lazy(() => import("@/components/admin/blogs/blogList")),
      },
      {
        path: "new",
        component: lazy(() => import("@/components/admin/blogs/blogNew")),
      },
      {
        path: ":id/view",
        component: lazy(() => import("@/components/admin/blogs/blogView")),
      },
      {
        path: ":id/edit",
        component: lazy(() => import("@/components/admin/blogs/blogNew")),
      }, // Reusing the 'new' component for editing
    ],
  },

  // Website Templates Management
  {
    path: "/managers/website-templates",
    component: lazy(() => import("@/pages/managers/WebsiteTemplatePage")),
    layout: AdminLayout,
    children: [
      {
        path: "",
        component: lazy(() =>
          import("@/components/admin/listWebDesign/ListWebsite")
        ),
      },
      {
        path: "new",
        component: lazy(() =>
          import("@/components/admin/listWebDesign/EditWebsite")
        ),
      },
      {
        path: ":id",
        component: lazy(() =>
          import("@/components/admin/listWebDesign/DetailWebsite")
        ),
      },
      {
        path: ":id/edit",
        component: lazy(() =>
          import("@/components/admin/listWebDesign/EditWebsite")
        ),
      },
    ],
  },

  // Admin UI Components (for development/storybook purposes)
  {
    path: "/managers/components",
    component: lazy(() => import("@/pages/managers/AllComponent")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/chart",
    component: lazy(() => import("@/components/adminComponent/chart")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/topsellingproducts",
    component: lazy(() =>
      import("@/components/adminComponent/TopSellingProducts")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/BuyersProfile",
    component: lazy(() => import("@/components/adminComponent/BuyersProfile")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/CarStatistics",
    component: lazy(() => import("@/components/adminComponent/CarStatistics")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/CheckRadioSwitch",
    component: lazy(() =>
      import("@/components/adminComponent/CheckRadioSwitch")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/DefaultInputs",
    component: lazy(() => import("@/components/adminComponent/DefaultInputs")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/Dropzone",
    component: lazy(() => import("@/components/adminComponent/Dropzone")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ForgotPassword",
    component: lazy(() => import("@/components/adminComponent/ForgotPassword")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/LatestTransactions",
    component: lazy(() =>
      import("@/components/adminComponent/LatestTransactions")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/Login",
    component: lazy(() => import("@/components/adminComponent/Login")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/SignIn",
    component: lazy(() => import("@/components/adminComponent/SignIn")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/MilesStatistics",
    component: lazy(() =>
      import("@/components/adminComponent/MilesStatistics")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/NewCustomersDropdown",
    component: lazy(() =>
      import("@/components/adminComponent/NewCustomersDropdown")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/RecentOrders",
    component: lazy(() => import("@/components/adminComponent/RecentOrders")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ReminderTable",
    component: lazy(() => import("@/components/adminComponent/ReminderTable")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/ResetPassword",
    component: lazy(() => import("@/components/adminComponent/ResetPassword")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/RevenueChart",
    component: lazy(() => import("@/components/adminComponent/RevenueChart")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/SelectInputs",
    component: lazy(() => import("@/components/adminComponent/SelectInputs")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/Signup",
    component: lazy(() => import("@/components/adminComponent/Signup")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/SignUp1",
    component: lazy(() => import("@/components/adminComponent/SignUp1")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TodaySales",
    component: lazy(() => import("@/components/adminComponent/TodaySales")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TopProducts",
    component: lazy(() => import("@/components/adminComponent/TopProducts")),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/TotalRevenueChart",
    component: lazy(() =>
      import("@/components/adminComponent/TotalRevenueChart")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/VisitorInsights",
    component: lazy(() =>
      import("@/components/adminComponent/VisitorInsights")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/WebsiteVisitorsDonut",
    component: lazy(() =>
      import("@/components/adminComponent/WebsiteVisitorsDonut")
    ),
    layout: AdminLayout,
  },
  {
    path: "/managers/components/tacklist",
    component: lazy(() => import("@/components/adminComponent/TaskList")),
    layout: AdminLayout,
  },
];
