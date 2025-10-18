git log --no-merges --pretty="%aN" --numstat | awk '
# Khi có 3 cột: số dòng thêm, số dòng xóa, và tên file
NF == 3 { added[author] += $1; deleted[author] += $2; total[author] += $1 + $2; next }

# Khi chỉ có 1 cột: đó là tên tác giả
NF == 1 { author = $0; next }

END {
  printf "%-25s %10s %10s %10s\n", "Author", "Total", "Added", "Deleted"
  for (a in total)
    printf "%-25s %10d %10d %10d\n", a, total[a], added[a], deleted[a]
}' | sort -k2 -nr
