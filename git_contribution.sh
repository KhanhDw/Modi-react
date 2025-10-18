#!/bin/bash
# ========================================================
# 📊 GIT CONTRIBUTION ANALYZER
# Tính công sức từng thành viên (bỏ merge commit)
# Công thức: Score = Added + Deleted * 0.5
# ========================================================

echo "🔍 Đang phân tích công sức đóng góp (bỏ qua merge commit)..."
echo "---------------------------------------------------------------------"
echo "| Contribution Score=(Added×1.0)+(Deleted×0.5)"
echo "| Thêm code = 100 % effort"
echo "| Xóa code = 50 % effort (vì refactor cũng có giá trị nhưng ít hơn)"
echo "---------------------------------------------------------------------"
echo
echo "=========================================================="
echo "==================  Contribution Table  =================="
echo "=========================================================="

# Lấy dữ liệu từ git log và xử lý bằng awk
git log --no-merges --pretty="%aN" --numstat | awk '
# Dòng có 1 cột => tên tác giả
NF == 1 { author = $0; next }

# Dòng có 3 cột => số dòng thêm, xóa, và file
NF == 3 {
  added[author] += $1
  deleted[author] += $2
  score[author]  += $1 + ($2 * 0.5)
  totalAdded += $1
  totalDeleted += $2
  totalScore  += $1 + ($2 * 0.5)
  next
}

# Sau khi đọc xong toàn bộ log
END {
  printf "%-25s %10s %10s %10s %10s\n", "Author", "Added", "Deleted", "Score", "Share(%)"
  printf "%s\n", "--------------------------------------------------------------------------"
  for (a in score) {
    percent = (score[a] / totalScore) * 100
    printf "%-25s %10d %10d %10.1f %9.2f%%\n", a, added[a], deleted[a], score[a], percent
  }
  printf "%s\n", "--------------------------------------------------------------------------"
  printf "%-25s %10d %10d %10.1f %9s\n", "TỔNG CỘNG", totalAdded, totalDeleted, totalScore, "100%"
}'
