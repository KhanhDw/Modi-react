
import {DefaultLayout} from "../components/layout"
import HeaderOnlyLayout from "../components/layout/HeaderOnlyLayout"

import Home from "../pages/homePage"
import About from "../pages/aboutMePage"
import Services from "../pages/servicesPage"
import News from '../pages/newsPage'



const publicRoutes = [
    {path: "/", component: Home, layout:DefaultLayout  },
    {path: "/about", component: About, layout:HeaderOnlyLayout  },
    {path: "/services", component: Services, layout:HeaderOnlyLayout  },,
    {path: "/news", component: News, layout:HeaderOnlyLayout  },
]


const privateRoutes = []


export {publicRoutes, privateRoutes}