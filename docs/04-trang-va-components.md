# 04 — Trang & Components

## Trang Gallery — `app/page.tsx`

Trang chủ, render tĩnh. Nhận toàn bộ danh mục từ Catalog và truyền xuống một component client
lo phần tìm kiếm/lọc.

**Bố cục:**

```
┌─────────────────────────────────────────────────────┐
│  Header: logo + tên "CloudViz SA" + tagline          │
├─────────────────────────────────────────────────────┤
│  FilterBar:  [ 🔍 ô tìm kiếm ]  [cloud▾] [domain▾]   │
│              [difficulty▾]  · (n) kết quả             │
├─────────────────────────────────────────────────────┤
│  Lưới card (responsive: 1 / 2 / 3 / 4 cột)           │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│   │ Card  │ │ Card  │ │ Card  │ │ Card  │            │
│   └───────┘ └───────┘ └───────┘ └───────┘            │
├─────────────────────────────────────────────────────┤
│  Empty state khi không có kết quả khớp                │
└─────────────────────────────────────────────────────┘
```

Phần server (RSC) lấy `getAllSimulations()` và render `<GalleryClient simulations={...} />`.

## Component `FilterBar` — `components/FilterBar.tsx`

Client component. Quản lý state tìm kiếm/lọc và phát ra danh sách đã lọc.

**State:** `query` (string), `cloud`, `domain`, `difficulty` (mỗi cái có giá trị "all").

**Logic lọc:**

```ts
const filtered = simulations.filter((s) => {
  const matchQuery =
    query === "" ||
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q));
  const matchCloud = cloud === "all" || s.cloud === cloud;
  const matchDomain = domain === "all" || s.domain === domain;
  const matchDiff = difficulty === "all" || s.difficulty === difficulty;
  return matchQuery && matchCloud && matchDomain && matchDiff;
});
```

Options của dropdown lấy từ `getFilterOptions()` để tự đồng bộ khi thêm mô phỏng có cloud/domain mới.

## Component `SimulationCard` — `components/SimulationCard.tsx`

Hiển thị một mô phỏng trong lưới. Toàn bộ card là link tới `/s/[slug]`.

**Thành phần trực quan:**
- Thumbnail (hoặc placeholder gradient theo cloud nếu thiếu ảnh).
- Badge cloud (AWS cam, Azure xanh dương, GCP đỏ/vàng, multi tím) + badge difficulty.
- Title (đậm) + description (rút gọn 2 dòng).
- Hàng tags (tối đa ~3 tag + "…").

**Trạng thái hover:** viền sáng lên + nhẹ nhấc lên (đồng bộ phong cách dark neon của file DX).

## Trang Player — `app/s/[slug]/page.tsx`

Trang xem một mô phỏng, render tĩnh cho từng slug.

```ts
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}
```

Nếu `getSimulationBySlug(slug)` trả về `undefined` → gọi `notFound()` (trang 404).

**Bố cục:**

```
┌─────────────────────────────────────────────────────┐
│  ← Quay lại   |  Title  · badge cloud/difficulty      │  ← header mỏng
│                                          [ ↗ Tab mới ]│
├─────────────────────────────────────────────────────┤
│                                                       │
│                <iframe> file HTML                     │  ← chiếm phần còn lại
│                (toàn bộ chiều cao còn lại)            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

- Nút "Quay lại" → về `/`.
- Nút "Tab mới" (↗) → mở thẳng `htmlPath` trong tab mới (xem file full-screen ngoài khung).

## Component `SimulationFrame` — `components/SimulationFrame.tsx`

Bọc `<iframe>` nhúng file HTML. Chi tiết cơ chế và sandbox xem
[05 — Render & iframe](./05-render-va-iframe.md).

```tsx
<iframe
  src={htmlPath}
  title={title}
  className="h-full w-full border-0"
  sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
/>
```

## Layout & theme — `app/layout.tsx` + `app/globals.css`

- Dark theme mặc định (nền `slate-950`), đồng bộ tinh thần với các file mô phỏng.
- Tailwind cho toàn bộ styling; định nghĩa vài biến màu cho badge theo cloud.
- Metadata cơ bản (title, description) cho SEO/nhận diện tab.
