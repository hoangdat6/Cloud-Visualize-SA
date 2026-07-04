# 08 — Tính năng mở rộng v2 (spec)

Bổ sung cho v1 (gallery tĩnh + player). Vẫn giữ nguyên tắc cốt lõi ở `docs/README.md`:
**tĩnh hoàn toàn, không backend**. Mọi tính năng "cá nhân hoá" dùng `localStorage` phía client.

## Phạm vi

1. Tách trang chi tiết mô phỏng khỏi trang chạy (player).
2. Nút fullscreen cho player.
3. Bookmark + đánh dấu "đã xem" (localStorage).
4. Lọc gallery đồng bộ với URL query param.
5. Landing (hero + thống kê theo cloud) gộp vào trang chủ, phía trên gallery.
6. SEO: sitemap, robots, OpenGraph/Twitter metadata.
7. Script validate manifest, chạy tự động trước khi build.

## Quyết định thiết kế đã chốt

- **Routing:** `/s/[slug]` = trang chi tiết (mô tả, mục tiêu học, thành phần chính). `/s/[slug]/play`
  = trang chạy mô phỏng toàn màn hình (iframe + fullscreen). Card trên gallery trỏ tới trang chi tiết.
- **Landing:** gộp vào `/` — hero + thống kê ở trên, gallery (search/filter + lưới) ngay bên dưới.
  Không tách trang `/explore` riêng.
- **SEO base URL:** `lib/site.ts` đọc `process.env.NEXT_PUBLIC_SITE_URL`, fallback
  `https://cloudviz-sa.vercel.app`. Đổi được sau qua biến môi trường trên Vercel, không cần sửa code.

## A. Nền tảng dùng chung

`lib/site.ts`:
```ts
export const SITE = {
  name: "CloudViz SA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudviz-sa.vercel.app",
  description: "Thư viện mô phỏng kiến trúc Cloud cho Solution Architect — AWS · Azure · GCP",
};
```

`hooks/useStoredSet.ts` — hook client quản lý một tập hợp chuỗi lưu trong `localStorage`:
- State khởi tạo rỗng (để khớp SSR), nạp giá trị thật từ `localStorage` trong `useEffect` đầu tiên,
  kèm cờ `hydrated` để UI biết khi nào dữ liệu thật đã sẵn sàng (tránh nhấp nháy/hydration mismatch).
- API: `{ values: Set<string>, hydrated: boolean, has(id), toggle(id), add(id) }`.
- Dùng cho 2 key: `cloudviz:bookmarks`, `cloudviz:viewed`.

Mở rộng `Simulation` (các trường mới đều optional, không phá dữ liệu cũ):
```ts
export interface Simulation {
  // ...các trường hiện có...
  longDescription?: string;
  objectives?: string[];
  components?: { name: string; description: string }[];
}
```
Bổ sung nội dung này cho mục `aws-direct-connect` trong `data/simulations.ts`.

## B. Trang chi tiết — `app/s/[slug]/page.tsx`

Server component, SSG qua `generateStaticParams` (giữ nguyên cơ chế cũ), có `generateMetadata`
(OpenGraph/Twitter, xem mục F).

Bố cục:
- Header: breadcrumb quay lại `/`, tiêu đề, badges (cloud/domain/difficulty).
- Mô tả dài (`longDescription`, fallback `description` nếu không có).
- "Mục tiêu học" (`objectives`) — danh sách bullet, ẩn section nếu rỗng.
- "Thành phần chính" (`components`) — danh sách tên + mô tả ngắn, ẩn section nếu rỗng.
- Toàn bộ `tags`.
- `DetailActions` (client): nút Bookmark (toggle) + trạng thái "Đã xem" (chỉ hiển thị, không click
  được — trạng thái này được set khi người dùng thực sự mở trang `/play`).
- Nút chính "▶ Mở mô phỏng" → điều hướng tới `/s/[slug]/play`.

## C. Trang chạy — `app/s/[slug]/play/page.tsx`

Server shell (lấy `simulation` theo slug, `notFound()` nếu không có) render `SimulationPlayer`
(client component nhận `htmlPath`, `title`, `slug`).

`components/SimulationPlayer.tsx`:
- Giữ nguyên header mỏng hiện có (quay lại, tiêu đề, badges, mở tab mới) — quay lại giờ trỏ về
  trang chi tiết `/s/[slug]` thay vì `/`.
- Thêm nút **Fullscreen**: gọi `wrapperRef.current.requestFullscreen()` / `document.exitFullscreen()`
  tuỳ trạng thái `document.fullscreenElement`, lắng nghe sự kiện `fullscreenchange` để đồng bộ icon.
- Khi mount (`useEffect`), gọi `useStoredSet("cloudviz:viewed").add(slug)` để đánh dấu đã xem.

## D. Bookmark + đã xem trên Gallery

