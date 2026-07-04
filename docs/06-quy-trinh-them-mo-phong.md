# 06 — Quy trình thêm mô phỏng mới

Thêm một mô phỏng chỉ gồm vài bước, không cần chạm vào code của gallery/player.

## Các bước

1. **Đặt file HTML** vào `public/simulations/`.
   - Ví dụ: `public/simulations/azure_hub_spoke.html`.
   - File phải là HTML tự chứa (chạy được khi mở trực tiếp).

2. **(Tuỳ chọn) Thêm thumbnail** vào `public/thumbs/`.
   - Ví dụ: `public/thumbs/azure-hub-spoke.png`.
   - Nếu bỏ qua, card sẽ dùng placeholder mặc định.

3. **Khai báo một mục trong manifest** `data/simulations.ts`:

```ts
{
  slug: "azure-hub-spoke",
  title: "Azure Hub-Spoke Network",
  description: "Mô hình hub-spoke với Azure Firewall, VNet peering và route tables.",
  cloud: "azure",
  domain: "networking",
  difficulty: "intermediate",
  tags: ["Hub-Spoke", "VNet Peering", "Azure Firewall"],
  htmlPath: "/simulations/azure_hub_spoke.html",
  thumbnail: "/thumbs/azure-hub-spoke.png",
  createdAt: "2026-07-10",
},
```

4. **Commit & push** → Vercel tự build và deploy. Mô phỏng xuất hiện trong gallery, có URL
   `/s/azure-hub-spoke`.

## Checklist trước khi commit

- [ ] `slug` là duy nhất, viết `kebab-case`.
- [ ] `htmlPath` trỏ đúng file vừa thêm và bắt đầu bằng `/`.
- [ ] `cloud` / `domain` / `difficulty` dùng đúng giá trị hợp lệ (theo union type).
- [ ] File HTML mở trực tiếp chạy đúng (không lỗi console nghiêm trọng).
- [ ] (Nếu có) `thumbnail` tồn tại đúng đường dẫn.

## Mẹo

- **Đặt tên file** theo mẫu `provider_chu-de.html` để dễ quản lý (`aws_...`, `azure_...`).
- **Tags nhất quán**: dùng đúng tên dịch vụ chính thức để tìm kiếm hiệu quả.
- Nếu có script validation (xem [03](./03-mo-hinh-du-lieu.md)), chạy nó trước khi commit để bắt
  lỗi khai báo sớm.
