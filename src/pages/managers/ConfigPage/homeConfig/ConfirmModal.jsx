function ConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white admin-dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[350px]">
        <h3 className="text-lg font-semibold text-gray-800 admin-dark:text-gray-100">
          Xác nhận hành động
        </h3>
        <p className="mt-2 text-sm text-gray-600 admin-dark:text-gray-300">
          Hành động này sẽ cập nhật ngay lập tức trạng thái hiển thị. Bạn có
          chắc chắn muốn thay đổi?
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 bg-gray-100 hover:bg-gray-200 admin-dark:bg-gray-700 admin-dark:text-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
