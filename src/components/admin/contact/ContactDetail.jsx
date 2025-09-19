
import Modal from "../common/Modal"

export default function ContactDetail({ contact, isOpen, onClose, onStatusChange }) {
  if (!contact) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}  title="Chi tiết liên hệ" >
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-black">Họ tên</label>
      <p className="text-black">{contact.ho_ten}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-black">Email</label>
      <p className="text-black">{contact.email}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-black">Số điện thoại</label>
      <p className="text-black">{contact.so_dien_thoai}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-black">Nội dung</label>
      <p className="text-black bg-gray-50 p-3 rounded">{contact.noi_dung}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-black">Ngày gửi</label>
      <p className="text-black">{contact.ngay_gui}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-black">Trạng thái</label>
      <select
        value={contact.trang_thai}
        onChange={(e) => onStatusChange(contact.id, e.target.value)}
        className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="Chưa phản hồi">Chưa phản hồi</option>
        <option value="Đã phản hồi">Đã phản hồi</option>
      </select>
    </div>
  </div>
</Modal>

  )
}
