"use client"

export default function FormButtons({ onSubmit, onCancel, submitText = "Lưu", isEditing = false }) {
  return (
    <div className="flex space-x-2">
      <button
        type="submit"
        onClick={onSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {isEditing ? "Cập nhật" : submitText}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        Hủy
      </button>
    </div>
  )
}
