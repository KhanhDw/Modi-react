import React, { useState, useRef, useEffect } from "react"

// Dữ liệu mẫu cho bảng
const tableData = [
  {
    id: 1,
    name: "Sản phẩm A",
    col1: "100",
    col2: "200",
    col3: "300",
    col4: "400",
    col5: "500",
    col6: "600",
    col7: "700",
    col8: "800",
  },
  {
    id: 2,
    name: "Sản phẩm B",
    col1: "150",
    col2: "250",
    col3: "350",
    col4: "450",
    col5: "550",
    col6: "650",
    col7: "750",
    col8: "850",
  },
  {
    id: 3,
    name: "Sản phẩm C",
    col1: "120",
    col2: "220",
    col3: "320",
    col4: "420",
    col5: "520",
    col6: "620",
    col7: "720",
    col8: "820",
  },
  {
    id: 4,
    name: "Sản phẩm D",
    col1: "180",
    col2: "280",
    col3: "380",
    col4: "480",
    col5: "580",
    col6: "680",
    col7: "780",
    col8: "880",
  },
  {
    id: 5,
    name: "Sản phẩm E",
    col1: "110",
    col2: "210",
    col3: "310",
    col4: "410",
    col5: "510",
    col6: "610",
    col7: "710",
    col8: "810",
  },
]

const columnHeaders = ["Cột 1", "Cột 2", "Cột 3", "Cột 4", "Cột 5", "Cột 6", "Cột 7", "Cột 8"]

const stageConfig = [
  { name: "Stage 1", colSpan: 2, startCol: 0 }, // Cột 1, 2
  { name: "Stage 2", colSpan: 3, startCol: 2 }, // Cột 3, 4, 5
  { name: "Stage 3", colSpan: 3, startCol: 5 }, // Cột 6, 7, 8
]

