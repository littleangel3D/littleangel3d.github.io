import { defaultPlan, ensurePlan, validatePlan } from "./plan.js";
export const TODAY = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const stages = [
  "IDEA",
  "DESIGN",
  "PROTOTYPE",
  "INTERNAL TEST",
  "COST TEST",
  "MARKET TEST",
  "VALIDATED",
  "SELLING",
  "KILLED",
];
export const categories = [
  "Toy",
  "Gift",
  "Education",
  "Teacher Tool",
  "Functional",
  "Personalized",
  "Replacement Part",
  "Decor",
  "B2B",
];
export const channels = [
  "Internal Center",
  "Facebook",
  "Shopee",
  "TikTok",
  "Walk-in",
  "B2B",
  "Custom Printing",
  "Digital",
];
export const segments = [
  "Học viên",
  "Phụ huynh",
  "Giáo viên",
  "Trung tâm ngoại ngữ",
  "Trường học",
  "Khách Củ Chi",
  "Maker",
  "Hobbyist",
  "Doanh nghiệp nhỏ",
];
export const money = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
export const num = (n) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(
    Number(n) || 0,
  );
export function economics(x) {
  const material = (x.weight * x.filamentPrice) / 1000;
  const machine = x.hours * (x.electricity + x.depreciation);
  const production = (material + machine) / (1 - Math.min(x.failure, 99) / 100);
  const cogs = production + x.labor + x.packaging;
  const fee = (x.price * x.platform) / 100;
  const gross = x.price - cogs;
  const contribution = gross - fee - x.ad - x.shipping;
  return {
    material,
    machine,
    production,
    cogs,
    fee,
    gross,
    contribution,
    margin: x.price ? (gross / x.price) * 100 : 0,
    breakEven: contribution > 0 ? Math.ceil(x.fixed / contribution) : null,
  };
}
export const defaultCalc = {
  filamentPrice: 250000,
  weight: 32,
  hours: 1.2,
  electricity: 300,
  depreciation: 1800,
  failure: 5,
  labor: 5000,
  packaging: 3000,
  platform: 12,
  ad: 5000,
  shipping: 2000,
  price: 69000,
  fixed: 30000000,
};
export function productScore(p) {
  const v = (k) => Number(p[k] ?? 5);
  return Math.round(
    ((v("demand") +
      v("marginScore") +
      (11 - v("timeScore")) +
      (11 - v("failureScore")) +
      (11 - v("competition")) +
      v("repeatability") +
      v("personalization") +
      v("scalability")) /
      80) *
      100,
  );
}
export function opportunity(p) {
  return Math.round(
    ((Number(p.demand || 5) +
      Number(p.margin || 5) +
      (11 - Number(p.competition || 5)) +
      Number(p.printability || 5) +
      Number(p.uniqueness || 5)) /
      50) *
      100,
  );
}
export function seed() {
  const products = [
    "Flexi Animal Original",
    "Móc khóa tên",
    "Mini Trophy",
    "English Star Trophy",
    "Marker Holder",
    "Teacher Name Plate",
    "Phone Stand",
    "QR Stand",
    "Phonics Letters",
    "Vocabulary Objects",
    "Classroom Token",
    "Bag Tag",
    "Cable Organizer",
    "Desk Organizer",
    "Replacement Part Prototype",
  ].map((name, i) => ({
    id: "p" + i,
    name,
    category: categories[[0, 5, 1, 2, 3, 5, 4, 8, 2, 2, 2, 5, 4, 4, 6][i]],
    status: [
      "INTERNAL TEST",
      "SELLING",
      "MARKET TEST",
      "SELLING",
      "VALIDATED",
      "SELLING",
      "COST TEST",
      "PROTOTYPE",
      "INTERNAL TEST",
      "DESIGN",
      "SELLING",
      "MARKET TEST",
      "IDEA",
      "PROTOTYPE",
      "DESIGN",
    ][i],
    description: "Thiết kế thử nghiệm trong trung tâm ngoại ngữ Củ Chi.",
    problem:
      i % 2
        ? "Cá nhân hóa phần thưởng, tăng động lực học tập."
        : "Hỗ trợ hoạt động lớp học và sử dụng hằng ngày.",
    target: i % 2 ? "Học viên" : "Giáo viên",
    source: "Quan sát tại trung tâm",
    designer: "3D Lab",
    file: "",
    version: "1.0",
    printer: "m1",
    material: "PLA",
    color: ["Cam", "Trắng", "Xanh"][i % 3],
    image: "",
    weight: [45, 18, 55, 62, 80, 48, 42, 35, 85, 60, 8, 22, 12, 120, 25][i],
    hours: [
      2.1, 0.6, 2.8, 3.2, 4.2, 2.3, 1.8, 1.4, 4, 3, 0.3, 0.8, 0.4, 6, 1.2,
    ][i],
    support: "Không",
    failure: 5,
    labor: 5000,
    packaging: 3000,
    price: [
      79000, 49000, 99000, 149000, 129000, 99000, 79000, 89000, 199000, 149000,
      19000, 69000, 29000, 249000, 99000,
    ][i],
    testQty: i % 3 ? 15 : 25,
    feedback: "Ưu tiên bề mặt nhẵn, dễ vệ sinh.",
    teacherFeedback: "Dễ sử dụng trong lớp học.",
    studentFeedback: "Thích màu sắc và tên riêng.",
    rating: 4.5,
    demand: 8,
    marginScore: 8,
    timeScore: 4,
    failureScore: 2,
    competition: 5,
    repeatability: 8,
    personalization: i % 2 ? 9 : 6,
    scalability: 7,
  }));
  const customers = [
    ["Nguyễn Minh Anh", "Học viên"],
    ["Trần Hoài An", "Phụ huynh"],
    ["Cô Thanh Trúc", "Giáo viên"],
    ["Anh Tuấn • Củ Chi", "Khách Củ Chi"],
    ["Trung tâm Sun English", "Trung tâm ngoại ngữ"],
    ["Lê Bảo Ngọc", "Học viên"],
    ["Chị Mỹ Linh", "Phụ huynh"],
    ["Tiệm Cà phê Góc Nhỏ", "Doanh nghiệp nhỏ"],
    ["Trường Tiểu học Tân Phú", "Trường học"],
    ["Phạm Gia Huy", "Maker"],
    ["Trần Khánh Vy", "Hobbyist"],
    ["Nguyễn Thảo", "Khách Củ Chi"],
  ].map(([name, segment], i) => ({
    id: "c" + i,
    name,
    segment,
    phone: "",
    email: "",
    note: "Khách hàng mẫu — thay bằng dữ liệu thật.",
    created: "2026-0" + (7 + (i % 3)) + "-10",
  }));
  const orders = Array.from({ length: 64 }, (_, i) => {
    const month = 7 + Math.floor(i / 16),
      p = products[[1, 3, 5, 10, 2, 11, 0, 8][i % 8]],
      qty = 1 + (i % 5);
    return {
      id: "o" + i,
      code: "DH-" + String(1001 + i),
      customer: "c" + (i % 12),
      channel: channels[[0, 0, 0, 1, 2, 3, 4, 6][i % 8]],
      product: p.id,
      quantity: qty,
      revenue: p.price * qty,
      cogs: Math.round((p.weight * 250 + p.hours * 2100 + 8000) * qty),
      fee: i % 8 > 3 ? Math.round(p.price * qty * 0.12) : 0,
      ad: i % 8 > 2 ? 5000 : 0,
      status: i > 60 ? "Đang xử lý" : "Đã thanh toán",
      date: `2026-${String(month).padStart(2, "0")}-${String(2 + (i % 16)).padStart(2, "0")}`,
    };
  });
  const jobs = Array.from({ length: 35 }, (_, i) => ({
    id: "j" + i,
    code: "PR-" + String(201 + i),
    product: products[i % 15].id,
    customer: "c" + (i % 12),
    machine: "m1",
    quantity: 1 + (i % 4),
    filament: "f" + (i % 3),
    grams: products[i % 15].weight * (1 + (i % 4)),
    estimated: products[i % 15].hours * (1 + (i % 4)),
    actual: i < 30 ? products[i % 15].hours * (1 + (i % 4)) : 0,
    status:
      i < 27
        ? "Completed"
        : i < 30
          ? "Failed"
          : i === 30
            ? "Printing"
            : "Queued",
    start:
      i < 31 ? `2026-10-${String(1 + (i % 26)).padStart(2, "0")}T08:00` : "",
    finish:
      i < 30 ? `2026-10-${String(1 + (i % 26)).padStart(2, "0")}T14:00` : "",
    failureReason: i >= 27 && i < 30 ? "Bám bàn kém" : "",
    reprint: false,
    cost: 12000,
    revenue: 0,
    deducted: i < 30,
  }));
  return {
    version: 1,
    businessPlan: defaultPlan(),
    demo: true,
    settings: {
      initial: 30000000,
      phase: 2,
      startMonth: "2026-07",
      capacityHours: 360,
      filamentThreshold: 200,
      runwayReserve: 9000000,
    },
    products,
    customers,
    orders,
    jobs,
    filaments: [
      {
        id: "f0",
        brand: "PLA cơ bản",
        material: "PLA",
        color: "Cam",
        spool: 1000,
        remaining: 680,
        cost: 250000,
        supplier: "Nhà cung cấp nội địa",
        date: "2026-10-01",
      },
      {
        id: "f1",
        brand: "PLA cơ bản",
        material: "PLA",
        color: "Trắng",
        spool: 1000,
        remaining: 150,
        cost: 250000,
        supplier: "Nhà cung cấp nội địa",
        date: "2026-10-01",
      },
      {
        id: "f2",
        brand: "PETG",
        material: "PETG",
        color: "Xanh",
        spool: 1000,
        remaining: 820,
        cost: 290000,
        supplier: "Nhà cung cấp nội địa",
        date: "2026-10-05",
      },
    ],
    machines: [
      {
        id: "m1",
        name: "Bambu Lab A1",
        model: "A1 • FDM",
        date: "2026-07-05",
        price: 14000000,
        electricity: 300,
        depreciation: 1800,
        baselineHours: 220,
        nozzle: "0.4 mm",
        plate: "Textured PEI",
        accessories: "AMS Lite, hộp chống ẩm",
        remainingValue: 11500000,
      },
    ],
    maintenance: [
      {
        id: "mt1",
        machine: "m1",
        date: "2026-10-20",
        task: "Vệ sinh trục, bôi trơn, kiểm tra nozzle",
        cost: 120000,
        next: "2026-11-20",
      },
    ],
    budget: [
      ["Máy in 3D", 14000000, 14000000],
      ["Filament", 3000000, 2250000],
      ["Dụng cụ / phụ kiện", 2000000, 1450000],
      ["Bàn / kệ / setup", 2000000, 1800000],
      ["CAD / software / prototype", 2000000, 650000],
      ["Bao bì / nhãn", 1000000, 420000],
      ["Marketing test", 3000000, 600000],
      ["Dự phòng", 3000000, 0],
    ].map(([name, budget, actual], i) => ({
      id: "b" + i,
      name,
      budget,
      actual,
    })),
    expenses: [
      {
        id: "e1",
        name: "Điện tháng 10",
        category: "Electricity",
        amount: 180000,
        date: "2026-10-25",
      },
      {
        id: "e2",
        name: "Vệ sinh máy tháng 10",
        category: "Maintenance",
        amount: 120000,
        date: "2026-10-20",
      },
      {
        id: "e3",
        name: "Phần mềm thiết kế",
        category: "Software",
        amount: 150000,
        date: "2026-10-01",
      },
      {
        id: "e4",
        name: "Điện tháng 9",
        category: "Electricity",
        amount: 150000,
        date: "2026-09-25",
      },
      {
        id: "e5",
        name: "Vật tư thử nghiệm",
        category: "Misc",
        amount: 230000,
        date: "2026-09-15",
      },
    ],
    income: [],
    inventory: [
      {
        id: "i1",
        name: "Túi zip 10 × 15",
        type: "Packaging",
        quantity: 180,
        unit: "túi",
        min: 50,
        cost: 800,
        price: 0,
        supplier: "Nội địa",
      },
      {
        id: "i2",
        name: "Móc khóa kim loại",
        type: "Accessories",
        quantity: 34,
        unit: "cái",
        min: 50,
        cost: 1500,
        price: 3000,
        supplier: "Nội địa",
      },
      {
        id: "i3",
        name: "Nozzle 0.4 mm",
        type: "Printer Parts",
        quantity: 2,
        unit: "cái",
        min: 1,
        cost: 120000,
        price: 170000,
        supplier: "Nội địa",
      },
    ],
    workshops: [
      "3D Printing for Kids",
      "Design Your Name Tag",
      "My First 3D Model",
      "Introduction to Bambu Studio",
      "3D Printing for Parents",
      "STEM + 3D Printing",
      "Beginner Maker Workshop",
    ].map((name, i) => ({
      id: "w" + i,
      name,
      date: `2026-${i < 2 ? "10" : "11"}-${String(10 + i * 3).padStart(2, "0")}`,
      topic: ["Làm quen máy in 3D", "Cá nhân hóa", "Thiết kế cơ bản"][i % 3],
      instructor: "3D Lab",
      capacity: 15,
      registered: i < 2 ? 12 : 0,
      price: 149000,
      status: i < 2 ? "Hoàn thành" : "Dự kiến",
    })),
    ideas: [
      {
        id: "a1",
        name: "Bộ thẻ phonics nổi",
        category: "Education",
        source: "Giáo viên",
        problem: "Học âm qua xúc giác",
        target: "Học viên",
        competitor: "Thẻ giấy",
        price: 199000,
        difficulty: "Trung bình",
        potential: "Cao",
        status: "Đang nghiên cứu",
        demand: 9,
        margin: 8,
        competition: 4,
        printability: 8,
        uniqueness: 8,
      },
      {
        id: "a2",
        name: "QR stand cho quán cà phê",
        category: "B2B",
        source: "Khách local",
        problem: "Trưng bày mã thanh toán",
        target: "Doanh nghiệp nhỏ",
        competitor: "Stand mica",
        price: 89000,
        difficulty: "Thấp",
        potential: "Khá",
        status: "Ý tưởng",
        demand: 7,
        margin: 7,
        competition: 8,
        printability: 9,
        uniqueness: 6,
      },
    ],
    roadmap: [
      {
        title: "LEARN & LAB",
        months: "Tháng 1–2",
        tasks: [
          "Mua máy",
          "Setup lab",
          "Học slicer",
          "Học CAD",
          "20 prototype",
        ],
        done: [true, true, true, true, true],
        gate: "5 sản phẩm được sử dụng thật",
        passed: true,
      },
      {
        title: "CENTER VALIDATION",
        months: "Tháng 3–4",
        tasks: ["Quà đổi điểm", "Giáo cụ", "Teacher tools", "Personalization"],
        done: [true, true, true, false],
        gate: "Sản phẩm được dùng lặp lại và có người muốn mua",
        passed: false,
      },
      {
        title: "ONLINE SALES",
        months: "Tháng 5–6",
        tasks: ["Shopee", "TikTok", "Facebook", "10 SKU"],
        done: [false, false, true, false],
        gate: "100 đơn đã thanh toán",
        passed: false,
      },
      {
        title: "LOCAL MARKET",
        months: "Tháng 7–9",
        tasks: [
          "Nhận in theo yêu cầu tại Củ Chi",
          "Bán filament / phụ kiện",
          "Workshop thử nghiệm",
        ],
        done: [false, false, false],
        gate: "Khách ngoài trung tâm quay lại",
        passed: false,
      },
      {
        title: "STORE DECISION",
        months: "Tháng 10–12",
        tasks: [
          "Phân tích doanh thu / lợi nhuận",
          "Nhu cầu local",
          "Công suất máy",
          "Tệp khách hàng",
        ],
        done: [false, false, false, false],
        gate: "Đủ điều kiện GO / NO-GO",
        passed: false,
      },
    ],
    store: {
      checks: Array(12).fill(false),
      externalRevenue: 10000000,
      localRepeat: 10,
      customOrders: 10,
      steadySku: 5,
      positiveMonths: 3,
      reserveMonths: 6,
      rent: 4000000,
      other: 2000000,
    },
    reviews: {},
    calc: { ...defaultCalc },
  };
}
export class Repository {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
    try {
      const raw = storage.getItem("cuchi-os-v1");
      this.data = raw ? JSON.parse(raw) : seed();
      if (!Array.isArray(this.data.products) || !this.data.settings)
        throw Error("invalid");
    } catch {
      this.data = seed();
      this.recovered = true;
    }
    ensurePlan(this.data);
    this.save();
  }
  save() {
    try {
      this.storage.setItem("cuchi-os-v1", JSON.stringify(this.data));
      this.error = false;
    } catch {
      this.error = true;
    }
  }
  all(t) {
    return this.data[t] || [];
  }
  get(t, id) {
    return this.all(t).find((x) => x.id === id);
  }
  upsert(t, row) {
    let i = this.all(t).findIndex((x) => x.id === row.id);
    if (i < 0) this.data[t].push({ ...row, id: row.id || uid() });
    else this.data[t][i] = row;
    this.save();
  }
  delete(t, id) {
    this.data[t] = this.all(t).filter((x) => x.id !== id);
    this.save();
  }
}
export function productCost(p, d) {
  const f = d.filaments.find((x) => x.material === p.material);
  const filamentPrice = f && f.spool ? (f.cost / f.spool) * 1000 : 250000;
  const machine = d.machines.find((m) => m.id === p.printer);
  return economics({
    ...defaultCalc,
    electricity: Number(machine?.electricity ?? 300),
    depreciation: Number(machine?.depreciation ?? 1800),
    filamentPrice,
    weight: +p.weight || 0,
    hours: +p.hours || 0,
    failure: +p.failure || 0,
    labor: +p.labor || 0,
    packaging: +p.packaging || 0,
    price: +p.price || 0,
  });
}
export const sum = (rows, key) =>
  rows.reduce(
    (s, x) => s + (Number(typeof key === "function" ? key(x) : x[key]) || 0),
    0,
  );
