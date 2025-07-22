
import {DefaultLayout, HeaderOnlyLayout, NoneHeaderFooterLayout} from "../components/layout"

import Home from "../pages/homePage"
import About from "../pages/aboutMePage"
import Services from "../pages/servicesPage"
import News from '../pages/newsPage'
import Contact from '../pages/contactPage'
import Recruitment from '../pages/recruitmentPage'
import NotFound from '../pages/notFoundPage'



const publicRoutes = [
    {path: "/", component: Home, layout: DefaultLayout },
    {path: "/about", component: About, layout:DefaultLayout  },
    {path: "/services", component: Services, layout:DefaultLayout  },
    {path: "/news", component: News, layout:DefaultLayout  },
    {path: "/contact", component: Contact, layout:DefaultLayout  },
    {path: "/recruitment", component: Recruitment, layout:DefaultLayout  },
    {path: "*", component: NotFound, layout:NoneHeaderFooterLayout  },
]


const privateRoutes = []


export {publicRoutes, privateRoutes}