import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import CampaignForm from "@/components/admin/marketingComponent/campaigns/campaign-form"
import CampaignDetailModal from "@/components/admin/marketingComponent/campaigns/campaign-detail-modal"
import CampaignsTable from "@/components/admin/marketingComponent/campaigns/campaigns-table"

export default function CampaignsPage() {
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [showCampaignDetail, setShowCampaignDetail] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [editingCampaign, setEditingCampaign] = useState(null)

  // Sample data
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale 2024",
      description: "Chiến dịch khuyến mãi mùa hè",
      budget: 5000000,
      spent: 3200000,
      clicks: 12500,
      leads: 340,
      revenue: "₫8,500,000",
      status: "running",
      startDate: "01/06/2024",
      endDate: "31/08/2024",
    },
    {
      id: 2,
      name: "Brand Awareness Q4",
      description: "Tăng nhận diện thương hiệu",
      budget: 8000000,
      spent: 4800000,
      clicks: 18200,
      leads: 520,
      revenue: "₫12,300,000",
      status: "running",
      startDate: "01/10/2024",
      endDate: "31/12/2024",
    },
    {
      id: 3,
      name: "Product Launch",
      description: "Ra mắt sản phẩm mới",
      budget: 3500000,
      spent: 3500000,
      clicks: 8900,
      leads: 280,
      revenue: "₫6,200,000",
      status: "completed",
      startDate: "15/09/2024",
      endDate: "15/10/2024",
    },
  ])

  const handleCreateCampaign = (data) => {
    const newCampaign = {
      id: campaigns.length + 1,
      ...data,
      budget: Number.parseInt(data.budget),
      spent: 0,
      clicks: 0,
      leads: 0,
      revenue: "₫0",
    }
    setCampaigns([...campaigns, newCampaign])
    setShowCampaignForm(false)
  }

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign)
    setShowCampaignForm(true)
  }

  const handleUpdateCampaign = (data) => {
    setCampaigns(
      campaigns.map((c) => (c.id === editingCampaign.id ? { ...c, ...data, budget: Number.parseInt(data.budget) } : c)),
    )
    setShowCampaignForm(false)
    setEditingCampaign(null)
  }

  const handleDeleteCampaign = (campaign) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaign.id))
    setShowCampaignDetail(false)
  }

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign)
    setShowCampaignDetail(true)
  }

  const handleToggleCampaignStatus = () => {
    if (selectedCampaign) {
      const newStatus = selectedCampaign.status === "running" ? "paused" : "running"
      setCampaigns(campaigns.map((c) => (c.id === selectedCampaign.id ? { ...c, status: newStatus } : c)))
      setSelectedCampaign({ ...selectedCampaign, status: newStatus })
    }
  }

  return (
    <div className="space-y-6 text-gray-900 admin-dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý chiến dịch</h2>
          <p className="text-muted-foreground admin-dark:text-gray-400">
            Theo dõi và quản lý các chiến dịch marketing
          </p>
        </div>
        <Button
          theme="admin"
          className="bg-primary hover:bg-primary/90 admin-dark:bg-blue-600 admin-dark:hover:bg-blue-500"
          onClick={() => setShowCampaignForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo chiến dịch mới
        </Button>
      </div>

      <CampaignsTable
        campaigns={campaigns}
        onView={handleViewCampaign}
        onEdit={handleEditCampaign}
        onDelete={(campaign) => {
          setCampaigns(campaigns.filter((c) => c.id !== campaign.id))
        }}
      />

      {/* Campaign Modals */}
      <Dialog open={showCampaignForm} onOpenChange={setShowCampaignForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white admin-dark:bg-gray-800">
          <CampaignForm
            onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
            onCancel={() => {
              setShowCampaignForm(false)
              setEditingCampaign(null)
            }}
            initialData={editingCampaign}
          />
        </DialogContent>
      </Dialog>

      <CampaignDetailModal
        campaign={selectedCampaign}
        isOpen={showCampaignDetail}
        onClose={() => {
          setShowCampaignDetail(false)
          setSelectedCampaign(null)
        }}
        onEdit={() => {
          setShowCampaignDetail(false)
          handleEditCampaign(selectedCampaign)
        }}
        onDelete={() => handleDeleteCampaign(selectedCampaign)}
        onToggleStatus={handleToggleCampaignStatus}
      />
    </div>
  )
}
