export const skeleton = {
  // [FIX] Bỏ border, chỉ giữ padding và layout ngoài
  container:
    "hidden md:block w-full p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-3xl shadow-xl",
  // [FIX] Wrapper giờ sẽ chịu trách nhiệm cho border, bo góc và cuộn
  tableWrapper:
    "overflow-x-auto rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/80 shadow-inner",
  table:
    "w-full border-collapse min-w-[700px] md:min-w-[900px] lg:min-w-[1024px]",
  header: "sticky top-0 z-20",
  stageRow: "flex",
  // [FIX] Bo góc trên bên trái
  stageHeaderCell:
    "py-4 px-4 sm:py-5 sm:px-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 sticky left-0 z-30 w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-b-2 border-slate-200 dark:border-slate-700 first:rounded-tl-2xl",
  stageHeaderPulse:
    "h-7 sm:h-8 lg:h-9 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg w-3/4 animate-pulse",
  // [FIX] Bo góc trên bên phải
  stageDataCell:
    "py-4 px-4 sm:py-5 sm:px-6 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 min-w-[160px] lg:min-w-[170px] border-b-2 border-slate-200 dark:border-slate-700 last:rounded-tr-2xl",
  stageDataPulse:
    "h-7 sm:h-8 lg:h-9 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg w-2/3 mx-auto animate-pulse",
  serviceNameRow: "flex bg-slate-50/80 dark:bg-slate-800/40",
  serviceNameHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-30 w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm",
  serviceNameHeaderPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 animate-pulse",
  serviceNameDataCell:
    "py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[120px] lg:min-w-[140px]",
  serviceNameDataPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 rounded-md w-4/5 mx-auto animate-pulse",
  body: "",
  // [FIX] Thêm group để dùng group-last: ở cell, và xử lý bo góc cho hàng cuối
  bodyRow: "flex transition-colors group",
  // [FIX] Bỏ border dưới nếu là hàng cuối, bo góc dưới bên trái
  bodyHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 group-last:border-b-0 group-last:rounded-bl-2xl",
  bodyHeaderPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 rounded-md w-full animate-pulse",
  // [FIX] Bỏ border dưới nếu là hàng cuối, bo góc dưới bên phải cho ô cuối
  bodyDataCell:
    "py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-200/60 dark:border-slate-600/60 flex justify-center items-center min-w-[110px] md:min-w-[120px] lg:min-w-[140px] group-last:border-b-0 last:group-last:rounded-br-2xl",
  bodyDataPulse:
    "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse",
  loadingIndicatorContainer:
    "mt-5 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-500 dark:text-slate-400",
  loadingDot: "w-2 h-2 bg-indigo-500 rounded-full animate-bounce",
  loadingText: "ml-2 font-medium",
  mobileHint:
    "mt-3 text-center text-sm sm:text-base text-slate-400 dark:text-slate-500 md:hidden flex items-center justify-center gap-2",
};

export const errorState = {
  // Thêm padding lớn hơn, giới hạn max-w để không quá rộng
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-xl max-w-lg lg:max-w-xl mx-auto my-10",
  iconWrapper: "relative",
  iconBlur:
    "absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-red-600 dark:text-red-400 mb-4",
  // Tăng kích thước chữ cho tiêu đề
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-red-700 dark:text-red-400 mb-3",
  // Tăng kích thước chữ cho message
  message:
    "text-sm sm:text-base lg:text-lg text-red-600/90 dark:text-red-400/90 text-center leading-relaxed mb-6 max-w-md",
  // Tăng kích thước chữ cho button
  retryButton:
    "flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-sm sm:text-base lg:text-lg",
  retryIcon: "w-4 h-4 lg:w-5 lg:h-5",
};

export const missingDataState = {
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 max-w-2xl lg:max-w-3xl mx-auto my-10",
  iconWrapper: "relative mb-6",
  iconBlur:
    "absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-2xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-amber-600 dark:text-amber-400",
  // Tăng kích thước chữ
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-amber-800 dark:text-amber-300 mb-3",
  message:
    "text-sm sm:text-base lg:text-lg text-amber-700/90 dark:text-amber-400/90 mb-8 text-center max-w-md leading-relaxed",
  list: "space-y-3 w-full max-w-md",
  item: "flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm",
  itemIcon: "text-2xl mt-0.5",
  itemTitle:
    "font-semibold text-amber-900 dark:text-amber-200 text-base lg:text-lg",
  itemText:
    "text-xs sm:text-sm lg:text-base text-amber-700 dark:text-amber-400",
};

