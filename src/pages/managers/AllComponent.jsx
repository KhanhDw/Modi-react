import { Link } from "react-router-dom";


function AllComponentsPageAdmin() {
    return (<>
        <div className="text-black admin-dark:text-gray-200 ">
            <Link to={'chart'} className="border-2 border-slate-500 rounded-3xl p-2">Chart</Link>
        </div>
    </>);
}

export default AllComponentsPageAdmin;