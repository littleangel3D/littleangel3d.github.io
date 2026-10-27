# 3D CỦ CHI — Business OS Cloud

Website: https://cuchi-maker-business.sosorabot0811.chatgpt.site/

Bản full-stack quản trị dự án 3D với 15 module, bản đồ kinh doanh chỉnh sửa được, calculator, lệnh in, kho, khách hàng, tài chính và báo cáo tháng. GitHub Pages mở cổng chuyển sang bản Cloud vì không chạy được backend/database.

## Chạy và kiểm tra

```sh
node /path/to/sites-plugin/scripts/install-dependencies.mjs
npm run db:generate
npm test
npm run dev
```

Theo README starter và Sites skill để build/migrate/triển khai; không chạy lại migration SQL đã áp. `public/` chứa UI ES modules, `server/state-service.mjs` chứa kiểm tra quyền và giao dịch SQL, `app/api/` nối request identity với D1, `db/schema.ts` khai báo bảng và `drizzle/` chứa lịch sử migration. Giữ `sites()` trong Vite config.

## Các chức năng

Dashboard tính từ records; Product Lab; giá vốn SKU và calculator; lệnh in tự trừ filament một lần; nhiều máy và nhật ký bảo trì; filament/kho; đơn hàng, khách hàng; vốn và tài chính; Store GO/NO-GO; workshop; ý tưởng/scoring; roadmap và kế hoạch tham khảo 8 phần; báo cáo tháng; tìm kiếm/filter; CRUD; JSON backup.

Kế hoạch từ ảnh có các khoản dự toán, khoảng doanh thu/lợi nhuận, giai đoạn, công việc, gate và KPI chỉnh sửa được. Dự báo không tự ghi thành doanh thu/chi phí thực tế. Module Store kiểm chứng nhu cầu trước khi thuê mặt bằng.

## Quy ước tài chính

Chỉ đơn đã thanh toán tính doanh thu, mỗi dòng đơn một SKU. Giá vốn đơn là snapshot tại thời điểm nhập. Lệnh in/bảo trì chỉ là records tham chiếu; workshop hiển thị tiền dự kiến, thu thực tế nhập vào Thu nhập khác. Không nhập trùng đầu tư hoặc giá vốn đơn vào chi phí vận hành. Vốn chưa giải ngân = vốn ban đầu − giải ngân; vốn + lợi nhuận giữ lại là ước tính quản trị, không phải số dư ngân hàng đối soát. Chưa có thuế, công nợ, POS hoặc kế toán kho đầy đủ.

## Lưu trữ máy chủ (bản Cloud)

Bản hiện tại dùng Cloudflare D1 và API `/api/state`; localStorage chỉ là cache/bản nháp dự phòng. Đăng nhập bằng tài khoản quản lý dự án để đọc/sửa dữ liệu thật. Khách chưa đăng nhập chỉ xem dữ liệu mẫu; API từ chối cả đọc và ghi khi chưa xác thực. Website vẫn có thể công khai mà không công khai hồ sơ khách hàng hoặc tài chính thật.

Mỗi thay đổi có revision. Máy chủ kiểm tra revision để chặn ghi đè từ thiết bị cũ, lưu tối đa 50 phiên bản trước. Trạng thái “Đã lưu vào database” chỉ xuất hiện sau phản hồi thành công. Mất mạng/lỗi server giữ bản nháp và cho thử lại; xung đột yêu cầu xuất bản nháp rồi tải bản máy chủ. Trang kiểm tra bản mới khi trở lại tab và định kỳ khi không có thay đổi chưa lưu.

Lần đăng nhập đầu, nếu database chưa có dữ liệu, bản hiện có trên trình duyệt sẽ được chuyển lên máy chủ. Nếu database đã có dữ liệu, máy chủ là nguồn chính; dữ liệu trình duyệt cũ được giữ ở `cuchi-legacy-backup-v1`, tải được tại Cài đặt → Tải dữ liệu trình duyệt cũ. Dữ liệu ở domain GitHub cũ phải được xuất JSON rồi nhập vào bản Cloud sau khi đăng nhập; trình duyệt không cho một domain đọc localStorage của domain khác.

Cấu hình triển khai: D1 binding `DB`, biến máy chủ `OWNER_EMAIL` lưu trong môi trường Sites. Không đưa email quản lý hoặc credential vào code trình duyệt. Dev dùng `.dev.vars` bị gitignore, với user thử nghiệm của starter; không đưa cơ chế mock đăng nhập vào production. Tạo migrations bằng `npm run db:generate`, build bằng helper Sites, áp SQL local theo README starter; Sites áp migration production khi publish.

Kiểm thử bổ sung dùng SQLite thật và hai kho cache trình duyệt độc lập: lưu/đọc chéo thiết bị, chặn quyền, chặn Origin khác, lưu idempotent khi mất phản hồi, giữ draft khi offline, retry, và chặn CAS conflict. Không dùng dữ liệu kinh doanh thật để kiểm thử.