- `components/BookmarkButton.tsx`: nút icon sao, tự đọc/ghi `useStoredSet("cloudviz:bookmarks")`
  theo `slug` được truyền vào; `preventDefault`+`stopPropagation` để không kích hoạt điều hướng
  của `<Link>` bao quanh card khi bấm.
- `components/ViewedBadge.tsx`: tự đọc `useStoredSet("cloudviz:viewed")` theo `slug`, render dấu
  tích "Đã xem" hoặc `null` nếu chưa xem/chưa hydrate.
- Cả hai component **tự chứa** (self-contained): mỗi instance tự đọc trạng thái của riêng nó từ
  `localStorage`, không cần cha (`SimulationCard`/`GalleryClient`) biết về bookmark/viewed hay
  truyền props xuống. `SimulationCard` chỉ cần chèn `<BookmarkButton slug={...} />` (góc trên-phải
  thumbnail) và `<ViewedBadge slug={...} />` (góc dưới-trái thumbnail) — đơn giản hơn và tách biệt
  rõ mối quan tâm (localStorage) khỏi tầng hiển thị danh sách.

## E. Lọc theo URL query param

`GalleryClient` (đã là client component):
- Đọc giá trị khởi tạo từ `useSearchParams()`: `q`, `cloud`, `domain`, `difficulty`.
- Mỗi khi state đổi, gọi `router.replace(pathname + "?" + params, { scroll: false })`, bỏ hẳn param
  nào đang ở giá trị mặc định (`""` hoặc `"all"`) để URL gọn.
- Vì dùng `useSearchParams`, trang `/` phải bọc phần chứa `GalleryClient` trong `<Suspense>`
  (yêu cầu bắt buộc của Next.js App Router khi đọc search params ở client component được render
  từ server component).

## F. Landing + thống kê — `app/page.tsx`

- Hero: tiêu đề lớn, mô tả ngắn, nút CTA cuộn xuống gallery (anchor `#gallery`).
- Dải thống kê: đếm số mô phỏng theo từng `cloud` (tính server-side từ `getAllSimulations()`),
  hiển thị dạng thẻ nhỏ "AWS · n mô phỏng", "Azure · n mô phỏng"... (ẩn cloud có 0 mô phỏng).
- Bên dưới (`id="gallery"`): `<Suspense><GalleryClient .../></Suspense>`.

## G. SEO

- `app/layout.tsx`: thêm `metadataBase: new URL(SITE.url)`, `openGraph`, `twitter` (card summary)
  vào `metadata` gốc.
- `app/s/[slug]/page.tsx`: `generateMetadata` trả thêm `openGraph.title/description/url`.
- `app/sitemap.ts`: liệt kê `/`, và với mỗi simulation: `/s/[slug]`, `/s/[slug]/play`.
- `app/robots.ts`: cho phép crawl toàn bộ, trỏ tới `sitemap.xml`.

## H. Validate manifest

`scripts/validate-manifest.ts` (chạy bằng `tsx`, không qua Next.js runtime):
- Đọc `data/simulations.ts` (import trực tiếp).
- Kiểm tra: `slug` duy nhất; file tại `public` + `htmlPath` tồn tại; nếu có `thumbnail`, file đó
  cũng phải tồn tại trong `public`.
- In lỗi rõ ràng (mục nào, vấn đề gì) và `process.exit(1)` nếu có bất kỳ lỗi nào.

`package.json` bổ sung:
```json
"scripts": {
  "validate": "tsx scripts/validate-manifest.ts",
  "prebuild": "npm run validate"
}
```
`prebuild` chạy tự động trước `npm run build` (hành vi chuẩn của npm), nên build sẽ **fail sớm**
nếu manifest sai, thay vì fail muộn hoặc (tệ hơn) build "thành công" với dữ liệu sai.

## Ngoài phạm vi (không làm ở v2)

- Không thêm ảnh thumbnail thật (vẫn dùng placeholder gradient).
- Không thêm learning path / trang theo cloud riêng (để ở lộ trình tương lai).
- Không đổi cách lưu manifest (vẫn là `data/simulations.ts`, xem thảo luận trong lịch sử chat).

## Tiêu chí hoàn thành

- `npm run build` chạy `validate` tự động, pass, sinh đủ static route: `/`, `/s/aws-direct-connect`,
  `/s/aws-direct-connect/play`, `/sitemap.xml`, `/robots.txt`.
- Từ gallery bấm vào card → trang chi tiết → bấm "Mở mô phỏng" → trang player chạy đúng iframe,
  có nút fullscreen hoạt động.
- Bookmark toggle được và giữ trạng thái sau khi reload (nhờ `localStorage`).
- Mở một mô phỏng ở `/play` xong quay lại gallery → card đó hiện dấu "Đã xem".
- Thay đổi bộ lọc trên gallery → URL cập nhật query param; tải lại URL đó → bộ lọc được khôi phục.
