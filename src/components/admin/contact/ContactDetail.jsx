
import Modal from "../common/Modal";

export default function ContactDetail({ contact, isOpen, onClose, onStatusChange }) {
  if (!contact) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết liên hệ">
      <div className="space-y-2 sm:text-base">
        {/* Họ tên */}
        <div>
          <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
            Họ tên
          </span>
          <p className="text-gray-900 shadow admin-dark:text-gray-300 bg-gray-100 admin-dark:bg-gray-700 rounded-md px-3 py-2">
            {contact.ho_ten}
          </p>
        </div>

        {/* Email */}
        <div>
          <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
            Email
          </span>
          <p className="text-gray-900 shadow admin-dark:text-gray-300 bg-gray-100 admin-dark:bg-gray-700 rounded-md px-3 py-2">
            {contact.email}
          </p>
        </div>

        {/* Số điện thoại */}
        <div>
          <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
            Số điện thoại
          </span>
          <p className="text-gray-900 shadow admin-dark:text-gray-300 bg-gray-100 admin-dark:bg-gray-700 rounded-md px-3 py-2">
            {contact.so_dien_thoai}
          </p>
        </div>

        {/* Nội dung */}
        <div>
          <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
            Nội dung
          </span>
          <textarea
            readOnly
            rows={3}
            className="w-full shadow px-3 py-2 rounded-md bg-gray-100 text-gray-900
      admin-dark:bg-gray-700 admin-dark:text-gray-200
      focus:outline-none
      whitespace-pre-line resize-none"
            value={contact.noi_dung}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-5 justify-start">
          {/* Ngày gửi */}
          <div>
            <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
              Ngày gửi
            </span>
            <p className="text-gray-900 shadow admin-dark:text-gray-300 bg-gray-100 admin-dark:bg-gray-700 rounded-md px-3 py-2">
              {contact.ngay_gui}
            </p>
          </div>

          {/* Trạng thái */}
          <div>
            <span className="block text-sm sm:text-base font-medium text-gray-800 admin-dark:text-gray-100 mb-1">
              Trạng thái
            </span>
            <select
              value={contact.trang_thai}
              onChange={(e) => onStatusChange(contact.id, e.target.value)}
              className="w-full shadow px-3 py-2 border border-gray-300 admin-dark:border-gray-600 rounded-md bg-gray-100 admin-dark:bg-gray-700 text-gray-800 admin-dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
            >
              <option value="Chưa phản hồi">Chưa phản hồi</option>
              <option value="Đã phản hồi">Đã phản hồi</option>
            </select>
          </div>
        </div>

      </div>
    </Modal>
  )
}
