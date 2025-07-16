
import {DefaultLayout} from "../components/layout"
import HeaderOnlyLayout from "../components/layout/HeaderOnlyLayout"

import Home from "../pages/home"
import About from "../pages/about"


const publicRoutes = [
    {path: "/", component: Home, layout:DefaultLayout  },
    {path: "/about", component: About, layout:HeaderOnlyLayout  }
]


const privateRoutes = []


export {publicRoutes, privateRoutes}