export default function PricingSlider() {
  const allColumns = [...Array(8)].map((_, i) => i)
  const doubledColumns = [...allColumns, ...allColumns] // Nhân đôi mảng để tạo vòng lặp

  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [startX, setStartX] = useState(0)
  const [currentTransform, setCurrentTransform] = useState(0)

  // Refs
  const containerRef = useRef(null)
  const scrollWidthRef = useRef(0)
  const animationRef = useRef()
  const speed = 0.5 // Tốc độ cuộn (pixel/frame)

  // 1. Tính toán Chiều rộng Chính xác của 8 Cột
  useEffect(() => {
    if (containerRef.current) {
      // Lấy phần tử chứa 16 cột
      const innerContent = containerRef.current.querySelector(".flex-1 .flex")
      if (innerContent) {
        // Chiều rộng 8 cột = Chiều rộng 16 cột / 2
        scrollWidthRef.current = innerContent.scrollWidth / 2
      }
    }
  }, [])

  // 2. Logic Cuộn Tự Động (requestAnimationFrame)
  useEffect(() => {
    if (isHovered) {
      // Dừng animation khi hover
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const scrollWidth = scrollWidthRef.current
    if (scrollWidth === 0) return

    const animate = () => {
      setCurrentTransform((prevTransform) => {
        let newTransform = prevTransform - speed // Cuộn sang trái

        // Vòng lặp cho Animation Tự Động (từ 8 về 1)
        if (newTransform < -scrollWidth) {
          newTransform = newTransform + scrollWidth
        }

        return newTransform
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  // 3. Xử lý Sự kiện Chuột/Kéo Thả
  const handleMouseDown = (e) => {
    if (!isHovered) return
    setIsDragging(true)
    setStartX(e.clientX)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !isHovered) return
    const deltaX = e.clientX - startX
    setDragOffset(deltaX)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      let newTransform = currentTransform + dragOffset
      const scrollWidth = scrollWidthRef.current

      if (scrollWidth > 0) {
        // Kéo qua phải, vượt quá 8 cột (quá âm) -> Quay lại vị trí 1
        if (newTransform < -scrollWidth) {
          newTransform += scrollWidth
        }
        // Kéo qua trái, vượt quá cột 1 (quá dương) -> Quay lại vị trí 8
        else if (newTransform > 0) {
          newTransform -= scrollWidth
        }
      }

      setCurrentTransform(newTransform)
      setDragOffset(0)
      setIsDragging(false)
    }
  }

  const handleMouseLeave = () => {
    // Xử lý logic vòng lặp nếu người dùng đang kéo khi rời chuột
    if (isDragging) {
      let newTransform = currentTransform + dragOffset
      const scrollWidth = scrollWidthRef.current

      if (scrollWidth > 0) {
        // Kéo qua phải (quá âm) -> Quay lại vị trí 1
        if (newTransform < -scrollWidth) {
          newTransform += scrollWidth
        }
        // Kéo qua trái (quá dương) -> Quay lại vị trí 8
        else if (newTransform > 0) {
          newTransform -= scrollWidth
        }
      }

      setCurrentTransform(newTransform)
      setDragOffset(0)
      setIsDragging(false)
    }
    // Dừng chế độ hover để animation tự động tiếp tục
    setIsHovered(false)
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden bg-card rounded-lg border border-border shadow-lg table-hover-container ${isHovered ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Stage Header */}
      <div className="flex bg-primary text-primary-foreground">
        <div className="w-48 flex-shrink-0 p-3 border-r border-border font-bold text-center">Stages</div>
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex"
            style={{
              // Đặt chiều rộng tương đối lớn để chứa 16 cột
              width: `${(doubledColumns.length * 100) / 3}%`,
              transform: `translateX(${currentTransform + dragOffset}px)`,
            }}
          >
            {doubledColumns.map((colIndex, displayIndex) => {
              const isStageStart = stageConfig.some((stage) => stage.startCol === colIndex)
              if (!isStageStart) return null

              const currentStage = stageConfig.find((stage) => stage.startCol === colIndex)
              if (!currentStage) return null

              return (
                <div
                  key={`stage-${colIndex}-${displayIndex}`}
                  className="p-3 border-r border-border font-bold text-center flex-shrink-0 bg-primary/90"
                  style={{
                    width: `${(currentStage.colSpan * 100) / doubledColumns.length}%`,
                  }}
                >
                  {currentStage.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Column Header */}
      <div className="flex bg-muted">
        <div className="w-48 flex-shrink-0 p-4 border-r border-border bg-secondary text-secondary-foreground font-semibold">
          Tên Sản Phẩm
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex"
            style={{
              width: `${(doubledColumns.length * 100) / 3}%`,
              transform: `translateX(${currentTransform + dragOffset}px)`,
            }}
          >
            {doubledColumns.map((colIndex, displayIndex) => (
              <div
                key={`header-${colIndex}-${displayIndex}`}
                className="p-4 border-r border-border bg-muted text-muted-foreground font-semibold text-center flex-shrink-0"
                style={{ width: `${100 / doubledColumns.length}%` }}
              >
                {columnHeaders[colIndex]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {tableData.map((row, rowIndex) => (
          <div key={row.id} className="flex hover:bg-muted/50 transition-colors">
            <div className="w-48 flex-shrink-0 p-4 border-r border-border bg-card text-card-foreground font-medium">
              {row.name}
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div
                className="flex"
                style={{
                  width: `${(doubledColumns.length * 100) / 3}%`,
                  transform: `translateX(${currentTransform + dragOffset}px)`,
                }}
              >
                {doubledColumns.map((colIndex, displayIndex) => {
                  const colKey = `col${colIndex + 1}`
                  return (
                    <div
                      key={`cell-${row.id}-${colIndex}-${displayIndex}`}
                      className="p-4 border-r border-border text-center flex-shrink-0"
                      style={{ width: `${100 / doubledColumns.length}%` }}
                    >
                      {row[colKey]}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer/Status */}
      <div hidden className="bg-muted p-3 border-t border-border">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isHovered ? "Hover để kéo qua trái phải" : "Đang cuộn liên tục qua 8 cột"}
          </span>
          <div className="flex gap-1">
            {allColumns.map((colIndex) => (
              <span
                key={`indicator-${colIndex}`}
                className={`w-2 h-2 bg-primary rounded-full ${!isHovered ? "animate-pulse" : ""}`}
                style={{ animationDelay: `${colIndex * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}