# Little Angel 3D — Business OS Cloud

- Mở ứng dụng: https://littleangel3d.github.io/
- Bản Cloud có database: https://cuchi-maker-business.sosorabot0811.chatgpt.site/

GitHub Pages hiện là cổng mở bản Cloud, không còn nhận chỉnh sửa chỉ lưu cục bộ. Khách mới được chuyển sang Cloud; trình duyệt từng nhập dữ liệu ở bản tĩnh sẽ thấy nút tải JSON để chuyển dữ liệu. Đăng nhập bằng tài khoản quản lý để lưu vào database D1 và dùng trên nhiều thiết bị.

Mã nguồn ứng dụng, API, schema, migrations và tests nằm trong [cloud](cloud/README.md). Biến `OWNER_EMAIL` cấu hình phía máy chủ; không để credential trong mã nguồn. Dữ liệu SQL thực không được lưu trong repository này.

Xem trạng thái “Đã lưu vào database” sau mỗi thay đổi. Khi offline, bản nháp được giữ và có nút thử lại. Xung đột revision chặn ghi đè giữa thiết bị; có thể xuất bản nháp trước khi tải bản máy chủ.
