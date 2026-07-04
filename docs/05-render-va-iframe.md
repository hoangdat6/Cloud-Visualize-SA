# 05 — Render & iframe

## Vì sao dùng iframe

Mỗi mô phỏng là một tài liệu HTML **hoàn chỉnh** (`<!DOCTYPE html>`, `<head>`, `<style>`,
`<script>`...). Không thể nhúng trực tiếp vào cây React mà không xung đột CSS/JS toàn cục.
`<iframe>` cho ta:

- **Cách ly CSS/JS**: style và script của file không rò rỉ ra nền tảng và ngược lại.
- **Giữ nguyên hành vi**: file chạy đúng y như khi mở trực tiếp trong trình duyệt.
- **Đơn giản**: chỉ cần trỏ `src` tới đường dẫn file trong `public/`.

## Cùng origin

File HTML nằm trong `public/simulations/` nên được phục vụ cùng origin với site. Nhờ đó:

- Không vướng CORS.
- Script nội bộ của file (nếu có) chạy bình thường.
- Đường dẫn tương đối trong file (ảnh, asset) hoạt động nếu đặt đúng chỗ.

## Thuộc tính sandbox

```html
<iframe
  src="/simulations/....html"
  sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
></iframe>
```

| Token | Mục đích |
|-------|----------|
| `allow-scripts` | Cho phép JS của file chạy (zoom/pan, mô phỏng luồng...) |
| `allow-same-origin` | Cho file truy cập tài nguyên cùng origin, giữ hành vi đầy đủ |
| `allow-popups` | Cho phép mở link/tab mới nếu file cần |
| `allow-modals` | Cho phép `alert`/`confirm` nếu file dùng |
| `allow-forms` | Cho phép submit form nội bộ nếu có |

## Đánh đổi bảo mật

- Đây là **nội dung do chính chủ sở hữu kiểm soát** (không phải nội dung người lạ tải lên), nên
  rủi ro thực tế thấp.
- Kết hợp `allow-scripts` + `allow-same-origin` về lý thuyết cho phép script trong iframe truy
  cập DOM cùng origin. Vì tất cả nội dung đều do chủ sở hữu tin cậy tạo ra và site **không có
  dữ liệu người dùng/nhạy cảm** nào, ta chấp nhận đánh đổi này để file chạy trọn vẹn.
- **Lưu ý cho tương lai**: nếu sau này mở cho người ngoài đóng góp file HTML, nên bỏ
  `allow-same-origin`, hoặc phục vụ nội dung từ một origin/subdomain riêng để cô lập triệt để.

## Kích thước & khung nhìn

- `iframe` chiếm toàn bộ chiều cao còn lại dưới header (dùng flex layout: header cố định,
  iframe `flex-1`).
- Bản thân file DX đã tự xử lý responsive + zoom/pan bên trong, nên nền tảng không cần can thiệp
  scaling.

## Trạng thái tải

- Có thể hiển thị một lớp "Đang tải mô phỏng..." mờ dần khi iframe phát sự kiện `load`
  (tuỳ chọn, cải thiện trải nghiệm với file nặng).