export const invalidDataState = {
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 max-w-2xl lg:max-w-3xl mx-auto my-10",
  iconWrapper: "relative mb-6",
  iconBlur:
    "absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-2xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-blue-600 dark:text-blue-400",
  // Tăng kích thước chữ
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 dark:text-blue-300 mb-3",
  message:
    "text-sm sm:text-base lg:text-lg text-blue-700/90 dark:text-blue-400/90 mb-8 text-center max-w-md leading-relaxed",
  detailsBox:
    "w-full max-w-md bg-white/60 dark:bg-slate-800/40 p-6 rounded-xl border border-blue-300 dark:border-blue-700",
  detailsTitle:
    "font-bold text-blue-900 dark:text-blue-200 mb-4 text-base sm:text-lg lg:text-xl",
  list: "space-y-3",
  listItem: "flex items-start gap-3",
  listIcon: "text-blue-600 dark:text-blue-400 text-xl mt-0.5",
  listItemText:
    "text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-300 leading-relaxed",
  codeSnippet:
    "px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded font-mono text-sm lg:text-base",
  footerText:
    "text-xs sm:text-sm lg:text-base text-blue-600/70 dark:text-blue-400/70 mt-6 text-center",
};

export const tableStyles = {
  // [FIX] Bỏ border và overflow, chỉ giữ layout ngoài
  container:
    "hidden md:block w-full p-3 sm:p-6 lg:p-8 rounded-3xl animate-fade-in",
  // [FIX] Wrapper chịu trách nhiệm cho border, bo góc và cuộn
  wrapper:
    "max-h-[75vh] overflow-auto rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/80 shadow-inner",
  table:
    "w-full border-collapse min-w-[700px] table-auto md:min-w-[900px] lg:min-w-[1024px]",
  thead: "text-sm sticky top-0 z-20 bg-white dark:bg-slate-900", // Thêm bg để không bị trong suốt khi cuộn
  stageHeaderRow: "",
  // [FIX] Bo góc trên bên trái
  stageHeaderCell:
    "py-4 px-4 sm:py-5 sm:px-6 text-left font-bold text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 dark:bg-gray-800 bg-gray-100 sticky left-0 z-40 w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px]  shadow-sm first:rounded-tl-2xl",
  // [FIX] Bo góc trên bên phải cho ô cuối
  stageColumnHeaderBase:
    "border-b-4 py-4 px-3 sm:py-5 sm:px-4 text-center font-bold text-sm sm:text-base md:text-lg last:rounded-tr-2xl",
  stageColumnStyles: [
    {
      border: "border-b-blue-500 dark:border-b-blue-400",
      text: "text-blue-700 dark:text-blue-300",
      bg: "bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    },
    {
      border: "border-b-emerald-500 dark:border-b-emerald-400",
      text: "text-emerald-700 dark:text-emerald-300",
      bg: "bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
    },
    {
      border: "border-b-purple-500 dark:border-b-purple-400",
      text: "text-purple-700 dark:text-purple-300",
      bg: "bg-gradient-to-b from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
    },
    {
      border: "border-b-orange-500 dark:border-b-orange-400",
      text: "text-orange-700 dark:text-orange-300",
      bg: "bg-gradient-to-b from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20",
    },
  ],
  serviceHeaderRow: "bg-slate-50 dark:bg-slate-800 backdrop-blur-sm ",
  serviceHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b text-left font-semibold text-sm sm:text-base text-slate-600 dark:text-slate-400 sticky left-0 z-30 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700/60 shadow-sm",
  serviceColumnHeader:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 text-center font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 min-w-[110px] md:min-w-[120px] lg:min-w-[140px] hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors",
  emptyHeaderCell:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[120px] lg:min-w-[140px]",
  tbody: "text-sm",
  // [FIX] Thêm `group` để dùng `group-last:` ở các cell con
  rowBase: "group",
  rowEven: "bg-white/50 dark:bg-slate-900/20",
  rowOdd: "bg-slate-50/30 dark:bg-slate-800/10",
  // [FIX] Bỏ border dưới nếu là hàng cuối, bo góc dưới bên trái
  titleCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b text-left font-semibold text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 sticky left-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 transition-colors group-last:border-b-0 group-last:rounded-bl-2xl",
  // [FIX] Bỏ border dưới nếu là hàng cuối, bo góc dưới bên phải cho ô cuối
  serviceCell:
    "w-50 py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 text-center min-w-50 md:min-w-50 group-last:border-b-0 last:group-last:rounded-br-2xl",
  checkIconWrapper: "flex justify-center",
  checkIconInnerWrapper: "relative group/icon",
  checkIconBlur:
    "absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity",
  checkIcon:
    "relative w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 group-hover/icon:scale-110 transition-transform duration-200",
  emptyCellIndicator: "text-slate-300 dark:text-slate-700 text-xs",
  emptyCell:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 min-w-[110px] md:min-w-[130px] group-last:border-b-0 last:group-last:rounded-br-2xl",
  mobileScrollHint:
    "mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 md:hidden",
  mobileScrollHintIcon: "text-lg",
  mobileScrollHintText: "font-medium",
};
