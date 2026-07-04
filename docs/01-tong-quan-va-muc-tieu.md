# 01 — Tổng quan & mục tiêu

## Bối cảnh

Solution Architect (SA) thường phải giải thích và nắm rõ cách các thành phần cloud ghép nối
với nhau: đường mạng đi qua những đâu, thành phần nào chịu trách nhiệm gì, cấu hình bên trong
ra sao. Các sơ đồ tĩnh thông thường không thể hiện được **luồng động** và **chi tiết cấu hình**
của từng node.

Tác giả đã tự tạo được những file HTML mô phỏng tương tác rất chi tiết (ví dụ:
`aws_direct_connect_topology_simulator.html` — mô phỏng topology AWS Direct Connect với sơ đồ
SVG, zoom/pan, click từng thiết bị để xem cấu hình, mô phỏng luồng packet). Vấn đề: các file
này đang rời rạc, chưa có nơi tập trung để **duyệt, tìm kiếm và trình bày** một cách gọn gàng.

## Mục tiêu

Xây dựng một **thư viện web tĩnh** để:

1. Tập trung tất cả các file HTML mô phỏng vào một nơi.
2. Cho phép **duyệt** dưới dạng gallery và **tìm/lọc** theo cloud, domain, độ khó, tags.
3. **Mở và xem** từng mô phỏng nguyên trạng, toàn màn hình.
4. **Dễ mở rộng**: thêm mô phỏng mới chỉ tốn vài phút.

## Đối tượng người dùng

- **Solution Architect / kỹ sư cloud**: tra cứu, học, ôn tập các mẫu kiến trúc.
- **Người học / ứng viên thi chứng chỉ**: hiểu sâu từng thành phần qua tương tác.
- **Tác giả (chủ sở hữu nội dung)**: người thêm/quản lý các file mô phỏng.

## Phạm vi (In-scope)

- Trang gallery với tìm kiếm & lọc phía client.
- Trang xem (player) nhúng file HTML qua `<iframe>`.
- Manifest khai báo tay danh mục các mô phỏng.
- Hỗ trợ đa cloud ở cấp phân loại metadata (AWS / Azure / GCP / multi).
- Giao diện tối (dark theme) đồng bộ tinh thần với các file mô phỏng hiện có.

## Ngoài phạm vi (Non-goals)

Các mục sau **không** thuộc phiên bản này (xem [Lộ trình](./07-lo-trinh-tuong-lai.md)):

- Backend, database, hay bất kỳ API server nào.
- Đăng nhập / tài khoản người dùng / lưu tiến độ.
- Nội dung cộng đồng (đóng góp online, comment, rating).
- Trình dựng kiến trúc kéo–thả (builder).
- Bất kỳ lời gọi AI nào **từ phía nền tảng** (bản thân file HTML có thể tự chứa, nhưng
  đó là chuyện nội bộ của file, nền tảng không can thiệp và không phụ thuộc).

## Tiêu chí thành công

- Mở trang chủ thấy toàn bộ mô phỏng dưới dạng card, tìm/lọc hoạt động mượt.
- Mở một mô phỏng → file HTML chạy đúng y như khi mở trực tiếp.
- Thêm một mô phỏng mới chỉ cần: copy file + thêm 1 mục manifest + commit.
- Deploy tĩnh lên Vercel không cần biến môi trường hay dịch vụ ngoài.
