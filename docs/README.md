# CloudViz SA — Tài liệu thiết kế

**CloudViz SA** là một site tĩnh trưng bày thư viện các file HTML mô phỏng kiến trúc cloud
(đa cloud: AWS / Azure / GCP), giúp Solution Architect tìm, xem và học hiểu từng thành phần
bên trong một kiến trúc.

Mỗi mô phỏng là một **file HTML tự chứa** (self-contained) — giữ nguyên như tác giả viết
(SVG, script, style...). Nền tảng chỉ đóng vai trò **thư viện + trình hiển thị**: liệt kê,
tìm kiếm, lọc và mở từng mô phỏng trong một khung `<iframe>`.

> Ví dụ mô phỏng khởi đầu: `aws_direct_connect_topology_simulator.html` (AWS Direct Connect
> + Transit Gateway topology visualizer).

---

## Nguyên tắc cốt lõi

- **Tĩnh hoàn toàn (static-first).** Không backend, không database, không đăng nhập, không
  gọi API. Toàn bộ nội dung có sẵn lúc build và phục vụ như file tĩnh.
- **File HTML là bất khả xâm phạm.** Nền tảng không sửa nội dung file HTML; chỉ bọc và hiển thị.
- **Thêm mô phỏng phải dễ.** Thả file HTML vào thư mục + thêm một dòng metadata là xong.
- **Ranh giới module rõ ràng.** Mỗi phần (catalog, gallery, player, iframe renderer) có một
  trách nhiệm duy nhất và giao tiếp qua interface tường minh.

---

## Ngăn xếp công nghệ

| Lớp | Lựa chọn |
|-----|----------|
| Framework | Next.js (App Router) — render tĩnh (SSG) |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS |
| Nguồn dữ liệu | Manifest TypeScript/JSON trong repo (`data/simulations.ts`) |
| Tài sản | File HTML + thumbnail trong `public/` |
| Triển khai | Vercel |

---

## Mục lục tài liệu

| # | Tài liệu | Nội dung |
|---|----------|----------|
| 01 | [Tổng quan & mục tiêu](./01-tong-quan-va-muc-tieu.md) | Bối cảnh, đối tượng, mục tiêu, phạm vi, non-goals |
| 02 | [Kiến trúc hệ thống](./02-kien-truc-he-thong.md) | Sơ đồ tổng thể, luồng dữ liệu, cấu trúc thư mục |
| 03 | [Mô hình dữ liệu (manifest)](./03-mo-hinh-du-lieu.md) | Schema `Simulation`, quy ước, ví dụ |
| 04 | [Trang & components](./04-trang-va-components.md) | Gallery, Player, FilterBar, Card, Frame |
| 05 | [Render & iframe](./05-render-va-iframe.md) | Cơ chế nhúng, sandbox, đánh đổi bảo mật |
| 06 | [Quy trình thêm mô phỏng](./06-quy-trinh-them-mo-phong.md) | Các bước thêm nội dung mới |
| 07 | [Lộ trình tương lai](./07-lo-trinh-tuong-lai.md) | Các hướng mở rộng có thể có |
| 08 | [Tính năng mở rộng v2](./08-tinh-nang-mo-rong-v2.md) | Detail/play route, bookmark, filter URL, landing, SEO, validate manifest |

---

## Trạng thái

Tài liệu thiết kế (spec). Bước tiếp theo: lập kế hoạch triển khai (implementation plan).
