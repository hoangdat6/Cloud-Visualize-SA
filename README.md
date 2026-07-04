# CloudViz SA

Thư viện web tĩnh trưng bày các mô phỏng tương tác kiến trúc cloud (AWS / Azure / GCP) dành
cho Solution Architect — tìm, xem và học hiểu từng thành phần bên trong một kiến trúc.

Mỗi mô phỏng là một file HTML tự chứa (giữ nguyên như tác giả viết); nền tảng chỉ đóng vai trò
thư viện + trình hiển thị (gallery có tìm kiếm/lọc + trang xem nhúng `<iframe>`).

Xem tài liệu thiết kế đầy đủ tại [`docs/`](./docs/README.md).

## Chạy dự án

```bash
npm install
npm run dev       # http://localhost:3000
```

Build & chạy bản production:

```bash
npm run build
npm run start
```

## Cấu trúc chính

```
app/                   # Trang: gallery (/) và player (/s/[slug])
components/            # SimulationCard, FilterBar, GalleryClient, SimulationFrame
lib/                   # types.ts, catalog.ts (lớp truy vấn), badges.ts
data/simulations.ts    # MANIFEST — nguồn sự thật của danh mục mô phỏng
public/simulations/    # Các file HTML mô phỏng
public/thumbs/         # Ảnh thumbnail (tuỳ chọn)
docs/                  # Tài liệu thiết kế chi tiết
```

## Thêm một mô phỏng mới

1. Copy file HTML vào `public/simulations/`.
2. (Tuỳ chọn) thêm thumbnail vào `public/thumbs/`.
3. Thêm một object vào `data/simulations.ts`.
4. Commit & push — không cần sửa code gallery/player.

Chi tiết đầy đủ + checklist: [`docs/06-quy-trinh-them-mo-phong.md`](./docs/06-quy-trinh-them-mo-phong.md).

## Triển khai

Site tĩnh hoàn toàn (không backend, không biến môi trường), triển khai trực tiếp lên Vercel
bằng cách import repo — không cần cấu hình thêm.
