import React from "react";
import {
    HiCheckCircle,
    HiClock,
    HiXCircle,
    HiOutlineTrash,
    HiOutlineMenu
} from "react-icons/hi";
import { FiCheck, FiMoreHorizontal, FiArrowLeft, FiArrowRight, FiSearch, FiFilter } from "react-icons/fi";

const tableData1 = [
    {
        id: 1,
        user: {
            image: "/src/assets/images/user/user-17.jpg",
            name: "Lindsey Curtis",
            role: "Web Designer",
        },
        projectName: "Agency Website",
        team: {
            images: [
                "/src/assets/images/user/user-22.jpg",
                "/src/assets/images/user/user-23.jpg",
                "/src/assets/images/user/user-24.jpg",
            ],
        },
        budget: "3.9K",
        status: "Active",
    },
    {
        id: 2,
        user: {
            image: "/src/assets/images/user/user-18.jpg",
            name: "Kaiya George",
            role: "Project Manager",
        },
        projectName: "Technology",
        team: {
            images: ["/src/assets/images/user/user-25.jpg", "/src/assets/images/user/user-26.jpg"],
        },
        budget: "24.9K",
        status: "Pending",
    },
    {
        id: 3,
        user: {
            image: "/src/assets/images/user/user-17.jpg",
            name: "Zain Geidt",
            role: "Content Writing",
        },
        projectName: "Blog Writing",
        team: {
            images: ["/src/assets/images/user/user-27.jpg"],
        },
        budget: "12.7K",
        status: "Active",
    },
    {
        id: 4,
        user: {
            image: "/src/assets/images/user/user-20.jpg",
            name: "Abram Schleifer",
            role: "Digital Marketer",
        },
        projectName: "Social Media",
        team: {
            images: [
                "/src/assets/images/user/user-28.jpg",
                "/src/assets/images/user/user-29.jpg",
                "/src/assets/images/user/user-30.jpg",
            ],
        },
        budget: "2.8K",
        status: "Cancel",
    },
    {
        id: 5,
        user: {
            image: "/src/assets/images/user/user-21.jpg",
            name: "Carla George",
            role: "Front-end Developer",
        },
        projectName: "Website",
        team: {
            images: [
                "/src/assets/images/user/user-31.jpg",
                "/src/assets/images/user/user-32.jpg",
                "/src/assets/images/user/user-33.jpg",
            ],
        },
        budget: "4.5K",
        status: "Active",
    },
];

const tableData2 = [
    {
        id: "DE124321",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            avatar: "/src/assets/images/user/user-31.jpg",
        },
        product: "Software License",
        value: "$18,504.34",
        date: "2024-06-15",
        status: "Complete",
    },
    {
        id: "DE124322",
        customer: {
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "/src/assets/images/user/user-32.jpg",
        },
        product: "Cloud Hosting",
        value: "$12,999.00",
        date: "2024-06-18",
        status: "Pending",
    },
    {
        id: "DE124323",
        customer: {
            name: "Michael Brown",
            email: "michael@example.com",
            avatar: "/src/assets/images/user/user-33.jpg",
        },
        product: "Web Domain",
        value: "$9,500.00",
        date: "2024-06-20",
        status: "Cancel",
    },
    {
        id: "DE124324",
        customer: {
            name: "Alice Johnson",
            email: "alice@example.com",
            avatar: "/src/assets/images/user/user-34.jpg",
        },
        product: "SSL Certificate",
        value: "$2,130.45",
        date: "2024-06-25",
        status: "Pending",
    },
    {
        id: "DE124325",
        customer: {
            name: "Robert Lee",
            email: "robert@example.com",
            avatar: "/src/assets/images/user/user-35.jpg",
        },
        product: "Premium Support",
        value: "$15,200.00",
        date: "2024-06-30",
        status: "Complete",
    },
];


const tableData3 = [
    {
        icon: "https://cdn-icons-png.flaticon.com/512/888/888870.png",
        name: "Bought PYPL",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/888/888853.png",
        name: "Bought AAPL",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Pending",
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968872.png",
        name: "Sell KKST",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
        name: "Bought FB",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Success",
    },
    {
        icon: "https://cdn-icons-png.flaticon.com/512/888/888857.png",
        name: "Sell AMZN",
        date: "Nov 23, 01:00 PM",
        price: "$2,567.88",
        category: "Finance",
        status: "Failed",
    },
];

