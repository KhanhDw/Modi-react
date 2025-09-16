export default function slugService(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // xóa dấu
    .replace(/đ/g, "d")                // đ → d
    .replace(/[^a-z0-9\s]/g, "")       // bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-");
}
