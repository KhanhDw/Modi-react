import React from "react"
import Footer from "../partials/footer";
import Header from "../partials/header";


function DefaultLayout({ children }) {

    return <>
        <Header></Header>
        <main>{children}</main>
        <Footer></Footer>
    </>;
}

export default DefaultLayout;