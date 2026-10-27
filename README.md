# Little Angel 3D — Business OS

Website: https://littleangel3d.github.io/

# 3D CỦ CHI — Business OS MVP

Web app quản trị dự án in 3D với 15 module và báo cáo tháng. JavaScript ES modules, CSS responsive, không cần cài dependency để chạy.

## Chạy trên máy

```sh
npm start
```

Mở http://localhost:4173. Hoặc chạy `python3 -m http.server 4173`.

## Những gì hoạt động

- Dashboard tính từ records, chọn tháng, biểu đồ doanh thu / lợi nhuận và doanh thu theo kênh.
- Product Lab với 9 trạng thái, hồ sơ SKU, phản hồi học viên / giáo viên, liên kết ảnh và STL / 3MF.
- Giá vốn SKU từ giá cuộn vật liệu, gram, giờ máy, điện, khấu hao, tỷ lệ lỗi, công và bao bì. Product Score /100 và Opportunity Score /100.
- Calculator giá vốn, lãi gộp, lãi đóng góp, hòa vốn và 7 mức giá so sánh.
- Lệnh in: Queued → Printing → Completed / Failed; hủy lệnh chờ, tạo lệnh in lại. Mỗi máy một lệnh đang chạy. Trừ filament đúng một lần, chặn tồn âm.
- Quản lý nhiều máy, thông số chi phí giờ máy, nhật ký bảo trì và điều kiện mua máy #2.
- Filament, kho vật tư, khách hàng / phân khúc, đơn hàng / kênh bán và workshop.
- Vốn khởi điểm 30 triệu, chỉnh ngân sách / giải ngân, chi phí, thu nhập khác, ROI và hoàn vốn ước tính.
- Cửa hàng: 6 điều kiện GO / NO-GO theo records và ngưỡng có thể chỉnh; checklist 12 mục.
- Roadmap 5 giai đoạn / 12 tháng, checklist và gate, chặn chuyển tiếp nếu chưa xác nhận gate trước.
- Monthly Business Review: số liệu tự tổng hợp, ghi chú theo tháng tự lưu, xuất TXT và in / lưu PDF.
- Tìm kiếm toàn hệ thống, lọc trạng thái, thêm / sửa / xóa có xác nhận, chặn xóa bản ghi đang được tham chiếu.
- LocalStorage tự lưu, đồng bộ giữa các tab cùng origin trên thiết bị, xuất / nhập JSON có kiểm tra, xóa / khôi phục dữ liệu mẫu.

## Quy ước dữ liệu

Dữ liệu mặc định hoàn toàn là mẫu, không phải dữ liệu kinh doanh thật. Cài đặt → Bắt đầu với dữ liệu trống để nhập dự án mới. Xuất JSON trước khi xóa dữ liệu hoặc thay thiết bị. Dữ liệu localhost và website đã triển khai là hai không gian riêng; chuyển dữ liệu bằng xuất / nhập JSON.

Dữ liệu được lưu trên trình duyệt và thiết bị hiện tại, chưa có database server hoặc đồng bộ đa thiết bị. Ảnh và STL / 3MF lưu liên kết, chưa có kho tải lên file. Repository trong `model.js` tách khỏi schema và giao diện để thay bằng API sau này.

Đơn hàng hiện có một SKU / dòng. Chỉ đơn đã thanh toán tính doanh thu. Giá vốn đơn là snapshot có thể nhập thực tế, không bị thay khi sửa SKU. Workshop là doanh thu dự kiến; thu thực tế nhập vào Thu nhập khác. Lệnh in và maintenance là records vận hành, không tự ghi nhận doanh thu / chi phí tài chính để tránh trùng.

Vốn chưa giải ngân = vốn ban đầu − tổng giải ngân. Lợi nhuận = doanh thu − giá vốn − phí bán theo đơn − chi phí vận hành. “Vốn + lợi nhuận giữ lại” là ước tính quản trị theo chi phí phân bổ, **không phải số dư ngân hàng**. Chưa có đối soát công nợ, thuế, nhập xuất giá vốn kho và khấu hao kế toán. Không nhập trùng khoản vốn đầu tư hoặc giá vốn đã có trong đơn vào chi phí vận hành.

