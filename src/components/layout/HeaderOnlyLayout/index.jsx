import Header from "../partials/header/header";

function HeaderOnlyLayout({children}) { 
    return ( <div>
         <Header></Header>
        <main>{children}</main>
    </div> );
}

export default HeaderOnlyLayout;