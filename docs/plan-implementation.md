# Implementation Plan — CloudViz SA (v1: static gallery)

Nguồn: `docs/01..07-*.md` (đã duyệt). Mục tiêu: dựng site Next.js tĩnh hiển thị gallery các
mô phỏng HTML, mở từng mô phỏng qua `<iframe>`, migrate file DX hiện có làm mô phỏng đầu tiên.

## Task 1 — Scaffold dự án Next.js
- Khởi tạo Next.js (App Router, TypeScript, Tailwind, ESLint), package manager npm.
- Dọn cấu trúc mặc định, cấu hình `tsconfig` path alias `@/*`.
- Verify: `npm run build` chạy được với trang mặc định.

## Task 2 — Lớp dữ liệu (types, catalog, manifest)
- `lib/types.ts`: `Cloud`, `Domain`, `Difficulty`, `Simulation`.
- `lib/catalog.ts`: `getAllSimulations`, `getSimulationBySlug`, `getAllSlugs`, `getFilterOptions`.
- `data/simulations.ts`: mảng chứa 1 mục cho `aws-direct-connect`.
- Verify: type-check qua (`tsc --noEmit` hoặc `next build`).

## Task 3 — Migrate file HTML hiện có
- Copy `aws_direct_connect_topology_simulator.html` vào `public/simulations/`.
- Verify: file mở trực tiếp qua static server vẫn chạy đúng.

## Task 4 — Layout & theme
- `app/layout.tsx`: dark theme, metadata, font.
- `app/globals.css`: Tailwind base + biến màu badge theo cloud.

## Task 5 — Components
- `components/SimulationCard.tsx`
- `components/FilterBar.tsx` (client component, state tìm kiếm/lọc)
- `components/SimulationFrame.tsx` (iframe wrapper với sandbox)

## Task 6 — Trang Gallery (`app/page.tsx`)
- Server component lấy `getAllSimulations()` + `getFilterOptions()`.
- Render header + `FilterBar` (client) hiển thị lưới card + empty state.

## Task 7 — Trang Player (`app/s/[slug]/page.tsx`)
- `generateStaticParams` từ `getAllSlugs()`.
- `notFound()` khi slug không tồn tại.
- Header mỏng (quay lại, title, badges, mở tab mới) + `SimulationFrame`.

## Task 8 — Build & verify tổng thể
- `npm run build` thành công, không lỗi type/lint.
- Kiểm tra thủ công (mô tả trong report): gallery hiển thị card DX, filter hoạt động, mở
  player render đúng iframe.

## Task 9 — README dự án
- Cập nhật `README.md` gốc: mô tả ngắn, cách chạy dev/build, cách thêm mô phỏng mới (trỏ tới
  `docs/06-quy-trinh-them-mo-phong.md`).

Không bao gồm: deploy Vercel thực tế (người dùng tự làm), thumbnail thực tế (dùng placeholder).
