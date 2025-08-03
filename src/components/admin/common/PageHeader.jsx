
export default function PageHeader({ title, buttonText, onButtonClick, extra }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center space-x-4">
        {extra && <div className="text-sm text-gray-500">{extra}</div>}
        {buttonText && (
          <button onClick={onButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            ➕ {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}
