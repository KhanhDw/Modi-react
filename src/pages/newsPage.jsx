import React, { useState, useEffect } from "react";



function NewsPage() {


    return (
        <>
            <div>
                <p className="text-9xl">NewsPage page</p>
            </div>
            <BannerTinTuc/>
            <NoidungTinTuc/>
            <ListTintuc/>
        </>
    );
}


function BannerTinTuc() {

    const [tintuc, setTintuc] = useState("hello");

    return (
   <>
     <div>
        <h1 className="text-4xl font-bold">{tintuc}</h1>
        <h1 className="text-4xl font-bold">Tin Tức</h1>
        <p className="text-lg text-gray-600">Cập nhật những tin tức mới nhất</p>
        <button type="button" onClick={() => setTintuc("xin chao")} className="bg-blue-500 text-white px-4 py-2 rounded">click mêmmem</button>
    </div>
   </>
    );
}
function NoidungTinTuc() {
    return (
   <>
     <div>
        <h1 className="text-4xl font-bold">nội dung Tin Tức</h1>
        <p className="text-lg text-gray-600">Cập nhật những tin tức mới nhất</p>
    </div>
   </>
    );
}
function CardTInTUc({tentintuc}) {
    return (
   <>
     <div>
     <h1 className="text-4xl font-bold">{tentintuc}</h1>
        <h1 className="text-4xl font-bold">nội dung Tin Tức</h1>
        <p className="text-lg text-gray-600">Cập nhật những tin tức mới nhất</p>
    </div>
   </>
    );
}


function ListTintuc() {

    const [tintuc, setTintuc] = useState([
        { id: 1, title: "Tin Tức 1" },
        { id: 2, title: "Tin Tức 2" },
        { id: 3, title: "Tin Tức 3" },
        { id: 4, title: "Tin Tức 4" },
        { id: 5, title: "Tin Tức 5" }]);


    return ( <>

        {
            tintuc.map((item) => (
                <CardTInTUc key={item.id} tentintuc={item.title} />
            ))
        }

        
    </> );
}








export default NewsPage