ROI = lợi nhuận ròng lũy kế / vốn khởi điểm. Hoàn vốn = phần lợi nhuận ròng dương / vốn khởi điểm. Ngày hòa vốn dự kiến dùng lợi nhuận bình quân 3 tháng; không dự báo được khi bình quân ≤0.

Machine #2: công suất >65% trong cả 3 tháng gần nhất, có lệnh chờ, có SKU đang bán có lãi. Store: doanh thu ngoài trung tâm, khách local lặp lại, đơn custom, SKU có lãi, dòng tiền dương liên tiếp, dự phòng đủ tháng. Đây là các rule nội bộ của MVP.

## Kiểm tra

```sh
npm test
```

Kiểm thử tự động bao phủ calculator / scrap / phí / hòa vốn, vốn 30 triệu, cập nhật lợi nhuận, trạng thái đơn, trừ filament một lần, lỗi in / tồn âm, khóa máy, persistence CRUD, snapshot giá vốn, JSON import và scoring. Kiểm tra UI bằng trình duyệt: 15 module + báo cáo, mở các form, thêm / sửa / xóa chi phí, tạo / lưu / xóa SKU, calculator và hoàn tất lệnh in giảm đúng gram. Đã phát hiện và sửa modal tràn ngang ở viewport 760px. Chưa kiểm tra trên điện thoại vật lý hoặc đủ mọi kích thước desktop.

## Version 2

1. Database, đăng nhập / phân quyền, backup tự động, đồng bộ đa thiết bị.
2. Đơn nhiều SKU, thanh toán / hoàn tiền / công nợ và sổ quỹ thực tế.
3. Nhập xuất kho theo lô, purchase orders, giá vốn bình quân, ghi nhận phế phẩm và hoàn kho bằng giao dịch đối ứng.
4. Upload thư viện STL / 3MF và ảnh, phiên bản file, tích hợp máy in / slicer.
5. POS / CRM, nhiều nhân sự / địa điểm, tích hợp các kênh bán.
6. KPI configurable, forecast có seasonality, doanh thu workshop thực thu và khách đăng ký chi tiết.

## Cập nhật: Bản đồ kinh doanh từ ảnh

Mở **Lộ trình phát triển → Bản đồ kinh doanh** để xem 8 nhóm nội dung từ ảnh gốc: tầm nhìn, giá trị, sản phẩm/dịch vụ, khách hàng, đầu tư, mô hình thu, lộ trình và dự báo tài chính. Dữ liệu là các record có thể thêm/sửa/xóa, không phải ảnh chụp cố định. Khoảng đầu tư mặc định tự cộng thành 23–29 triệu; cảnh báo ngân sách và biểu đồ đổi theo số nhập.

**Sửa thông tin chung** chỉnh tiêu đề, định hướng, số học viên, vốn mục tiêu, mốc hòa vốn và mục tiêu dài hạn. **Giả định & KPI** chỉnh ngưỡng màu KPI, điều kiện công suất để mua máy, checklist và nguồn thu cửa hàng. Module Store tiếp tục có form chỉnh ngưỡng GO/NO-GO.

**Theo dõi triển khai** giữ lộ trình và tiến độ cũ, đồng thời cho thêm/sửa/xóa giai đoạn, tên, thời gian, công việc và gate. Công việc giữ nguyên tên giữ được trạng thái đã đánh dấu; công việc mới hoặc đổi tên bắt đầu chưa hoàn thành. Bỏ đánh dấu công việc sẽ thu hồi xác nhận gate của giai đoạn. Muốn dùng nội dung tham khảo từ ảnh làm lộ trình thật, nhấn **Dùng làm lộ trình vận hành**; hộp xác nhận giải thích việc thay lộ trình và khởi động lại tiến độ.

Dự báo và dự toán trong bản đồ không được ghi thành kết quả tài chính thực tế. Mốc mở cửa hàng được thể hiện là khảo sát và kiểm chứng; việc thuê mặt bằng vẫn cần đạt GO/NO-GO. Tab **Ảnh gốc** giữ bản tham khảo đầy đủ. Cập nhật tự bổ sung dữ liệu kế hoạch khi mở bản cũ, không xóa hoặc thay records vận hành; JSON backup bao gồm kế hoạch và vẫn nhập được bản backup cũ.
