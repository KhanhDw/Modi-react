
import Modal from "../common/Modal"

export default function ContactDetail({ contact, isOpen, onClose, onStatusChange }) {
  if (!contact) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết liên hệ">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ tên</label>
          <p className="text-gray-900">{contact.ho_ten}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-gray-900">{contact.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <p className="text-gray-900">{contact.so_dien_thoai}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded">{contact.noi_dung}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày gửi</label>
          <p className="text-gray-900">{contact.ngay_gui}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <select
            value={contact.trang_thai}
            onChange={(e) => onStatusChange(contact.id, e.target.value)}
            className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Chưa phản hồi">Chưa phản hồi</option>
            <option value="Đã phản hồi">Đã phản hồi</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}
