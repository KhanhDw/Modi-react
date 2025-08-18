import { Link } from "react-router-dom";

function AllComponentsPageAdmin() {
    return (
        <div className="text-black admin-dark:text-gray-200 px-4 py-10 min-h-screen bg-white admin-dark:bg-gray-900 transition-colors duration-300">
            <div className="flex justify-center mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center">
                    Danh sách Component Template Website
                </h1>
            </div>

            <div className="space-y-10">
                {/* Chart Group */}
                <Section title="📊 Chart">
                    <ComponentLink to="chart" label="Chart" />
                    <ComponentLink to="BuyersProfile" label="Buyers Profile" />
                    <ComponentLink to="CarStatistics" label="Car Statistics" />
                    <ComponentLink to="MilesStatistics" label="Miles Statistics" />
                    <ComponentLink to="RevenueChart" label="Revenue Chart" />
                    <ComponentLink to="TotalRevenueChart" label="Total Revenue Chart" />
                    <ComponentLink to="VisitorInsights" label="Visitor Insights" />
                    <ComponentLink to="WebsiteVisitorsDonut" label="Website Visitors Donut" />

                </Section>

                {/* Table Group */}
                <Section title="📋 Table">
                    <ComponentLink to="TopProducts" label="Top Products" />
                    <ComponentLink to="topsellingproducts" label="Top Selling Products" />
                    <ComponentLink to="LatestTransactions" label="Latest Transactions" />
                    <ComponentLink to="NewCustomersDropdown" label="New Customers" />
                    <ComponentLink to="RecentOrders" label="Recent Orders" />
                    <ComponentLink to="ReminderTable" label="Reminder Table" />
                </Section>

                {/* Form Elements */}
                <Section title="🧩 Form Elements">
                    <ComponentLink to="CheckRadioSwitch" label="Check Radio Switch" />
                    <ComponentLink to="DefaultInputs" label="Default Inputs" />
                    <ComponentLink to="Dropzone" label="Dropzone" />
                    <ComponentLink to="SelectInputs" label="Select Inputs" />
                </Section>

                {/* UI Pages */}
                <Section title="🧑‍💻 UI Pages">
                    <ComponentLink to="TodaySales" label="Today Sales" />
                    <ComponentLink to="ForgotPassword" label="Forgot Password" />
                    <ComponentLink to="Login" label="Login" />
                    <ComponentLink to="ResetPassword" label="Reset Password" />
                    <ComponentLink to="Signup" label="Signup" />
                    <ComponentLink to="SignIn" label="Sign In" />
                    <ComponentLink to="SignUp1" label="SignUp1" />
                </Section>

                {/* Other */}
                <Section title="Other">
                    <ComponentLink to="tacklist" label="Task List" />
                </Section>

            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 admin-dark:text-gray-100">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    );
}

function ComponentLink({ to, label }) {
    return (
        <Link
            to={to}
            className="border border-gray-300 admin-dark:border-gray-600 rounded-xl px-4 py-2 text-center text-sm sm:text-base font-medium 
            text-gray-800 admin-dark:text-gray-100 bg-white admin-dark:bg-gray-800
            transition-all duration-200 ease-in-out
            hover:bg-blue-600 hover:text-white admin-dark:hover:bg-blue-500 
            shadow-sm hover:shadow-md transform hover:-translate-y-1"
        >
            {label}
        </Link>
    );
}

export default AllComponentsPageAdmin;
