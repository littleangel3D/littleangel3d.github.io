const uid = () => crypto.randomUUID();
export const planSchemas = {
  vision: {
    title: "mục tiêu",
    fields: [
      ["title", "Mục tiêu"],
      ["detail", "Nội dung", "textarea"],
    ],
  },
  values: {
    title: "giá trị cốt lõi",
    fields: [
      ["title", "Giá trị"],
      ["detail", "Diễn giải", "textarea"],
    ],
  },
  segments: {
    title: "nhóm sản phẩm / dịch vụ",
    fields: [
      ["title", "Tên nhóm"],
      ["detail", "Sản phẩm / dịch vụ (mỗi dòng một mục)", "textarea"],
      ["low", "Giá từ (đ)", "number"],
      ["high", "Giá đến (đ)", "number"],
      ["note", "Ghi chú giá"],
    ],
  },
  targets: {
    title: "nhóm khách hàng",
    fields: [
      ["title", "Nhóm khách hàng"],
      ["detail", "Nhu cầu / mô tả", "textarea"],
    ],
  },
  investment: {
    title: "khoản đầu tư dự kiến",
    fields: [
      ["title", "Hạng mục"],
      ["suggestion", "Gợi ý thiết bị / vật tư", "textarea"],
      ["low", "Chi phí thấp (đ)", "number"],
      ["high", "Chi phí cao (đ)", "number"],
      ["note", "Ghi chú", "textarea"],
    ],
  },
  streams: {
    title: "nguồn doanh thu",
    fields: [
      ["title", "Nguồn thu"],
      ["detail", "Hoạt động (mỗi dòng một mục)", "textarea"],
      ["low", "Doanh thu / tháng từ (đ)", "number"],
      ["high", "Doanh thu / tháng đến (đ)", "number"],
      ["note", "Giả định / lưu ý", "textarea"],
    ],
  },
  phases: {
    title: "giai đoạn kế hoạch",
    fields: [
      ["title", "Tên giai đoạn"],
      ["start", "Từ tháng dự án", "integer"],
      ["end", "Đến tháng dự án", "integer"],
      ["detail", "Công việc (mỗi dòng một mục)", "textarea"],
      ["gate", "Điều kiện kiểm chứng", "textarea"],
    ],
  },
  forecast: {
    title: "kỳ dự báo",
    fields: [
      ["title", "Tên kỳ"],
      ["start", "Từ tháng dự án", "integer"],
      ["end", "Đến tháng dự án", "integer"],
      ["revenueLow", "Doanh thu / tháng thấp (đ)", "number"],
      ["revenueHigh", "Doanh thu / tháng cao (đ)", "number"],
      ["profitLow", "Lợi nhuận / tháng thấp (đ)", "signed"],
      ["profitHigh", "Lợi nhuận / tháng cao (đ)", "signed"],
      ["note", "Giả định", "textarea"],
    ],
  },
  kpis: {
    title: "ngưỡng KPI",
    fields: [
      ["title", "Tên KPI"],
      ["yellow", "Ngưỡng vàng", "signed"],
      ["green", "Ngưỡng xanh", "signed"],
    ],
  },
};
export function defaultPlan() {
  const rows = (xs) => xs.map((x) => ({ id: uid(), ...x }));
  return {
    version: 1,
    title: "Kế hoạch kinh doanh 3D Printing",
    subtitle: "Từ trung tâm ngoại ngữ thiếu nhi → Maker Hub tại Củ Chi",
    studentCount: 270,
    tagline: "Quà tặng · Giáo cụ · Sáng tạo · Cộng đồng",
    budget: 30000000,
    breakEvenLow: 6,
    breakEvenHigh: 9,
    longTermLow: 2,
    longTermHigh: 3,
    longRevenueLow: 30000000,
    longRevenueHigh: 70000000,
    longTermNote:
      "Có thương hiệu 3D uy tín tại Củ Chi. Mở rộng chi nhánh hoặc nhượng quyền nếu phù hợp và đã chứng minh hiệu quả.",
    machineUtilization: 65,
    machineMonths: 3,
    machineBacklog: 1,
    storeChecklist:
      "Địa điểm\nGiá thuê\nDiện tích\nBàn ghế / nội thất\nKhu máy in\nKhu trưng bày\nTường filament\nVăn phòng phẩm\nBàn workshop\nAn toàn / thông gió\nNhân sự\nMarketing",
    storeStreams:
      "Custom 3D Printing\n3D Products\nFilament\nPrinter Parts\nTools\nStationery\nWorkshop\nSTEM Classes",
    vision: rows([
      {
        title: "Nâng cao trải nghiệm học tập",
        detail:
          "Tận dụng in 3D cho học viên tại trung tâm, sau đó mở rộng thành cửa hàng 3D local tại Củ Chi.",
      },
      {
        title: "Điểm đến sáng tạo tại địa phương",
        detail:
          "In 3D, giáo cụ, linh kiện, văn phòng phẩm và chia sẻ kiến thức công nghệ cho cộng đồng.",
      },
      {
        title: "Doanh thu bền vững",
        detail:
          "Kết hợp giáo dục – sáng tạo – thương mại. Kiểm chứng nhu cầu trước khi mở rộng.",
      },
    ]),
    values: rows([
      {
        title: "Sáng tạo thực tế",
        detail: "Ý tưởng phải có ứng dụng và giải quyết vấn đề thật.",
      },
      {
        title: "Phục vụ giáo dục và cộng đồng",
        detail: "Bắt đầu từ nhu cầu học viên, giáo viên và phụ huynh.",
      },
      {
        title: "Chất lượng – An toàn – Thân thiện",
        detail: "Chọn vật liệu và thiết kế phù hợp với người sử dụng.",
      },
      {
        title: "Hợp tác cùng phát triển",
        detail:
          "Kết nối phụ huynh, học sinh, giáo viên và cộng đồng địa phương.",
      },
    ]),
    segments: rows([
      {
        title: "Đồ chơi & quà tặng học viên",
        detail:
          "Đồ chơi khớp, mô hình cute\nHuy hiệu, móc khóa\nĐổi quà theo điểm học tập",
        low: 10000,
        high: 50000,
        note: "Giá tham khảo / sản phẩm",
      },
      {
        title: "Giáo cụ cho giáo viên",
        detail:
          "Bảng chữ, flashcard 3D\nMô hình học từ vựng\nTrò chơi tương tác\nDụng cụ lớp học",
        low: 20000,
        high: 150000,
        note: "Giá tham khảo / bộ hoặc sản phẩm",
      },
      {
        title: "Sản phẩm thương mại",
        detail:
          "Đồ dùng học tập, decor\nPhụ kiện điện thoại, giá đỡ\nQuà tặng cá nhân hóa",
        low: 30000,
        high: 150000,
        note: "Giá tham khảo / sản phẩm",
      },
      {
        title: "Dịch vụ theo yêu cầu",
        detail:
          "Khách mang file / ý tưởng\nIn theo mẫu, scan & in\nThiết kế đơn giản theo yêu cầu",
        low: 50000,
        high: 500000,
        note: "Có thể cao hơn tùy yêu cầu; báo giá theo từng đơn",
      },
    ]),
    targets: rows([
      {
        title: "Học viên & phụ huynh",
        detail:
          "Tệp khách hàng hiện có của trung tâm; có thể tăng theo thời gian.",
      },
      {
        title: "Giáo viên",
        detail: "Giáo cụ, vật dụng lớp học và đồ dùng cá nhân hóa.",
      },
      {
        title: "Cộng đồng địa phương tại Củ Chi",
        detail: "In theo yêu cầu, quà tặng và linh kiện thay thế.",
      },
      {
        title: "Học sinh các trường lân cận",
        detail: "Sản phẩm học tập, STEM và workshop.",
      },
      {
        title: "Maker / Hobbyist",
        detail: "Vật tư, phụ kiện, trao đổi thiết kế và kinh nghiệm.",
      },
      {
        title: "Doanh nghiệp nhỏ",
        detail: "In mẫu, linh kiện, QR stand và quà tặng B2B.",
      },
    ]),
    investment: rows([
      {
        title: "Máy in 3D FDM",
        suggestion: "Bambu Lab A1 Combo (hoặc P1S Combo)",
        low: 12000000,
        high: 16000000,
        note: "Nhanh, ổn định; có AMS in đa màu.",
      },
      {
        title: "Vật tư ban đầu",
        suggestion: "PLA, PETG (5–10 cuộn)",
        low: 3000000,
        high: 3000000,
        note: "Đa màu, phục vụ test.",
      },
      {
        title: "Phụ kiện, dụng cụ",
        suggestion: "Bàn in, keo, dụng cụ hoàn thiện, sơn",
        low: 2000000,
        high: 2000000,
        note: "Kìm, dao, giấy nhám…",
      },
      {
        title: "Máy tính / phần mềm",
        suggestion: "PC hiện có + phần mềm thiết kế / slicer",
        low: 0,
        high: 2000000,
        note: "Nếu cần nâng cấp.",
      },
      {
        title: "Kệ trưng bày, bàn làm việc",
        suggestion: "Bàn, kệ, tủ hộp, đèn",
        low: 3000000,
        high: 3000000,
        note: "Giai đoạn đầu đặt tại trung tâm.",
      },
      {
        title: "Bao bì, nhãn, marketing",
        suggestion: "Túi, hộp, sticker, chụp ảnh",
        low: 1000000,
        high: 1000000,
        note: "Thương hiệu riêng.",
      },
      {
        title: "Dự phòng",
        suggestion: "Phát sinh",
        low: 2000000,
        high: 2000000,
        note: "Giữ vốn xử lý phát sinh.",
      },
    ]),
    streams: rows([
      {
        title: "Sản phẩm nội bộ cho trung tâm",
        detail: "Quà tặng, đồ chơi, giáo cụ\nTăng gắn kết, giữ chân học viên",
        low: 1000000,
        high: 5000000,
        note: "Giá trị kinh tế tham khảo, có thể là hỗ trợ hoạt động trung tâm; chỉ hạch toán doanh thu khi có giao dịch thực.",
      },
      {
        title: "Bán lẻ tại cửa hàng & online",
        detail:
          "Đồ chơi, quà tặng, phụ kiện, decor\nVăn phòng phẩm\nIn theo yêu cầu",
        low: 5000000,
        high: 20000000,
        note: "Tùy giai đoạn và kênh bán.",
      },
      {
        title: "Dịch vụ in theo yêu cầu",
        detail:
          "Khách mang file hoặc yêu cầu thiết kế\nIn mẫu, linh kiện, mô hình lớn",
        low: 5000000,
        high: 15000000,
        note: "Không cộng trùng đơn đã tính trong bán lẻ.",
      },
      {
        title: "Workshop & đào tạo",
        detail:
          "Trải nghiệm in 3D cho học sinh\nKhóa cơ bản cho phụ huynh, giáo viên\nCâu lạc bộ STEM",
        low: 2000000,
        high: 10000000,
        note: "Cần đủ người đăng ký và tính đủ chi phí tổ chức.",
      },
    ]),
    phases: rows([
      {
        title: "Chuẩn bị & thử nghiệm",
        start: 1,
        end: 2,
        detail:
          "Mua máy, vật tư, setup\nHọc vận hành, test in\nThiết kế 20–30 sản phẩm đồ chơi & giáo cụ ban đầu",
        gate: "Có ít nhất 5 sản phẩm được sử dụng thật.",
      },
      {
        title: "Ứng dụng tại trung tâm",
        start: 3,
        end: 4,
        detail:
          "Đưa đồ 3D vào lớp học\nĐổi quà cho học viên\nThu thập phản hồi giáo viên / phụ huynh, cải tiến sản phẩm",
        gate: "Có sản phẩm dùng lặp lại và có người muốn mua.",
      },
      {
        title: "Bán online & nhận in theo yêu cầu",
        start: 5,
        end: 6,
        detail:
          "Mở Shopee / TikTok Shop\nXây dựng thương hiệu\nChụp ảnh, quay video, làm nội dung\nNhận yêu cầu đơn giản",
        gate: "100 đơn đã thanh toán; SKU có lợi nhuận.",
      },
      {
        title: "Nghiên cứu cửa hàng 3D tại Củ Chi",
        start: 7,
        end: 9,
        detail:
          "Khảo sát mặt bằng nhỏ 15–30m²\nDự toán trưng bày sản phẩm, vật tư\nDịch vụ in, linh kiện, văn phòng phẩm\nThử workshop cuối tuần",
        gate: "Chỉ thuê mặt bằng nếu đạt đầy đủ GO / NO-GO của module 3D Store.",
      },
      {
        title: "Mở rộng & tối ưu",
        start: 10,
        end: 12,
        detail:
          "Đa dạng hóa sản phẩm đã được validate\nHợp tác trường học, doanh nghiệp\nTối ưu quy trình, tăng năng suất\nXây dựng cộng đồng 3D tại Củ Chi",
        gate: "Có lợi nhuận, dòng tiền dương và nhu cầu lặp lại.",
      },
    ]),
    forecast: rows([
      {
        title: "Thử nghiệm",
        start: 1,
        end: 3,
        revenueLow: 2000000,
        revenueHigh: 5000000,
        profitLow: 0,
        profitHigh: 2000000,
        note: "Kịch bản tham khảo từ ảnh.",
      },
      {
        title: "Bán online",
        start: 4,
        end: 6,
        revenueLow: 5000000,
        revenueHigh: 12000000,
        profitLow: 2000000,
        profitHigh: 6000000,
        note: "Phụ thuộc nhu cầu và hiệu quả kênh bán.",
      },
      {
        title: "Kiểm chứng cửa hàng",
        start: 7,
        end: 9,
        revenueLow: 10000000,
        revenueHigh: 25000000,
        profitLow: 5000000,
        profitHigh: 12000000,
        note: "Chưa phải quyết định thuê mặt bằng.",
      },
      {
        title: "Tối ưu",
        start: 10,
        end: 12,
        revenueLow: 20000000,
        revenueHigh: 40000000,
        profitLow: 10000000,
        profitHigh: 20000000,
        note: "Chỉ tăng sản lượng với SKU đã kiểm chứng.",
      },
    ]),
    kpis: rows(
      [
        ["utilization", "Machine utilization", 40, 65, false, "%"],
        ["failure", "Failure rate", 10, 5, true, "%"],
        ["margin", "Gross margin", 40, 60, false, "%"],
        ["revenue", "Monthly revenue", 3000000, 6000000, false, "đ"],
        ["profit", "Monthly profit", 0, 1500000, false, "đ"],
        ["repeat", "Repeat customer", 15, 30, false, "%"],
        ["sku", "SKU success rate", 20, 40, false, "%"],
        ["turnover", "Inventory turnover", 0.3, 0.8, false, "lần"],
        ["runway", "Cash runway", 3, 6, false, "tháng"],
      ].map(([key, title, yellow, green, reverse, unit]) => ({
        key,
        title,
        yellow,
        green,
        reverse,
        unit,
      })),
    ),
  };
}
export function ensurePlan(d) {
  if (!d.businessPlan) d.businessPlan = defaultPlan();
  return d.businessPlan;
}
export function validatePlan(p) {
  if (!p || p.version !== 1) throw Error("Kế hoạch không hợp lệ");
  for (const k of [
    "title",
    "subtitle",
    "tagline",
    "longTermNote",
    "storeChecklist",
    "storeStreams",
  ])
    if (typeof p[k] !== "string") throw Error("Thiếu nội dung kế hoạch: " + k);
  for (const k of [
    "studentCount",
    "budget",
    "breakEvenLow",
    "breakEvenHigh",
    "longTermLow",
    "longTermHigh",
    "longRevenueLow",
    "longRevenueHigh",
    "machineUtilization",
    "machineMonths",
    "machineBacklog",
  ])
    if (!Number.isFinite(p[k]) || p[k] < 0)
      throw Error("Giả định không hợp lệ: " + k);
  if (
    p.machineMonths < 1 ||
    p.machineMonths > 6 ||
    !Number.isInteger(p.machineMonths)
  )
    throw Error("Số tháng công suất phải từ 1 đến 6");
  if (p.machineUtilization > 100) throw Error("Công suất không vượt 100%");
  for (const [lo, hi] of [
    ["breakEvenLow", "breakEvenHigh"],
    ["longTermLow", "longTermHigh"],
    ["longRevenueLow", "longRevenueHigh"],
  ])
    if (p[lo] > p[hi]) throw Error("Khoảng giá trị bị đảo");
  for (const [section, schema] of Object.entries(planSchemas)) {
    if (!Array.isArray(p[section])) throw Error("Thiếu mục " + section);
    const seen = new Set();
    for (const r of p[section]) {
      if (typeof r.id !== "string" || seen.has(r.id))
        throw Error("ID kế hoạch trùng hoặc trống");
      seen.add(r.id);
      for (const [k, label, type] of schema.fields) {
        if (["number", "integer", "signed"].includes(type)) {
          if (
            !Number.isFinite(r[k]) ||
            (type !== "signed" && r[k] < 0) ||
            (type === "integer" && (!Number.isInteger(r[k]) || r[k] < 1))
          )
            throw Error("Giá trị không hợp lệ: " + label);
        } else if (typeof r[k] !== "string")
          throw Error("Nội dung không hợp lệ: " + label);
      }
      if (
        (r.low != null && r.low > r.high) ||
        (r.start != null && r.start > r.end) ||
        (r.revenueLow != null && r.revenueLow > r.revenueHigh) ||
        (r.profitLow != null && r.profitLow > r.profitHigh)
      )
        throw Error("Giá trị từ phải nhỏ hơn hoặc bằng giá trị đến");
      if (
        section === "kpis" &&
        (typeof r.reverse !== "boolean" ||
          typeof r.key !== "string" ||
          typeof r.unit !== "string" ||
          (r.reverse ? r.green > r.yellow : r.green < r.yellow))
      )
        throw Error("Ngưỡng xanh / vàng không hợp lệ");
    }
  }
  return p;
}
export function editPhase(old, values) {
  const tasks = values.tasks
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  if (
    !values.title.trim() ||
    !values.months.trim() ||
    !tasks.length ||
    !values.gate.trim()
  )
    throw Error("Điền tên, thời gian, công việc và gate");
  const done = tasks.map((t) => old?.done[old.tasks.indexOf(t)] === true);
  return {
    title: values.title.trim(),
    months: values.months.trim(),
    tasks,
    done,
    gate: values.gate.trim(),
    passed: !!old?.passed && done.every(Boolean),
  };
}
