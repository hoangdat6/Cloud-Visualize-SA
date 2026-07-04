# 02 — Kiến trúc hệ thống

## Mô hình triển khai

Toàn bộ ứng dụng là một site Next.js được **render tĩnh (SSG)** và phục vụ qua Vercel CDN.
Không có tầng server chạy runtime, không có dịch vụ ngoài.

```
┌──────────────────────── Vercel (CDN, static) ────────────────────────┐
│                                                                       │
│   Route            Vai trò                                            │
│   ─────────────    ─────────────────────────────────────────         │
│   /                Gallery: lưới card + thanh tìm kiếm/lọc            │
│   /s/[slug]        Player: header nhẹ + <iframe> nhúng file HTML      │
│                                                                       │
│   Build-time input:                                                   │
│     • data/simulations.ts        (manifest — nguồn sự thật)           │
│     • public/simulations/*.html  (nội dung mô phỏng)                  │
│     • public/thumbs/*            (ảnh minh hoạ)                        │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Luồng dữ liệu

1. **Lúc build**: Next.js đọc `data/simulations.ts`.
   - Trang gallery nhận toàn bộ mảng `Simulation[]`.
   - `generateStaticParams` sinh một trang tĩnh cho mỗi `slug`.
2. **Lúc runtime (trình duyệt)**:
   - Gallery lọc/tìm kiếm hoàn toàn phía client trên mảng đã có sẵn (không fetch).
   - Player nạp file HTML tương ứng vào `<iframe>` theo `htmlPath`.

Không có trạng thái server, không có request dữ liệu động. Tìm kiếm/lọc chỉ thao tác trên
dữ liệu đã được nhúng vào trang lúc build.

## Phân rã module & trách nhiệm

| Module | Trách nhiệm | Phụ thuộc |
|--------|-------------|-----------|
| **Catalog** (`data/simulations.ts` + `lib/catalog.ts`) | Nguồn sự thật về danh mục; hàm truy vấn (lấy tất cả, tìm theo slug, lấy danh sách filter) | Chỉ kiểu `Simulation` |
| **Gallery page** (`app/page.tsx`) | Trang chủ; ghép `FilterBar` + lưới `SimulationCard` | Catalog, components |
| **Player page** (`app/s/[slug]/page.tsx`) | Trang xem một mô phỏng | Catalog, `SimulationFrame` |
| **FilterBar** (`components/FilterBar.tsx`) | State tìm kiếm/lọc phía client, phát ra kết quả đã lọc | Kiểu `Simulation` |
| **SimulationCard** (`components/SimulationCard.tsx`) | Hiển thị 1 mô phỏng trong lưới | Kiểu `Simulation` |
| **SimulationFrame** (`components/SimulationFrame.tsx`) | Bọc `<iframe>` + thuộc tính sandbox | `htmlPath` |

Nguyên tắc: **Catalog là lớp duy nhất biết về hình dạng dữ liệu**. UI chỉ tiêu thụ kết quả từ
Catalog, không tự đọc file manifest lung tung.

## Cấu trúc thư mục

```
Cloud-Visualize-SA/
├─ app/
│  ├─ layout.tsx              # layout gốc, dark theme, font
│  ├─ page.tsx                # Gallery (trang chủ)
│  ├─ globals.css             # Tailwind + biến theme
│  └─ s/
│     └─ [slug]/
│        └─ page.tsx          # Player
├─ components/
│  ├─ FilterBar.tsx
│  ├─ SimulationCard.tsx
│  └─ SimulationFrame.tsx
├─ data/
│  └─ simulations.ts          # MANIFEST — nguồn sự thật
├─ lib/
│  ├─ types.ts                # interface Simulation + union types
│  └─ catalog.ts              # hàm truy vấn danh mục
├─ public/
│  ├─ simulations/            # các file HTML (gồm cả file DX hiện tại)
│  │  └─ aws_direct_connect_topology_simulator.html
│  └─ thumbs/                 # ảnh thumbnail (tuỳ chọn)
├─ docs/                      # tài liệu thiết kế (thư mục này)
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
├─ next.config.mjs
└─ README.md
```

## Quyết định kiến trúc & lý do

- **Next.js App Router + SSG** thay vì SPA thuần: dễ sinh trang tĩnh cho từng slug (URL đẹp,
  share được), sẵn sàng deploy Vercel, vẫn không cần backend.
- **Manifest trong repo** thay vì DB: đơn giản nhất, versioned bằng Git, không hạ tầng ngoài.
- **File HTML trong `public/`** thay vì Storage ngoài: cùng origin, giữ nguyên hành vi file,
  không cấu hình CORS/CDN riêng.
- **Lọc phía client**: số lượng mô phỏng ở quy mô vài chục–vài trăm; nhúng sẵn dữ liệu và lọc
  trên trình duyệt là đủ nhanh, không cần index/search server.
