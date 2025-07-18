
import {DefaultLayout, HeaderOnlyLayout, NoneHeaderFooterLayout} from "../components/layout"

import Home from "../pages/homePage"
import About from "../pages/aboutMePage"
import Services from "../pages/servicesPage"
import News from '../pages/newsPage'
import Recruitment from '../pages/recruitmentPage'



const publicRoutes = [
    {path: "/", component: Home, layout: DefaultLayout },
    {path: "/about", component: About, layout:HeaderOnlyLayout  },
    {path: "/services", component: Services, layout:HeaderOnlyLayout  },
    {path: "/news", component: News, layout:HeaderOnlyLayout  },
    {path: "/recruitment", component: Recruitment, layout:HeaderOnlyLayout  },
]


const privateRoutes = []


export {publicRoutes, privateRoutes}