export function metrics(d, month) {
  const paid = d.orders.filter(
    (o) => o.status === "Đã thanh toán" && o.date.slice(0, 7) <= month,
  );
  const monthly = paid.filter((o) => o.date.startsWith(month));
  const extra = d.income.filter((o) => o.date.startsWith(month));
  const expenses = d.expenses.filter((o) => o.date.startsWith(month));
  const revenue = sum(monthly, "revenue") + sum(extra, "amount");
  const cogs = sum(monthly, "cogs");
  const gross = revenue - cogs;
  const selling = sum(monthly, (o) => o.fee + o.ad);
  const operating = sum(expenses, "amount");
  const profit = gross - selling - operating;
  const cumulative =
    sum(paid, (o) => o.revenue - o.cogs - o.fee - o.ad) +
    sum(
      d.income.filter((x) => x.date.slice(0, 7) <= month),
      "amount",
    ) -
    sum(
      d.expenses.filter((x) => x.date.slice(0, 7) <= month),
      "amount",
    );
  const invested = sum(d.budget, "actual");
  const jobs = d.jobs.filter((j) => (j.start || "").startsWith(month));
  const finished = jobs.filter((j) =>
    ["Completed", "Failed"].includes(j.status),
  );
  const hours = sum(finished, "actual");
  const failed = finished.filter((j) => j.status === "Failed").length;
  const capacity = d.settings.capacityHours * Math.max(d.machines.length, 1);
  const utilization = (hours / capacity) * 100;
  const activeCustomers = [...new Set(monthly.map((o) => o.customer))];
  const repeats = activeCustomers.filter(
    (id) => paid.filter((o) => o.customer === id).length > 1,
  );
  return {
    paid,
    monthly,
    revenue,
    cogs,
    gross,
    selling,
    operating,
    profit,
    cumulative,
    invested,
    unspent: d.settings.initial - invested,
    remaining: d.settings.initial - invested + cumulative,
    recovered: (Math.max(0, cumulative) / d.settings.initial) * 100,
    roi: (cumulative / d.settings.initial) * 100,
    jobs,
    finished,
    hours,
    failed,
    utilization,
    success: finished.length
      ? ((finished.length - failed) / finished.length) * 100
      : 0,
    failure: finished.length ? (failed / finished.length) * 100 : 0,
    grams: sum(finished, "grams"),
    customers: activeCustomers,
    repeats,
    aov: monthly.length ? sum(monthly, "revenue") / monthly.length : 0,
    margin: revenue ? (gross / revenue) * 100 : 0,
  };
}
export function transitionJob(
  d,
  id,
  next,
  now = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 16),
) {
  const j = d.jobs.find((j) => j.id === id);
  if (!j) throw Error("Không tìm thấy lệnh in");
  const allowed = {
    Queued: ["Printing", "Cancelled"],
    Printing: ["Completed", "Failed", "Cancelled"],
  };
  if (!allowed[j.status]?.includes(next))
    throw Error("Chuyển trạng thái không hợp lệ");
  if (["Completed", "Failed"].includes(next) && !j.deducted) {
    const spool = d.filaments.find((f) => f.id === j.filament);
    if (!spool) throw Error("Chọn cuộn filament trước khi hoàn tất");
    if (spool.remaining < j.grams)
      throw Error("Không đủ filament. Kiểm tra số gram hoặc bổ sung cuộn.");
    spool.remaining -= j.grams;
    j.deducted = true;
    j.finish = now;
    j.actual = Number(j.actual) || Number(j.estimated);
  }
  if (next === "Printing") {
    if (
      d.jobs.some(
        (x) =>
          x.id !== id && x.machine === j.machine && x.status === "Printing",
      )
    )
      throw Error("Máy đang có lệnh in khác");
    j.start = now;
  }
  j.status = next;
  return j;
}
export function validateImport(x) {
  if (
    !x ||
    x.version !== 1 ||
    !x.settings ||
    !Number.isFinite(x.settings.initial) ||
    x.settings.initial <= 0
  )
    throw Error("Bản sao lưu không hợp lệ");
  for (const k of [
    "products",
    "customers",
    "orders",
    "jobs",
    "filaments",
    "machines",
    "maintenance",
    "budget",
    "expenses",
    "income",
    "inventory",
    "workshops",
    "ideas",
    "roadmap",
  ])
    if (!Array.isArray(x[k])) throw Error("Thiếu bảng " + k);
  if (!x.store || !x.reviews || !x.calc) throw Error("Thiếu cấu hình");
  for (const k of ["capacityHours", "filamentThreshold", "runwayReserve"])
    if (!Number.isFinite(x.settings[k]) || x.settings[k] < 0)
      throw Error("Cấu hình không hợp lệ");
  if (
    x.settings.capacityHours <= 0 ||
    !Number.isInteger(x.settings.phase) ||
    x.settings.phase < 1 ||
    x.settings.phase > x.roadmap.length
  )
    throw Error("Giai đoạn / giờ máy không hợp lệ");
  if (!/^\d{4}-\d{2}$/.test(x.settings.startMonth))
    throw Error("Tháng bắt đầu không hợp lệ");
  for (const [k, v] of Object.entries(defaultCalc))
    if (!Number.isFinite(x.calc[k]) || x.calc[k] < 0)
      throw Error("Calculator không hợp lệ");
  if (x.calc.failure >= 100 || x.calc.platform > 100)
    throw Error("Tỷ lệ calculator không hợp lệ");
  if (
    x.roadmap.length < 1 ||
    x.roadmap.some(
      (p) =>
        !Array.isArray(p.tasks) ||
        !p.tasks.length ||
        !Array.isArray(p.done) ||
        p.done.length !== p.tasks.length ||
        p.tasks.some((t) => typeof t !== "string") ||
        p.done.some((v) => typeof v !== "boolean"),
    )
  )
    throw Error("Roadmap không hợp lệ");
  if (
    !Array.isArray(x.store.checks) ||
    x.store.checks.length !==
      ensurePlan(x).storeChecklist.split("\n").filter(Boolean).length ||
    x.store.checks.some((v) => typeof v !== "boolean")
  )
    throw Error("Checklist cửa hàng không hợp lệ");
  for (const k of [
    "externalRevenue",
    "localRepeat",
    "customOrders",
    "steadySku",
    "positiveMonths",
    "reserveMonths",
    "rent",
    "other",
  ])
    if (!Number.isFinite(x.store[k]) || x.store[k] < 1)
      throw Error("Ngưỡng cửa hàng không hợp lệ");
  if (!Number.isInteger(x.store.positiveMonths) || x.store.positiveMonths > 6)
    throw Error("Số tháng đánh giá không hợp lệ");
  const numeric = {
    products: ["weight", "hours", "failure", "labor", "packaging", "price"],
    orders: ["quantity", "revenue", "cogs", "fee", "ad"],
    jobs: ["grams", "estimated", "actual", "quantity", "cost"],
    filaments: ["spool", "remaining", "cost"],
    machines: ["price", "baselineHours", "remainingValue"],
    budget: ["budget", "actual"],
    expenses: ["amount"],
    income: ["amount"],
    inventory: ["quantity", "min", "cost", "price"],
    workshops: ["capacity", "registered", "price"],
  };
  for (const [table, keys] of Object.entries(numeric))
    for (const row of x[table])
      for (const k of keys)
        if (!Number.isFinite(row[k]) || row[k] < 0)
          throw Error("Thiếu số hợp lệ: " + table + "." + k);
  for (const t of [
    "orders",
    "expenses",
    "income",
    "workshops",
    "filaments",
    "machines",
    "maintenance",
  ])
    for (const row of x[t])
      if (typeof row.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.date))
        throw Error("Ngày không hợp lệ: " + t);
  for (const p of x.products)
    if (
      typeof p.name !== "string" ||
      !stages.includes(p.status) ||
      p.failure >= 100
    )
      throw Error("SKU không hợp lệ");
  for (const j of x.jobs)
    if (
      !["Queued", "Printing", "Completed", "Failed", "Cancelled"].includes(
        j.status,
      ) ||
      typeof j.start !== "string"
    )
      throw Error("Lệnh in không hợp lệ");
  const ids = new Set();
  for (const key of [
    "products",
    "customers",
    "orders",
    "jobs",
    "filaments",
    "machines",
    "maintenance",
    "budget",
    "expenses",
    "income",
    "inventory",
    "workshops",
    "ideas",
  ])
    for (const r of x[key]) {
      if (!r.id || ids.has(key + r.id)) throw Error("ID trùng hoặc trống");
      ids.add(key + r.id);
      for (const [k, v] of Object.entries(r))
        if (typeof v === "number" && (!Number.isFinite(v) || v < 0))
          throw Error("Số không hợp lệ: " + k);
    }
  validatePlan(ensurePlan(x));
  return x;
}
