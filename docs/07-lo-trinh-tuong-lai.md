# 07 — Lộ trình tương lai

Các hướng mở rộng **có thể** cân nhắc sau này. Tất cả nằm **ngoài phạm vi** phiên bản hiện tại
(site tĩnh, không backend). Ghi lại ở đây để không mất ý tưởng, nhưng không cam kết thực hiện.

## Nội dung & tổ chức

- **Trang theo cloud / theo domain**: các trang tổng hợp (ví dụ `/aws`, `/networking`) gom nhóm
  mô phỏng liên quan.
- **Lộ trình học (learning path)**: chuỗi mô phỏng theo thứ tự từ cơ bản → nâng cao.
- **Metadata phong phú hơn**: thời lượng ước tính, kiến thức tiên quyết, dịch vụ liên quan.

## Trải nghiệm

- **Trạng thái "đã xem" cục bộ** bằng `localStorage` (vẫn không cần backend).
- **Bookmark cục bộ** bằng `localStorage`.
- **Tìm kiếm nâng cao** (fuzzy search, gợi ý theo tag).

## Nếu cần backend (thay đổi lớn về phạm vi)

Chỉ khi thực sự cần các tính năng có trạng thái nhiều người dùng:

- **Đăng nhập & tài khoản** (ví dụ Supabase Auth).
- **Lưu tiến độ / bookmark đồng bộ nhiều thiết bị.**
- **Đóng góp cộng đồng**: upload mô phỏng online, kiểm duyệt, comment, rating.
- **Upload HTML online** với sandbox chặt hơn (bỏ `allow-same-origin`, phục vụ từ subdomain
  riêng để cô lập nội dung không tin cậy).

## Engine declarative (nếu muốn chuẩn hoá)

- Định nghĩa mô phỏng bằng JSON schema (nodes, edges, layers, flows, inspector) và một engine
  React tự render — giúp thêm hàng loạt nhanh và đồng nhất, thay vì viết tay từng file HTML.
- Đây là bước tiến hoá lớn; chỉ nên làm khi số lượng mô phỏng đủ nhiều để justify.

> Nguyên tắc: giữ phiên bản hiện tại **đơn giản nhất có thể**. Mọi mục ở đây chỉ triển khai khi
> có nhu cầu thực sự và rõ ràng.
