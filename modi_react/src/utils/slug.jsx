export default function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")                         // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")          // xóa dấu
    .replace(/[^a-z0-9\s]/g, '')              // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-');                    // space → -
}