const tableData4 = [
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/men/32.jpg",
        },
        campaign: {
            title: "Grow your brand by...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
            subtitle: "Ads campaign",
        },
        status: "Success",
    },
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/men/44.jpg",
        },
        campaign: {
            title: "Make Better Ideas...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/facebook-3.svg",
            subtitle: "Ads campaign",
        },
        status: "Pending",
    },
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/women/65.jpg",
        },
        campaign: {
            title: "Increase your website tra...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/google-ads.svg",
            subtitle: "Ads campaign",
        },
        status: "Success",
    },
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/women/21.jpg",
        },
        campaign: {
            title: "Grow your brand by...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/instagram-3-1.svg",
            subtitle: "Ads campaign",
        },
        status: "Failed",
    },
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/men/12.jpg",
        },
        campaign: {
            title: "Grow your brand by...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/google-icon.svg",
            subtitle: "Ads campaign",
        },
        status: "Success",
    },
    {
        product: {
            name: "Wilson Gouse",
            avatar:
                "https://randomuser.me/api/portraits/men/56.jpg",
        },
        campaign: {
            title: "Grow your brand by...",
            logo:
                "https://cdn.worldvectorlogo.com/logos/youtube-icon.svg",
            subtitle: "Ads campaign",
        },
        status: "Success",
    },
];


const tableData5 = [
    {
        product: "TailGrids",
        category: "UI Kits",
        country: "https://flagcdn.com/us.svg",
        cr: "Dashboard",
        value: "$12,499",
    },
    {
        product: "GrayGrids",
        category: "Templates",
        country: "https://flagcdn.com/fr.svg",
        cr: "Dashboard",
        value: "$5,498",
    },
    {
        product: "Uideck",
        category: "Templates",
        country: "https://flagcdn.com/sg.svg",
        cr: "Dashboard",
        value: "$4,621",
    },
    {
        product: "FormBold",
        category: "SaaS",
        country: "https://flagcdn.com/gb.svg",
        cr: "Dashboard",
        value: "$13,843",
    },
    {
        product: "NextAdmin",
        category: "Templates",
        country: "https://flagcdn.com/eg.svg",
        cr: "Dashboard",
        value: "$7,523",
    },
    {
        product: "Form Builder",
        category: "Templates",
        country: "https://flagcdn.com/fi.svg",
        cr: "Dashboard",
        value: "$1,377",
    },
    {
        product: "AyroUI",
        category: "Templates",
        country: "https://flagcdn.com/be.svg",
        cr: "Dashboard",
        value: "$599.00",
    },
];


// Badge component to show status with color & icon
function StatusBadge({ status }) {
    let colorClass = "";
    let Icon = null;

    switch (status.toLowerCase()) {
        case "active":
        case "complete":
        case "success":
            colorClass = "text-green-600 bg-green-100";
            Icon = HiCheckCircle;
            break;
        case "pending":
            colorClass = "text-yellow-500 bg-yellow-100";
            Icon = HiClock;
            break;
        case "cancel":
        case "failed":
            colorClass = "text-red-600 bg-red-100";
            Icon = HiXCircle;
            break;
        default:
            colorClass = "text-gray-600 bg-gray-100";
            Icon = null;
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
        >
            {Icon && <Icon />}
            {status}
        </span>
    );
}

