export const skeleton = {
  container:
    "hidden md:block w-full p-3 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 admin-dark:bg-gray-950 rounded-3xl shadow-xl",
  tableWrapper:
    "overflow-x-auto rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/80 admin-dark:border-gray-800/80 shadow-inner",
  table:
    "w-full border-collapse min-w-[700px] md:min-w-[900px] lg:min-w-[1024px]",
  header: "sticky top-0 z-20",
  stageRow: "flex",
  stageHeaderCell:
    "py-4 px-4 sm:py-5 sm:px-6 bg-slate-50 dark:bg-slate-800 admin-dark:bg-gray-900 sticky left-0 z-30 w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-b-2 border-slate-200 dark:border-slate-700 admin-dark:border-gray-800 first:rounded-tl-2xl",
  stageHeaderPulse:
    "h-7 sm:h-8 lg:h-9 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-lg w-3/4 animate-pulse",
  stageDataCell:
    "py-4 px-4 sm:py-5 sm:px-6 bg-slate-50 dark:bg-slate-800 admin-dark:bg-gray-900 min-w-[160px] lg:min-w-[170px] border-b-2 border-slate-200 dark:border-slate-700 admin-dark:border-gray-800 last:rounded-tr-2xl",
  stageDataPulse:
    "h-7 sm:h-8 lg:h-9 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse",
  serviceNameRow:
    "flex bg-slate-50/80 dark:bg-slate-800/40 admin-dark:bg-gray-900/40",
  serviceNameHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-30 w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 admin-dark:border-gray-800 bg-slate-50/90 dark:bg-slate-800/90 admin-dark:bg-gray-900/90 backdrop-blur-sm",
  serviceNameHeaderPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-md w-1/2 animate-pulse",
  serviceNameDataCell:
    "py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 min-w-[110px] md:min-w-[120px] lg:min-w-[140px]",
  serviceNameDataPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-md w-4/5 mx-auto animate-pulse",
  body: "",
  bodyRow: "flex transition-colors group",
  bodyHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b sticky left-0 z-10 bg-white/90 dark:bg-slate-800/90 admin-dark:bg-gray-900/90 backdrop-blur-sm w-[120px] sm:w-[180px] lg:w-[200px] min-w-[120px] sm:min-w-[180px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 admin-dark:border-gray-800 group-last:border-b-0 group-last:rounded-bl-2xl",
  bodyHeaderPulse:
    "h-5 sm:h-6 lg:h-7 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-md w-full animate-pulse",
  bodyDataCell:
    "py-3 px-3 sm:py-4 sm:px-4 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 flex justify-center items-center min-w-[110px] md:min-w-[120px] lg:min-w-[140px] group-last:border-b-0 last:group-last:rounded-br-2xl",
  bodyDataPulse:
    "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-slate-200 dark:bg-slate-700 admin-dark:bg-gray-800 rounded-full animate-pulse",
  loadingIndicatorContainer:
    "mt-5 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 admin-dark:text-gray-400",
  loadingDot: "w-2 h-2 bg-indigo-500 rounded-full animate-bounce",
  loadingText: "ml-2 font-medium",
  mobileHint:
    "mt-3 text-center text-sm sm:text-base text-slate-400 dark:text-slate-500 admin-dark:text-gray-500 md:hidden flex items-center justify-center gap-2",
};

export const errorState = {
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-red-50 dark:bg-red-950/20 admin-dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 admin-dark:border-red-900 rounded-2xl shadow-xl max-w-lg lg:max-w-xl mx-auto my-10",
  iconWrapper: "relative",
  iconBlur:
    "absolute inset-0 bg-red-500/20 dark:bg-red-500/10 admin-dark:bg-red-600/10 rounded-full blur-xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-red-600 dark:text-red-400 admin-dark:text-red-500 mb-4",
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-red-700 dark:text-red-400 admin-dark:text-red-500 mb-3",
  message:
    "text-sm sm:text-base lg:text-lg text-red-600/90 dark:text-red-400/90 admin-dark:text-red-500/90 text-center leading-relaxed mb-6 max-w-md",
  retryButton:
    "flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 admin-dark:bg-red-800 admin-dark:hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-sm sm:text-base lg:text-lg",
  retryIcon: "w-4 h-4 lg:w-5 lg:h-5",
};

export const missingDataState = {
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-amber-50 dark:bg-amber-950/20 admin-dark:bg-amber-950/30 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 admin-dark:border-amber-900 max-w-2xl lg:max-w-3xl mx-auto my-10",
  iconWrapper: "relative mb-6",
  iconBlur:
    "absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 admin-dark:bg-amber-600/10 rounded-full blur-2xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-amber-600 dark:text-amber-400 admin-dark:text-amber-500",
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-amber-800 dark:text-amber-300 admin-dark:text-amber-400 mb-3",
  message:
    "text-sm sm:text-base lg:text-lg text-amber-700/90 dark:text-amber-400/90 admin-dark:text-amber-500/90 mb-8 text-center max-w-md leading-relaxed",
  list: "space-y-3 w-full max-w-md",
  item: "flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 admin-dark:bg-gray-900/40 rounded-xl border border-amber-300 dark:border-amber-700 admin-dark:border-amber-800 shadow-sm",
  itemIcon: "text-2xl mt-0.5",
  itemTitle:
    "font-semibold text-amber-900 dark:text-amber-200 admin-dark:text-amber-300 text-base lg:text-lg",
  itemText:
    "text-xs sm:text-sm lg:text-base text-amber-700 dark:text-amber-400 admin-dark:text-amber-500",
};

export const invalidDataState = {
  container:
    "hidden md:flex flex-col items-center justify-center p-8 sm:p-10 lg:p-12 bg-blue-50 dark:bg-blue-950/20 admin-dark:bg-blue-950/30 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 admin-dark:border-blue-900 max-w-2xl lg:max-w-3xl mx-auto my-10",
  iconWrapper: "relative mb-6",
  iconBlur:
    "absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 admin-dark:bg-blue-600/10 rounded-full blur-2xl",
  icon: "relative w-16 h-16 lg:w-20 lg:h-20 text-blue-600 dark:text-blue-400 admin-dark:text-blue-500",
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 dark:text-blue-300 admin-dark:text-blue-400 mb-3",
  message:
    "text-sm sm:text-base lg:text-lg text-blue-700/90 dark:text-blue-400/90 admin-dark:text-blue-500/90 mb-8 text-center max-w-md leading-relaxed",
  detailsBox:
    "w-full max-w-md bg-white/60 dark:bg-slate-800/40 admin-dark:bg-gray-900/40 p-6 rounded-xl border border-blue-300 dark:border-blue-700 admin-dark:border-blue-800",
  detailsTitle:
    "font-bold text-blue-900 dark:text-blue-200 admin-dark:text-blue-300 mb-4 text-base sm:text-lg lg:text-xl",
  list: "space-y-3",
  listItem: "flex items-start gap-3",
  listIcon:
    "text-blue-600 dark:text-blue-400 admin-dark:text-blue-500 text-xl mt-0.5",
  listItemText:
    "text-sm sm:text-base lg:text-lg text-blue-800 dark:text-blue-300 admin-dark:text-blue-400 leading-relaxed",
  codeSnippet:
    "px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 admin-dark:bg-blue-950/50 rounded font-mono text-sm lg:text-base",
  footerText:
    "text-xs sm:text-sm lg:text-base text-blue-600/70 dark:text-blue-400/70 admin-dark:text-blue-500/70 mt-6 text-center",
};

export const tableStyles = {
  container:
    "hidden md:block w-full p-3 sm:p-6 lg:p-8 rounded-3xl animate-fade-in",
  wrapper:
    "max-h-[75vh] overflow-auto rounded-2xl border-2 border-slate-200/80 dark:border-slate-700/80 admin-dark:border-gray-800/80 shadow-inner",
  table:
    "w-full border-collapse min-w-[700px] table-auto md:min-w-[900px] lg:min-w-[1024px]",
  thead:
    "text-sm sticky top-0 z-20 bg-white dark:bg-slate-900 admin-dark:bg-gray-950",
  stageHeaderRow: "",
  stageHeaderCell:
    "py-4 px-4 sm:py-5 sm:px-6 text-left font-bold text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 admin-dark:text-gray-300 bg-gray-100 dark:bg-gray-800 admin-dark:bg-gray-900 sticky left-0 z-40 w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px] shadow-sm first:rounded-tl-2xl",
  stageColumnHeaderBase:
    "border-b-4 py-4 px-3 sm:py-5 sm:px-4 text-center font-bold text-sm sm:text-base md:text-lg last:rounded-tr-2xl",
  stageColumnStyles: [
    {
      border:
        "border-b-blue-500 dark:border-b-blue-400 admin-dark:border-b-blue-500",
      text: "text-blue-700 dark:text-blue-300 admin-dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 admin-dark:bg-blue-950/40",
    },
    {
      border:
        "border-b-emerald-500 dark:border-b-emerald-400 admin-dark:border-b-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300 admin-dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30 admin-dark:bg-emerald-950/40",
    },
    {
      border:
        "border-b-purple-500 dark:border-b-purple-400 admin-dark:border-b-purple-500",
      text: "text-purple-700 dark:text-purple-300 admin-dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30 admin-dark:bg-purple-950/40",
    },
    {
      border:
        "border-b-orange-500 dark:border-b-orange-400 admin-dark:border-b-orange-500",
      text: "text-orange-700 dark:text-orange-300 admin-dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30 admin-dark:bg-orange-950/40",
    },
  ],
  serviceHeaderRow:
    "bg-slate-50 dark:bg-slate-800 admin-dark:bg-gray-900 backdrop-blur-sm",
  serviceHeaderCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b text-left font-semibold text-sm sm:text-base text-slate-600 dark:text-slate-400 admin-dark:text-gray-400 sticky left-0 z-30 bg-slate-50/95 dark:bg-slate-800/95 admin-dark:bg-gray-900/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700/60 admin-dark:border-gray-800/60 shadow-sm",
  serviceColumnHeader:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 text-center font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 admin-dark:text-gray-300 min-w-[110px] md:min-w-[120px] lg:min-w-[140px] hover:bg-slate-100/50 dark:hover:bg-slate-700/30 admin-dark:hover:bg-gray-800/30 transition-colors",
  emptyHeaderCell:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 min-w-[110px] md:min-w-[120px] lg:min-w-[140px]",
  tbody: "text-sm",
  rowBase: "group",
  rowEven: "bg-white/50 dark:bg-slate-900/20 admin-dark:bg-gray-950/20",
  rowOdd: "bg-slate-50/30 dark:bg-slate-800/10 admin-dark:bg-gray-900/10",
  titleCell:
    "py-3 px-4 sm:py-4 sm:px-6 border-b text-left font-semibold text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 admin-dark:text-gray-200 sticky left-0 z-10 bg-white/95 dark:bg-slate-800/95 admin-dark:bg-gray-900/95 backdrop-blur-sm w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px] lg:w-[200px] lg:min-w-[200px] border-r border-slate-200 dark:border-slate-700 admin-dark:border-gray-800 shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50 admin-dark:group-hover:bg-gray-800/50 transition-colors group-last:border-b-0 group-last:rounded-bl-2xl",
  serviceCell:
    "w-50 py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 text-center min-w-50 md:min-w-50 group-last:border-b-0 last:group-last:rounded-br-2xl",
  checkIconWrapper: "flex justify-center",
  checkIconInnerWrapper: "relative group/icon",
  checkIconBlur:
    "absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/20 admin-dark:bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity",
  checkIcon:
    "relative w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 admin-dark:text-indigo-500 group-hover/icon:scale-110 transition-transform duration-200",
  emptyCellIndicator:
    "text-slate-300 dark:text-slate-700 admin-dark:text-gray-700 text-xs",
  emptyCell:
    "py-3 px-2 sm:py-4 sm:px-3 border-b border-slate-200/60 dark:border-slate-600/60 admin-dark:border-gray-700/60 min-w-[110px] md:min-w-[130px] group-last:border-b-0 last:group-last:rounded-br-2xl",
  mobileScrollHint:
    "mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 admin-dark:text-gray-400 md:hidden",
  mobileScrollHintIcon: "text-lg",
  mobileScrollHintText: "font-medium",
};
