import KpiCards from "@/components/admin/dashboard/KpiCards"
import RevenueChart from "@/components/admin/dashboard/RevenueChart"
import VisitorChart from "@/components/admin/dashboard/VisitorChart"
import OrderNeedToDone from "@/components/admin/dashboard/OrderNeedToDone"
import MostViewedProducts from "@/components/admin/dashboard/MostViewedProducts"



export default function DashboardPage() {
  return (
    <div className="flex bg-white admin-dark:bg-gray-900">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <KpiCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart />
            <VisitorChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderNeedToDone />
            <MostViewedProducts />
          </div>
        </main>
      </div>
    </div>
  )
}
