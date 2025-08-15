import { Link } from "react-router-dom";


function AllComponentsPageAdmin() {
    return (<>
        <div className="text-black admin-dark:text-gray-200 ">
        <div className="flex w-full items-center justify-center">
            <p className="text-4xl font-extrabold">Danh sách component template website</p>
        </div>
        <div className="py-3">

            <Link to={'chart'} className="border-2 border-slate-500 rounded-3xl p-2">Chart</Link>
        </div>
        </div>
    </>);
}

export default AllComponentsPageAdmin;