export default function AllTables() {

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-16 font-sans">

            {/* Table 1 */}
            <section className="bg-white rounded-xl shadow-md border border-gray-200 max-w-5xl mx-auto p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-6">Basic Table 1</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="text-gray-500 text-left text-xs font-medium border-b border-gray-200">
                                {["User", "Project Name", "Team", "Status", "Budget"].map((h) => (
                                    <th key={h} className="py-3 px-4 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData1.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="py-4 px-4 flex items-center gap-4 whitespace-nowrap">
                                        <img
                                            src={row.user.image}
                                            alt={row.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-gray-900 font-semibold leading-5">{row.user.name}</p>
                                            <p className="text-gray-400 text-sm">{row.user.role}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{row.projectName}</td>
                                    <td className="py-4 px-4 flex -space-x-3">
                                        {row.team.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`Team ${i + 1}`}
                                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                                                title={`Team member ${i + 1}`}
                                            />
                                        ))}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-gray-700 whitespace-nowrap">{row.budget}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Table 2 */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg text-gray-900">Recent Orders</h2>
                    <div className="flex gap-3">
                        <button
                            className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            type="button"
                        >
                            <HiOutlineMenu className="w-4 h-4" aria-hidden="true" />
                            Filter
                        </button>
                        <button
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            type="button"
                        >
                            See all
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                                <th className="px-4 py-3">
                                    {/* Checkbox header */}
                                    <label className="inline-flex cursor-pointer select-none items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            aria-label="Select all rows"
                                        />
                                        <div
                                            className="w-5 h-5 rounded-md border border-gray-300 bg-white
               peer-checked:bg-indigo-600 peer-checked:border-indigo-600
               flex items-center justify-center
               transition-colors duration-200"
                                        >
                                            <FiCheck className="text-white w-4 h-4" />
                                        </div>
                                    </label>

                                </th>
                                {[
                                    "Deal ID",
                                    "Customer",
                                    "Product/Service",
                                    "Deal Value",
                                    "Close Date",
                                    "Status",
                                    "Action",
                                ].map((h) => (
                                    <th key={h} className="px-4 py-3 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData2.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="px-4 py-4">
                                        {/* Checkbox row */}
                                        <label className="inline-flex cursor-pointer select-none items-center">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                aria-label="Select all rows"
                                            />
                                            <div
                                                className="w-5 h-5 rounded-md border border-gray-300 bg-white
               peer-checked:bg-indigo-600 peer-checked:border-indigo-600
               flex items-center justify-center
               transition-colors duration-200"
                                            >
                                                <FiCheck className="text-white w-4 h-4" />
                                            </div>
                                        </label>

                                    </td>
                                    <td className="px-4 py-4 font-mono font-semibold whitespace-nowrap">
                                        {row.id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                            <img
                                                src={row.customer.avatar}
                                                alt={row.customer.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{row.customer.name}</p>
                                            <p className="text-gray-400 text-sm">{row.customer.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">{row.product}</td>
                                    <td className="px-4 py-4 font-semibold whitespace-nowrap">{row.value}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{row.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-600 hover:text-red-600">
                                        <button aria-label="Delete" className="cursor-pointer">
                                            <HiOutlineTrash className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Table 3 */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 max-w-5xl mx-auto p-6">
                {/* Title */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg text-gray-900">Latest Transactions</h2>
                    <div className="relative w-64">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiSearch className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                                {["Name", "Date", "Price", "Category", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData3.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="px-4 py-4 whitespace-nowrap flex items-center gap-3">
                                        <img src={row.icon} alt="" className="w-6 h-6" />
                                        <span className="font-medium text-gray-900">{row.name}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">{row.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">{row.price}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">{row.category}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-gray-400 hover:text-gray-700">
                                        <button aria-label="More options">
                                            <FiMoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center gap-4 pt-6">
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
                        <FiArrowLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {[1, 2, 3].map((n) => (
                            <button
                                key={n}
                                className={`w-8 h-8 rounded-md text-sm font-medium ${n === 1
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
                        Next
                        <FiArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Table 4 */}
            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm max-w-5xl mx-auto">
                <h2 className="px-6 py-4 text-xl font-semibold text-gray-900 border-b border-gray-200">
                    Featured Campaigns
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-[600px] w-full text-left text-gray-700">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                {["Products", "Campaign", "Status"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 font-semibold tracking-wide text-sm"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData4.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-50 transition"
                                >
                                    {/* Product with avatar */}
                                    <td className="px-6 py-4 flex items-center gap-5">
                                        <img
                                            src={row.product.avatar}
                                            alt={row.product.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="text-sm font-medium text-gray-900">
                                            {row.product.name}
                                        </span>
                                    </td>

                                    {/* Campaign with logo and subtitle */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={row.campaign.logo}
                                                alt={row.campaign.title}
                                                className="w-6 h-6 object-contain"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{row.campaign.title}</p>
                                                <p className="text-xs text-gray-400">{row.campaign.subtitle}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status with colored badge */}
                                    <td className="px-6 py-4 text-start">
                                        <StatusBadge status={row.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Table 5 */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md max-w-5xl mx-auto">
                <div className="flex justify-between items-center px-6 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Orders
                    </h2>
                    <div className="flex gap-4">
                        <button className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-100">
                            <FiFilter className="h-4 w-4" />
                            Filter
                        </button>
                        <button className="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-100">
                            See all
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-600 text-sm mt-4">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {["Products", "Category", "Country", "CR", "Value"].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 font-semibold text-gray-500 uppercase"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData5.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {row.product}
                                    </td>
                                    <td className="px-6 py-4">{row.category}</td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={row.country}
                                            alt={`${row.product} country`}
                                            className="w-6 h-6 rounded-sm object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{row.cr}</td>
                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        {row.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}