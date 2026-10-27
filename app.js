import {
  Repository,
  seed,
  uid,
  money,
  num,
  metrics,
  sum,
  stages,
  categories,
  channels,
  segments,
  economics,
  productCost,
  productScore,
  opportunity,
  transitionJob,
  validateImport,
  TODAY,
} from "./model.js";
import { ensurePlan } from "./plan.js";
import { createPlanUI } from "./plan-ui.js";
import { schemas } from "./schema.js";
const repo = new Repository();
let d = repo.data,
  route = location.hash.slice(1) || "dashboard",
  month = TODAY.slice(0, 7),
  query = "",
  filter = "",
  view = "board",
  financeTab = "overview";
const $ = (s) => document.querySelector(s),
  esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const icons = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  box: "m12 3 9 5-9 5-9-5 9-5Z M3 8v9l9 5 9-5V8 M12 13v9 M7.5 5.5l9 5",
  lab: "M9 3h6 M10 3v6l-6 10a1.4 1.4 0 0 0 1.2 2h13.6a1.4 1.4 0 0 0 1.2-2L14 9V3 M7 15h10",
  printer: "M6 9V3h12v6 M6 18H3V9h18v9h-3 M6 14h12v8H6z M17 12h1",
  layers: "m12 3 10 5-10 5L2 8l10-5Z M2 12l10 5 10-5 M2 16l10 5 10-5",
  cart: "M2 3h3l3 12h11l3-9H6 M9 21h.01 M18 21h.01",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M18 8a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  wallet: "M20 7H4V4h14 M3 7h18v14H3z M16 12h5v5h-5z",
  store:
    "M3 10V6l2-3h14l2 3v4 M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 M4 13v8h16v-8 M9 21v-6h6v6",
  calendar: "M3 5h18v16H3z M7 2v6 M17 2v6 M3 10h18 M7 14h3",
  road: "M4 21V4h7v6h9v11 M1 18h6 M8 7h6 M17 17h6",
  bulb: "M9 18h6 M9 21h6 M8 14a7 7 0 1 1 8 0l-1 3H9l-1-3Z",
  settings:
    "M9 3h6l1 4 4 1 2 5-3 3v5l-5 1-3-3-4 1-4-4 1-5-1-3 3-4 3 1Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  chart: "M3 3v18h18 M7 15l4-5 4 3 6-9",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  plus: "M12 5v14 M5 12h14",
  search: "M21 21l-6-6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  bell: "M18 8a6 6 0 0 0-12 0v6l-3 4h18l-3-4V8 M10 21h4",
  download: "M12 3v12 M7 10l5 5 5-5 M3 16v5h18v-5",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12 M6 18 18 6",
  edit: "m15 4 5 5-11 11H4v-5L15 4Z M13 6l5 5",
  trash: "M3 6h18 M8 6V3h8v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  menu: "M3 6h18 M3 12h18 M3 18h18",
  target:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 12h.01",
  up: "m5 15 7-7 7 7",
  file: "M14 2H4v20h16V8L14 2Z M14 2v6h6 M8 13h8 M8 17h6",
  refresh: "M20 7V2l-4 4a8 8 0 1 0 3 11 M20 7h-5",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name] || icons.box}"/></svg>`;
const nav = [
  ["dashboard", "Tổng quan", "grid"],
  ["lab", "Product Lab", "lab"],
  ["products", "Sản phẩm / SKU", "box"],
  ["jobs", "Lệnh in", "printer"],
  ["machines", "Máy in", "layers"],
  ["filaments", "Filament", "layers"],
  ["orders", "Đơn hàng", "cart"],
  ["customers", "Khách hàng", "users"],
  ["finance", "Tài chính", "wallet"],
  ["inventory", "Kho vật tư", "box"],
  ["store", "3D Store", "store"],
  ["workshops", "Workshop", "calendar"],
  ["roadmap", "Lộ trình phát triển", "road"],
  ["ideas", "Kho ý tưởng", "bulb"],
  ["settings", "Cài đặt", "settings"],
];
const title = () =>
  route === "report"
    ? "Báo cáo tháng"
    : nav.find((n) => n[0] === route)?.[1] || "Tổng quan";
const btn = (text, action, extra = "", cls = "") =>
  `<button class="btn ${cls}" data-action="${action}" ${extra}>${text}</button>`;
const badge = (s, c) =>
  `<span class="pill ${c || (["SELLING", "Completed", "Đã thanh toán", "VALIDATED", "Hoàn thành"].includes(s) ? "green" : ["Failed", "KILLED", "Đã hủy"].includes(s) ? "red" : ["Printing", "INTERNAL TEST", "MARKET TEST", "Đang xử lý"].includes(s) ? "orange" : "gray")}">${esc(s)}</span>`;
const progress = (v, color = "") =>
  `<div class="progress"><span style="width:${Math.max(0, Math.min(100, v))}%;${color ? "background:" + color : ""}"></span></div>`;
const byId = (table, id) => d[table]?.find((x) => x.id === id),
  nameOf = (table, id) => {
    const x = byId(table, id);
    return x?.name || (x?.brand && `${x.brand} · ${x.color}`) || "—";
  };
const m = () => metrics(d, month);
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
}
function persist() {
  repo.save();
  if (repo.error)
    toast("Bộ nhớ trình duyệt đầy hoặc bị chặn. Hãy xuất bản sao lưu.");
}
function header(titleText, sub, actions = "") {
  return `<div class="page-heading"><div><div class="eyebrow">WORKSPACE / ${esc(title())}</div><h1>${titleText}</h1><p>${sub}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function cardHead(t, sub = "", right = "") {
  return `<div class="card-head"><div><h2>${t}</h2>${sub ? `<div class="card-sub">${sub}</div>` : ""}</div>${right}</div>`;
}
function kpi(label, value, foot, ic = "chart", color = "") {
  return `<div class="card kpi"><div class="kpi-top">${label}<span class="kpi-icon" ${color ? `style="color:${color};background:${color}12"` : ""}>${icon(ic)}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot">${foot}</div></div>`;
}
function monthOptions() {
  const months = new Set(
    [
      month,
      ...d.orders.map((x) => x.date?.slice(0, 7)),
      ...d.expenses.map((x) => x.date?.slice(0, 7)),
    ].filter(Boolean),
  );
  for (let i = -12; i <= 12; i++) {
    const t = new Date(month + "-01T12:00:00");
    t.setMonth(t.getMonth() + i);
    months.add(
      t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0"),
    );
  }
  return [...months]
    .sort()
    .reverse()
    .map(
      (x) =>
        `<option ${month === x ? "selected" : ""} value="${x}">Tháng ${x.slice(5)} / ${x.slice(0, 4)}</option>`,
    )
    .join("");
}
function render() {
  if (!nav.some((x) => x[0] === route) && route !== "report")
    route = "dashboard";
  $("#app").innerHTML =
    `<aside class="sidebar"><a href="#dashboard" class="brand"><span class="logo">${icon("box")}</span><span>3D CỦ CHI<small>Print · Learn · Create</small></span></a><div class="nav-label">QUẢN TRỊ KHÔNG GIAN</div><nav class="nav">${nav.map(([r, t, i], index) => `${index === 8 ? '<div class="nav-label">KINH DOANH & PHÁT TRIỂN</div>' : ""}<a href="#${r}" class="${r === route ? "active" : ""}">${icon(i)}${t}${r === "jobs" ? `<span class="count">${d.jobs.filter((x) => ["Queued", "Printing"].includes(x.status)).length}</span>` : ""}</a>`).join("")}</nav><div class="nav-foot">${icon("lab")} <b>Thử nhỏ. Học nhanh.</b><br>${num(ensurePlan(d).studentCount)}+ học viên. Một maker hub tương lai.</div><div class="user"><div class="avatar">CC</div><div><b style="color:#e1e7f3">Không gian của bạn</b><br><span style="color:#73839f;font-size:9px">3D Lab · Củ Chi, TP.HCM</span></div></div></aside><main class="main"><header class="topbar"><button class="icon-btn mobile-menu" data-action="menu" aria-label="Mở menu">${icon("menu")}</button><div class="crumb">Không gian làm việc <span>/</span> <b>${title()}</b></div><div class="top-actions"><span class="phase">Giai đoạn ${d.settings.phase} · ${esc(d.roadmap[d.settings.phase - 1]?.title || "—")}</span><select id="month-select" class="filter-select" aria-label="Tháng báo cáo">${monthOptions()}</select><button class="icon-btn" data-action="search" aria-label="Tìm kiếm toàn hệ thống">${icon("search")}</button><button class="icon-btn notification-dot" data-action="notifications" aria-label="Thông báo">${icon("bell")}</button>${btn(icon("plus") + " Thêm mới", "quick")}</div></header><div class="content">${pages[route]()}<footer class="footer"><span>3D CỦ CHI © 2026 · PRINT • LEARN • CREATE</span><span>${d.demo ? "DỮ LIỆU MẪU · " : ""}LƯU TRÊN TRÌNH DUYỆT · <a href="#settings">SAO LƯU DỮ LIỆU ↗</a></span></footer></div></main>`;
  bindPage();
}
const monthsBack = () => {
  const end = new Date(month + "-01T12:00:00");
  return Array.from({ length: 6 }, (_, i) => {
    let t = new Date(end);
    t.setMonth(t.getMonth() - 5 + i);
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
  });
};
function revenueChart() {
  const ms = monthsBack(),
    vals = ms.map((x) => metrics(d, x)),
    max = Math.max(1000000, ...vals.map((x) => Math.max(x.revenue, x.profit)));
  const W = 560,
    H = 180,
    base = 145;
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Doanh thu và lợi nhuận sáu tháng">${[
    0, 1, 2, 3,
  ]
    .map((i) => {
      let y = base - i * 43;
      return `<line x1="43" y1="${y}" x2="552" y2="${y}" stroke="#edf1f7" stroke-dasharray="3 4"/><text x="0" y="${y + 3}">${num((max * i) / 3 / 1e6)}tr</text>`;
    })
    .join("")}${vals
    .map((v, i) => {
      let x = 62 + i * 83;
      return `<rect x="${x}" y="${base - (Math.max(0, v.revenue) / max) * 129}" width="20" height="${(Math.max(0, v.revenue) / max) * 129}" rx="4" fill="#4167ed"><title>${ms[i]}: doanh thu ${money(v.revenue)}</title></rect><rect x="${x + 25}" y="${base - (Math.max(0, v.profit) / max) * 129}" width="20" height="${(Math.max(0, v.profit) / max) * 129}" rx="4" fill="#a6bcff"><title>Lợi nhuận ${money(v.profit)}${v.profit < 0 ? " (âm — hiển thị 0 trên biểu đồ)" : ""}</title></rect><text x="${x + 21}" y="170" text-anchor="middle">Th.${ms[i].slice(5)}</text>`;
    })
    .join("")}</svg></div>`;
}
const colors = [
  "#4167ed",
  "#8aa7ff",
  "#f7b560",
  "#50bfa1",
  "#ae8ae3",
  "#90c5d8",
  "#e4aaae",
  "#c4d075",
];
function channelChart() {
  const a = m(),
    totals = channels
      .map((c) => ({
        name: c,
        value: sum(
          a.monthly.filter((o) => o.channel === c),
          "revenue",
        ),
      }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
  const total = sum(totals, "value");
  let offset = 0;
  const stops = totals
    .map((x, i) => {
      let start = offset;
      offset += (x.value / (total || 1)) * 100;
      return `${colors[i]} ${start}% ${offset}%`;
    })
    .join(",");
  return `<div class="donut-wrap"><div class="donut" style="background:${total ? `conic-gradient(${stops})` : "#edf1f7"}"><div class="donut-label"><b>${a.monthly.length}</b>đơn thanh toán</div></div><div class="channel-legend">${
    totals
      .slice(0, 5)
      .map(
        (x, i) =>
          `<div><span class="dot" style="background:${colors[i]}"></span>${esc(x.name)}<b>${num((x.value / total) * 100)}%</b></div>`,
      )
      .join("") || "Chưa có doanh thu"
  }</div></div>`;
}
function dashboard() {
  const a = m(),
    p = metrics(d, monthsBack()[4]);
  const growth = p.revenue ? (a.revenue / p.revenue - 1) * 100 : null;
  const phase = d.settings.phase;
  const top = productRanking(a.monthly);
  return (
    header(
      "Mỗi ngày một bước tiến.",
      "Toàn cảnh 3D Lab của bạn — từ ý tưởng đầu tiên đến kinh doanh bền vững.",
      btn(
        icon("file") + " Báo cáo tháng",
        "navigate",
        'data-route="report"',
        "secondary",
      ) + btn(icon("plus") + " Tạo lệnh in", "add", 'data-table="jobs"'),
    ) +
    `<div class="notice"><span>${icon("lab")} <b>${d.demo ? "Bạn đang khám phá với dữ liệu mẫu." : "Learn → Test → Validate → Sell → Scale."}</b> ${d.demo ? "Mọi con số đều có thể chỉnh sửa. Sẵn sàng bắt đầu dự án của riêng bạn?" : "Kiểm chứng nhu cầu trước khi đầu tư mở rộng."}</span><a href="#settings">${d.demo ? "Quản lý dữ liệu mẫu" : "Sao lưu dữ liệu"} ${icon("arrow")}</a></div><div class="grid kpis">${kpi("Vốn đầu tư ban đầu", money(d.settings.initial), '<span class="pill gray">Kế hoạch khởi động</span>', "wallet")}${kpi("Vốn đã giải ngân", money(a.invested), `${num((a.invested / d.settings.initial) * 100)}% vốn đầu tư · <a href="#finance" class="inline-link">Chi tiết ↗</a>`, "layers")}${kpi("Vốn chưa giải ngân", money(a.unspent), "Vốn đầu tư − vốn đã giải ngân", "wallet", "#35a887")}${kpi("Hoàn vốn", num(a.recovered) + "<small>%</small>", `${money(Math.max(0, a.cumulative))} lợi nhuận lũy kế`, "target", "#e5a052")}${kpi("Doanh thu tháng", money(a.revenue), growth === null ? "Chưa có tháng trước để so sánh" : `<span class="${growth >= 0 ? "up" : "down"}">${growth >= 0 ? "↗" : "↘"} ${num(Math.abs(growth))}%</span> so với tháng trước`, "chart")}${kpi("Lợi nhuận ròng tháng", money(a.profit), `<span class="up">${num(a.margin)}%</span> biên lợi nhuận gộp`, "chart", "#35a887")}${kpi("Đơn hàng đã thanh toán", num(a.monthly.length), `Giá trị TB: ${money(a.aov)}`, "cart", "#e5a052")}${kpi("Hiệu suất máy", num(a.utilization) + "<small>%</small>", `${num(a.hours)} / ${num(d.settings.capacityHours * Math.max(1, d.machines.length))} giờ khả dụng`, "clock")}</div><div class="grid dashboard-mid"><section class="card">${cardHead("Doanh thu & lợi nhuận", "Theo dõi tăng trưởng, kiểm chứng hiệu quả", `<div class="legend"><span><i class="dot"></i>Doanh thu</span><span><i class="dot" style="background:#a6bcff"></i>Lợi nhuận</span></div>`)}<div class="chart-stats"><div><small>DOANH THU LŨY KẾ</small><b>${money(sum(a.paid, "revenue") + sum(d.income, "amount"))}</b></div><div><small>LỢI NHUẬN LŨY KẾ</small><b style="color:#4268e5">${money(a.cumulative)}</b></div></div>${revenueChart()}</section><section class="card">${cardHead("Doanh thu theo kênh", "Mỗi kênh, một cơ hội tăng trưởng")}${channelChart()}<div class="card-bottom"><span>Thị trường số 0: trung tâm ngoại ngữ</span><a href="#orders">Xem đơn hàng ↗</a></div></section></div><div class="grid dashboard-lower"><section class="card">${cardHead("Nhịp vận hành", "", badge(a.jobs.some((j) => j.status === "Printing") ? "Đang in" : "Sẵn sàng", "green"))}<div class="machine-body"><div class="machine-line"><div class="machine-art">${icon("printer")}</div><div><b>${esc(d.machines[0]?.name || "Chưa thêm máy in")}</b><p class="muted">${d.jobs.filter((x) => x.status === "Queued").length} lệnh trong hàng đợi</p></div></div><div class="split muted" style="margin-bottom:9px"><span>Công suất sử dụng</span><b style="color:#4167ed">${num(a.utilization)}%</b></div>${progress(a.utilization)}<div class="small-metrics"><div><b>${num(a.hours)}<small> h</small></b><small>GIỜ MÁY THÁNG NÀY</small></div><div><b style="color:#35a887">${num(a.success)}%</b><small>IN THÀNH CÔNG</small></div><div><b>${num(a.grams / 1000)}<small> kg</small></b><small>FILAMENT TIÊU THỤ</small></div></div></div><div class="card-bottom"><span>${a.failed} lệnh lỗi · ${num(a.failure)}% tỷ lệ lỗi</span><a href="#machines">Quản lý máy ↗</a></div></section><section class="card">${cardHead("Từ ý tưởng đến sản phẩm", "Product Lab · Learn by making", `<a href="#lab" class="inline-link">Mở Lab ↗</a>`)}<div class="lab-bars">${[
      ["Ý tưởng", ["IDEA", "DESIGN"], "#a7b9f2"],
      ["Prototype", ["PROTOTYPE"], "#b39ae5"],
      [
        "Đang thử nghiệm",
        ["INTERNAL TEST", "COST TEST", "MARKET TEST"],
        "#f6b96d",
      ],
      ["Đã kiểm chứng", ["VALIDATED"], "#5dbda2"],
      ["Đang bán", ["SELLING"], "#4167ed"],
      ["Dừng phát triển", ["KILLED"], "#d9a3ad"],
    ]
      .map(([n, ss, c]) => {
        const count = d.products.filter((p) => ss.includes(p.status)).length;
        return `<div class="lab-row"><span>${n}</span>${progress((count / Math.max(1, d.products.length)) * 100, c)}<b>${count}</b></div>`;
      })
      .join(
        "",
      )}</div></section><section class="card">${cardHead("Điểm cần chú ý", "Quyết định tốt bắt đầu từ dữ liệu")}<div class="insight"><span class="insight-icon">${icon("layers")}</span><div><strong>${d.filaments.filter((f) => f.remaining < d.settings.filamentThreshold).length} cuộn filament sắp hết</strong><p>Kiểm tra tồn kho trước lệnh in mới.</p><a href="#filaments" class="inline-link">Kiểm tra filament →</a></div></div><div class="insight"><span class="insight-icon" style="background:#edf3ff;color:#557cec">${icon("bulb")}</span><div><strong>${top[0] ? esc(top[0].name) : "Chưa có sản phẩm bán chạy"}</strong><p>${top[0] ? `Đang dẫn đầu với ${money(top[0].revenue)} doanh thu.` : "Thử nghiệm nhỏ trước khi tăng sản lượng."}</p></div></div><div class="insight"><span class="insight-icon" style="background:#eef7f2;color:#4b9f7f">${icon("store")}</span><div><strong>Kiểm chứng trước khi mở rộng</strong><p>${machineDecision().ready ? "Có tín hiệu cân nhắc máy #2." : "Tiếp tục đo nhu cầu và công suất máy."}</p></div></div></section></div><section class="card roadmap"><div class="split"><div><h2>Hành trình đến Maker Hub Củ Chi</h2><p class="card-sub">Từng bước kiểm chứng. Chỉ mở rộng khi dữ liệu cho phép.</p></div><a href="#roadmap" class="inline-link">Xem lộ trình ${icon("arrow")}</a></div><div class="steps">${d.roadmap
      .map((phaseRecord, i) => {
        const x = phaseRecord.title;
        return `<a href="#roadmap" class="step ${i + 1 < phase ? "done" : i + 1 === phase ? "current" : ""}"><div class="step-circle">${i + 1 < phase ? "✓" : String(i + 1).padStart(2, "0")}</div>${esc(x)}<small>${esc(phaseRecord.months)}</small></a>`;
      })
      .join("")}</div></section>`
  );
}
function productRanking(rows) {
  return d.products
    .map((p) => {
      const os = rows.filter((o) => o.product === p.id);
      return {
        name: p.name,
        revenue: sum(os, "revenue"),
        profit: sum(os, (o) => o.revenue - o.cogs - o.fee - o.ad),
        quantity: sum(os, "quantity"),
      };
    })
    .filter((x) => x.quantity > 0)
    .sort((a, b) => b.revenue - a.revenue);
}
const summary = (items) =>
  `<div class="summary-strip">${items.map(([l, v]) => `<div class="card"><span class="muted">${l}</span><b>${v}</b></div>`).join("")}</div>`;
const rowActions = (t, x) =>
  `<div class="row-actions"><button class="icon-btn" data-action="edit" data-table="${t}" data-id="${esc(x.id)}" aria-label="Sửa ${esc(x.name || x.code || "bản ghi")}">${icon("edit")}</button><button class="icon-btn" data-action="delete" data-table="${t}" data-id="${esc(x.id)}" aria-label="Xóa ${esc(x.name || x.code || "bản ghi")}">${icon("trash")}</button></div>`;
function toolbar(t, statusOptions = []) {
  return `<div class="toolbar"><div style="display:flex;gap:10px;flex-wrap:wrap"><div class="search-wrap">${icon("search")}<input id="table-search" value="${esc(query)}" placeholder="Tìm kiếm ${schemas[t].title}…" aria-label="Tìm kiếm ${schemas[t].title}"></div>${statusOptions.length ? `<select id="status-filter" class="filter-select" aria-label="Lọc trạng thái"><option value="">Tất cả trạng thái</option>${statusOptions.map((s) => `<option ${s === filter ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>` : ""}</div><span class="muted" style="align-self:center">${repo.all(t).length} bản ghi · lưu tự động</span></div>`;
}
function filtered(t) {
  return d[t].filter(
    (x) =>
      (!filter || x.status === filter) &&
      (!query ||
        Object.values(x).some((v) =>
          String(v)
            .toLocaleLowerCase("vi")
            .includes(query.toLocaleLowerCase("vi")),
        ) ||
        ["customer", "product", "machine"].some(
          (k) =>
            x[k] &&
            nameOf(
              k === "customer"
                ? "customers"
                : k === "product"
                  ? "products"
                  : "machines",
              x[k],
            )
              .toLocaleLowerCase("vi")
              .includes(query.toLocaleLowerCase("vi")),
        )),
  );
}
const columns = {
  products: [
    [
      "Tên sản phẩm",
      (x) =>
        `<strong>${esc(x.name)}</strong><div class="card-sub">${esc(x.category)} · v${esc(x.version)}</div>`,
    ],
    ["Trạng thái", (x) => badge(x.status)],
    ["In / g", (x) => `${num(x.hours)}h / ${num(x.weight)}g`],
    ["Giá vốn", (x) => money(productCost(x, d).cogs)],
    ["Giá bán", (x) => money(x.price)],
    [
      "Biên gộp",
      (x) =>
        badge(
          num(productCost(x, d).margin) + "%",
          productCost(x, d).margin > 50 ? "green" : "orange",
        ),
    ],
    [
      "Điểm / 100",
      (x) =>
        `<span class="score">${productScore(x)}</span> <span class="muted">${productScore(x) >= 80 ? "SCALE" : productScore(x) >= 60 ? "KEEP TESTING" : productScore(x) >= 40 ? "IMPROVE" : "KILL"}</span>`,
    ],
  ],
  orders: [
    [
      "Mã đơn / Ngày",
      (x) =>
        `<strong>${esc(x.code)}</strong><div class="card-sub">${esc(x.date)}</div>`,
    ],
    ["Khách hàng", (x) => esc(nameOf("customers", x.customer))],
    [
      "Sản phẩm",
      (x) =>
        `${esc(nameOf("products", x.product))}<div class="card-sub">${num(x.quantity)} sản phẩm · ${esc(x.channel)}</div>`,
    ],
    ["Doanh thu", (x) => money(x.revenue)],
    ["Lợi nhuận", (x) => money(x.revenue - x.cogs - x.fee - x.ad)],
    ["Trạng thái", (x) => badge(x.status)],
  ],
  customers: [
    [
      "Khách hàng",
      (x) =>
        `<strong>${esc(x.name)}</strong><div class="card-sub">${esc(x.phone || x.email || "Chưa có liên hệ")}</div>`,
    ],
    ["Phân khúc", (x) => badge(x.segment)],
    [
      "Số đơn trả tiền",
      (x) =>
        d.orders.filter(
          (o) => o.customer === x.id && o.status === "Đã thanh toán",
        ).length,
    ],
    [
      "Doanh thu",
      (x) =>
        money(
          sum(
            d.orders.filter(
              (o) => o.customer === x.id && o.status === "Đã thanh toán",
            ),
            "revenue",
          ),
        ),
    ],
    [
      "Khách quay lại",
      (x) =>
        badge(
          d.orders.filter(
            (o) => o.customer === x.id && o.status === "Đã thanh toán",
          ).length > 1
            ? "Có"
            : "Chưa",
        ),
    ],
  ],
  filaments: [
    [
      "Filament",
      (x) =>
        `<strong>${esc(x.brand)}</strong><div class="card-sub">${esc(x.material)} · ${esc(x.color)}</div>`,
    ],
    [
      "Tồn kho",
      (x) =>
        `${num(x.remaining)} / ${num(x.spool)} g<div style="margin-top:8px;min-width:100px">${progress((x.remaining / (x.spool || 1)) * 100, x.remaining < d.settings.filamentThreshold ? "#f3b361" : "")}</div>`,
    ],
    ["Giá cuộn", (x) => money(x.cost)],
    ["Chi phí / g", (x) => money(x.spool ? x.cost / x.spool : 0)],
    ["Nhà cung cấp", (x) => esc(x.supplier)],
    [
      "Cảnh báo",
      (x) =>
        badge(
          x.remaining < d.settings.filamentThreshold
            ? "LOW FILAMENT"
            : "Đủ vật liệu",
          x.remaining < d.settings.filamentThreshold ? "orange" : "green",
        ),
    ],
  ],
  inventory: [
    [
      "Vật tư",
      (x) =>
        `<strong>${esc(x.name)}</strong><div class="card-sub">${esc(x.type)}</div>`,
    ],
    ["Tồn kho", (x) => `${num(x.quantity)} ${esc(x.unit)}`],
    ["Giá vốn", (x) => money(x.cost)],
    ["Giá bán", (x) => money(x.price)],
    ["Giá trị kho", (x) => money(x.quantity * x.cost)],
    [
      "Tình trạng",
      (x) =>
        badge(
          x.quantity < x.min ? "Cần bổ sung" : "Đủ tồn",
          x.quantity < x.min ? "orange" : "green",
        ),
    ],
  ],
  ideas: [
    [
      "Ý tưởng",
      (x) =>
        `<strong>${esc(x.name)}</strong><div class="card-sub">${esc(x.category)} · ${esc(x.source)}</div>`,
    ],
    ["Vấn đề", (x) => `<div class="details">${esc(x.problem)}</div>`],
    ["Khách mục tiêu", (x) => esc(x.target)],
    ["Giá dự kiến", (x) => money(x.price)],
    ["Cơ hội / 100", (x) => `<b class="score">${opportunity(x)}</b>`],
    ["Trạng thái", (x) => badge(x.status)],
  ],
  workshops: [
    [
      "Workshop",
      (x) =>
        `<strong>${esc(x.name)}</strong><div class="card-sub">${esc(x.topic)}</div>`,
    ],
    [
      "Ngày / Người hướng dẫn",
      (x) => `${esc(x.date)}<div class="card-sub">${esc(x.instructor)}</div>`,
    ],
    [
      "Đăng ký",
      (x) =>
        `${num(x.registered)} / ${num(x.capacity)}${progress((x.registered / (x.capacity || 1)) * 100)}`,
    ],
    ["Giá vé", (x) => money(x.price)],
    ["Doanh thu dự kiến", (x) => money(x.price * x.registered)],
    ["Trạng thái", (x) => badge(x.status)],
  ],
  expenses: [
    ["Nội dung", (x) => `<strong>${esc(x.name)}</strong>`],
    ["Danh mục", (x) => badge(x.category)],
    ["Ngày", (x) => esc(x.date)],
    ["Số tiền", (x) => money(x.amount)],
  ],
  income: [
    ["Nội dung", (x) => `<strong>${esc(x.name)}</strong>`],
    ["Nguồn thu", (x) => badge(x.category)],
    ["Ngày", (x) => esc(x.date)],
    ["Số tiền", (x) => money(x.amount)],
  ],
  budget: [
    ["Hạng mục", (x) => `<strong>${esc(x.name)}</strong>`],
    ["Ngân sách", (x) => money(x.budget)],
    ["Thực tế", (x) => money(x.actual)],
    [
      "Chênh lệch / còn lại",
      (x) =>
        `<span class="${x.budget >= x.actual ? "up" : "down"}">${money(x.budget - x.actual)}</span>`,
    ],
  ],
  maintenance: [
    ["Máy", (x) => esc(nameOf("machines", x.machine))],
    ["Ngày", (x) => esc(x.date)],
    ["Nội dung", (x) => `<div class="details">${esc(x.task)}</div>`],
    ["Chi phí tham chiếu", (x) => money(x.cost)],
    ["Bảo trì tiếp", (x) => esc(x.next || "—")],
  ],
};
function table(t, rows = filtered(t), customCols = null) {
  const cols = customCols || columns[t];
  return `<div class="card table-wrap"><table><thead><tr>${cols.map(([l]) => `<th>${l}</th>`).join("")}<th>Thao tác</th></tr></thead><tbody>${rows.map((x) => `<tr>${cols.map(([, fn]) => `<td>${fn(x)}</td>`).join("")}<td>${rowActions(t, x)}</td></tr>`).join("") || `<tr><td colspan="${cols.length + 1}"><div class="empty">Không có bản ghi phù hợp. Thêm mới để bắt đầu.</div></td></tr>`}</tbody></table></div>`;
}
function listPage(t, desc, statusOptions = [], stats = []) {
  return (
    header(
      schemas[t].name,
      desc,
      btn(
        icon("plus") + " Thêm " + schemas[t].title,
        "add",
        `data-table="${t}"`,
      ),
    ) +
    (stats.length ? summary(stats) : "") +
    toolbar(t, statusOptions) +
    table(t)
  );
}
function lab() {
  const groups = [
    ["Ý tưởng & thiết kế", ["IDEA", "DESIGN"], "#8aa3eb"],
    ["Prototype", ["PROTOTYPE"], "#b394df"],
    ["Thử nghiệm", ["INTERNAL TEST", "COST TEST", "MARKET TEST"], "#efaf58"],
    ["Kiểm chứng & bán", ["VALIDATED", "SELLING"], "#4bb193"],
  ];
  return (
    header(
      "Product Lab",
      `${num(ensurePlan(d).studentCount)}+ học viên là thị trường thử nghiệm số 0. Kiểm chứng trước, mở rộng sau.`,
      btn(icon("plus") + " Ý tưởng sản phẩm", "add", 'data-table="products"'),
    ) +
    `<div class="tabs"><button class="tab ${view === "board" ? "active" : ""}" data-action="labview" data-view="board">Pipeline</button><button class="tab ${view === "table" ? "active" : ""}" data-action="labview" data-view="table">Tất cả sản phẩm</button><button class="tab ${view === "calculator" ? "active" : ""}" data-action="labview" data-view="calculator">Tính giá SKU</button></div>` +
    (view === "calculator"
      ? calculator()
      : toolbar("products", stages) +
        (view === "table"
          ? table("products")
          : `<div class="kanban">${groups
              .map(([name, ss, color]) => {
                const ps = filtered("products").filter((p) =>
                  ss.includes(p.status),
                );
                return `<section class="kanban-col"><div class="kanban-heading"><b><span class="dot" style="background:${color}"></span>${name}</b><span class="pill gray">${ps.length}</span></div>${ps.map((p) => `<article class="product-card" data-action="edit" data-table="products" data-id="${esc(p.id)}" tabindex="0" role="button" aria-label="Sửa ${esc(p.name)}"><div class="product-thumb">${p.image && /^https?:\/\//.test(p.image) ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:7px" loading="lazy">` : icon(p.category === "Education" ? "lab" : p.category === "Personalized" ? "target" : "box")}</div><span class="eyebrow" style="font-size:8px">${esc(p.category)}</span><h3>${esc(p.name)}</h3>${badge(p.status)}<div class="product-meta"><span>${num(p.weight)}g · ${num(p.hours)}h</span><b>${money(p.price)}</b></div><div class="product-meta"><span>Product score</span><b style="color:${color}">${productScore(p)} / 100</b></div>${progress(productScore(p), color)}</article>`).join("") || '<div class="empty" style="padding:20px 5px">Chưa có sản phẩm</div>'}</section>`;
              })
              .join(
                "",
              )}</div><p class="muted" style="margin-top:14px">Nhấn sản phẩm để xem đầy đủ hồ sơ và cập nhật từng bước pipeline. Sản phẩm KILLED nằm trong chế độ “Tất cả sản phẩm”.</p>`))
  );
}
const calcLabels = {
  filamentPrice: "Filament (đ / kg)",
  weight: "Khối lượng (g)",
  hours: "Thời gian in (giờ)",
  electricity: "Điện năng (đ / giờ)",
  depreciation: "Khấu hao máy (đ / giờ)",
  failure: "Tỷ lệ lỗi (%)",
  labor: "Công lao động (đ)",
  packaging: "Bao bì (đ)",
  platform: "Phí sàn (%)",
  ad: "Quảng cáo / đơn (đ)",
  shipping: "Trợ giá vận chuyển (đ)",
  price: "Giá bán (đ)",
  fixed: "Đầu tư cần hoàn vốn (đ)",
};
function calculator() {
  return `<div class="grid two-col"><section class="card pad"><h2>SKU Economics Calculator</h2><p class="card-sub">Tính theo một sản phẩm. Chi phí lỗi = chi phí in / (1 − tỷ lệ lỗi).</p><div class="calc-form">${Object.entries(
    calcLabels,
  )
    .map(
      ([k, l]) =>
        `<div><label for="calc-${k}">${l}</label><input id="calc-${k}" data-calc="${k}" type="number" min="0" ${k === "failure" ? 'max="99"' : k === "platform" ? 'max="100"' : ""} step="any" value="${d.calc[k]}"></div>`,
    )
    .join(
      "",
    )}</div></section><section class="card pad"><h2>Mỗi sản phẩm thực sự mang lại bao nhiêu?</h2><p class="card-sub">Thử nhanh các mức giá bán</p><div class="price-buttons">${[49000, 69000, 79000, 89000, 99000, 149000, 299000].map((p) => btn(p / 1000 + "K", "price", `data-value="${p}"`, d.calc.price === p ? "small" : "secondary small")).join("")}</div><div id="calc-results">${calcResults()}</div><div class="warn" style="margin-top:20px">Contribution profit đã trừ phí sàn, quảng cáo và trợ vận chuyển. Hoàn vốn giả định lợi nhuận này không đổi; chưa bao gồm chi phí cố định tương lai.</div><h3 style="margin-top:23px">So sánh giá bán</h3><div id="price-comparison">${priceComparison()}</div></section></div>`;
}
function calcResults() {
  const x = economics(d.calc);
  return (
    Object.entries({
      material: "Chi phí vật liệu",
      machine: "Điện + khấu hao máy",
      production: "Chi phí in (gồm lỗi)",
      cogs: "Tổng giá vốn (COGS)",
      fee: "Phí sàn",
      gross: "Lợi nhuận gộp",
      contribution: "Contribution profit",
    })
      .map(
        ([k, l]) =>
          `<div class="result-row ${k === "contribution" ? "highlight" : ""}"><span>${l}</span><b>${money(x[k])}</b></div>`,
      )
      .join("") +
    `<div class="result-row"><span>Biên lợi nhuận gộp</span><b>${num(x.margin)}%</b></div><div class="result-row"><span>Số lượng hòa vốn</span><b>${x.breakEven === null ? "Không thể hòa vốn" : num(x.breakEven) + " sản phẩm"}</b></div>`
  );
}
function priceComparison() {
  return `<table><thead><tr><th>Giá bán</th><th>Lãi đóng góp</th><th>Biên gộp</th></tr></thead><tbody>${[
    49000, 69000, 79000, 89000, 99000, 149000, 299000,
  ]
    .map((price) => {
      const x = economics({ ...d.calc, price });
      return `<tr><td>${money(price)}</td><td class="${x.contribution > 0 ? "up" : "down"}">${money(x.contribution)}</td><td>${num(x.margin)}%</td></tr>`;
    })
    .join("")}</tbody></table>`;
}
function jobs() {
  const a = m();
  const cols = [
    [
      "Lệnh in / Sản phẩm",
      (x) =>
        `<strong>${esc(x.code)}</strong><div class="card-sub">${esc(nameOf("products", x.product))} × ${num(x.quantity)}</div>`,
    ],
    [
      "Máy / Vật liệu",
      (x) =>
        `${esc(nameOf("machines", x.machine))}<div class="card-sub">${esc(nameOf("filaments", x.filament))}</div>`,
    ],
    ["Khách hàng", (x) => esc(nameOf("customers", x.customer))],
    [
      "Khối lượng / Thời gian",
      (x) =>
        `${num(x.grams)}g · ${num(x.actual || x.estimated)}h<div class="card-sub">Dự kiến ${num(x.estimated)}h</div>`,
    ],
    ["Trạng thái", (x) => badge(x.status)],
    [
      "Điều khiển",
      (x) =>
        x.status === "Queued"
          ? btn(
              "▶ START",
              "job",
              'data-id="' + esc(x.id) + '" data-next="Printing"',
              "small",
            ) +
            " " +
            btn(
              "HỦY",
              "cancel-job",
              `data-id="${esc(x.id)}"`,
              "small secondary",
            )
          : x.status === "Printing"
            ? btn(
                "✓ COMPLETE",
                "job",
                'data-id="' + esc(x.id) + '" data-next="Completed"',
                "small",
              ) +
              " " +
              btn(
                "FAILED",
                "job",
                'data-id="' + esc(x.id) + '" data-next="Failed"',
                "small danger",
              )
            : ["Failed", "Completed"].includes(x.status)
              ? btn(
                  "↻ REPRINT",
                  "reprint",
                  `data-id="${esc(x.id)}"`,
                  "small secondary",
                )
              : "—",
    ],
  ];
  return (
    header(
      "Hàng đợi in",
      "Điều phối công việc và ghi nhận vật liệu tiêu thụ thực tế.",
      btn(icon("plus") + " Tạo lệnh in", "add", 'data-table="jobs"'),
    ) +
    summary([
      ["Đang chờ", d.jobs.filter((x) => x.status === "Queued").length],
      ["Đang in", d.jobs.filter((x) => x.status === "Printing").length],
      ["Thành công tháng này", num(a.success) + "%"],
    ]) +
    `<div class="notice"><span>${icon("layers")} Filament được trừ khi COMPLETE hoặc FAILED. REPRINT tạo lệnh mới. Chi phí lệnh in là tham chiếu; doanh thu chỉ ghi nhận từ đơn đã thanh toán.</span></div>` +
    toolbar("jobs", [
      "Queued",
      "Printing",
      "Completed",
      "Failed",
      "Cancelled",
    ]) +
    table("jobs", filtered("jobs"), cols)
  );
}
function machineDecision() {
  const recent = monthsBack()
    .slice(-ensurePlan(d).machineMonths)
    .map((x) => metrics(d, x).utilization);
  const sustained = recent.every((x) => x > ensurePlan(d).machineUtilization);
  const backlog = d.jobs.filter((j) => j.status === "Queued").length;
  const profitable = d.products.some(
    (p) => p.status === "SELLING" && productCost(p, d).gross > 0,
  );
  return {
    ready: sustained && backlog >= ensurePlan(d).machineBacklog && profitable,
    recent,
    sustained,
    backlog,
    profitable,
  };
}
function machines() {
  const a = m(),
    decision = machineDecision();
  return (
    header(
      "Máy in & năng lực sản xuất",
      "Tăng hiệu quả trước khi tăng số lượng máy.",
      btn(
        icon("plus") + " Bảo trì",
        "add",
        'data-table="maintenance"',
        "secondary",
      ) + btn(icon("plus") + " Thêm máy", "add", 'data-table="machines"'),
    ) +
    `<div class="decision ${decision.ready ? "go" : ""}" style="margin-bottom:20px"><h3>${decision.ready ? "CONSIDER BUYING PRINTER #2" : "Tiếp tục tối ưu máy hiện tại"}</h3><p>Chỉ cân nhắc thêm máy khi công suất >${num(ensurePlan(d).machineUtilization)}% trong ${ensurePlan(d).machineMonths} tháng gần nhất + ít nhất ${ensurePlan(d).machineBacklog} lệnh chờ + SKU đang bán có lợi nhuận. ${decision.ready ? "Đã đạt ba điều kiện." : "Chưa đủ dữ liệu đạt cả ba điều kiện."}</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">${badge(`${ensurePlan(d).machineMonths} tháng >${num(ensurePlan(d).machineUtilization)}%: ` + (decision.sustained ? "Đạt" : "Chưa"), "gray")}${badge("Backlog: " + decision.backlog, "gray")}${badge("SKU có lãi: " + (decision.profitable ? "Có" : "Chưa"), "gray")}</div></div><div class="grid two-col" style="margin-bottom:24px">${
      d.machines
        .map((machine) => {
          const js = a.jobs.filter((j) => j.machine === machine.id),
            fin = js.filter((j) => ["Completed", "Failed"].includes(j.status)),
            hours = sum(fin, "actual"),
            total =
              machine.baselineHours +
              sum(
                d.jobs.filter(
                  (j) =>
                    j.machine === machine.id &&
                    ["Completed", "Failed"].includes(j.status),
                ),
                "actual",
              ),
            failed = fin.filter((j) => j.status === "Failed").length;
          return `<section class="card"><div class="card-head"><div><h2>${esc(machine.name)}</h2><p class="card-sub">${esc(machine.model)} · Mua ${esc(machine.date)}</p></div>${rowActions("machines", machine)}</div><div class="pad"><div class="machine-line"><div class="machine-art">${icon("printer")}</div><div><h3>${money(machine.price)}</h3><p class="muted">Giá trị còn lại dự kiến: ${money(machine.remainingValue)}</p></div></div><div class="split muted" style="margin-bottom:10px"><span>Utilization tháng ${month.slice(5)}</span><b>${num((hours / d.settings.capacityHours) * 100)}%</b></div>${progress((hours / d.settings.capacityHours) * 100)}<div class="small-metrics"><div><b>${num(total)}h</b><small>TỔNG GIỜ MÁY</small></div><div><b>${num(hours)}h</b><small>GIỜ THÁNG NÀY</small></div><div><b>${fin.length ? num((failed / fin.length) * 100) : 0}%</b><small>TỶ LỆ LỖI</small></div></div><div class="result-row"><span>Thành công / thất bại</span><b>${fin.length - failed} / ${failed}</b></div><div class="result-row"><span>Nozzle / Plate</span><b>${esc(machine.nozzle)} / ${esc(machine.plate)}</b></div><div class="result-row"><span>Điện + khấu hao / giờ máy</span><b>${money(Number(machine.electricity ?? 300) + Number(machine.depreciation ?? 1800))}</b></div><p class="muted" style="margin-top:13px">Phụ kiện: ${esc(machine.accessories)}</p></div></section>`;
        })
        .join("") ||
      '<div class="empty card">Chưa có máy in. Thêm máy để bắt đầu.</div>'
    }</div><div class="split" style="margin-bottom:15px"><h2>Nhật ký bảo trì</h2><span class="muted">Nhập chi phí thực trả trong Tài chính để ghi nhận dòng tiền.</span></div>${table("maintenance", d.maintenance)}`
  );
}
function finance() {
  const a = m();
  return (
    header(
      "Tài chính & vốn đầu tư",
      "Dòng tiền rõ ràng. Quyết định đầu tư có cơ sở.",
      btn(
        icon("file") + " Báo cáo tháng",
        "navigate",
        'data-route="report"',
        "secondary",
      ) + btn(icon("plus") + " Ghi chi phí", "add", 'data-table="expenses"'),
    ) +
    `<div class="tabs">${[
      ["overview", "Tổng quan"],
      ["budget", "Vốn đầu tư"],
      ["expenses", "Chi phí"],
      ["income", "Thu nhập khác"],
      ["calculator", "Tính giá SKU"],
    ]
      .map(
        ([k, v]) =>
          `<button class="tab ${financeTab === k ? "active" : ""}" data-action="finance-tab" data-tab="${k}">${v}</button>`,
      )
      .join("")}</div>` +
    (financeTab === "calculator"
      ? calculator()
      : financeTab === "budget"
        ? investment()
        : ["expenses", "income"].includes(financeTab)
          ? toolbar(financeTab) +
            table(
              financeTab,
              filtered(financeTab).filter((x) => x.date.startsWith(month)),
            ) +
            `<div style="margin-top:15px">${btn(icon("plus") + " Thêm " + schemas[financeTab].title, "add", `data-table="${financeTab}"`)}</div>`
          : `<div class="grid kpis">${kpi("Doanh thu", money(a.revenue), "Đơn trả tiền + thu nhập khác", "chart")}${kpi("Giá vốn đơn hàng", money(a.cogs), "Snapshot tại thời điểm bán", "box")}${kpi("Lợi nhuận gộp", money(a.gross), num(a.margin) + "% biên gộp", "chart")}${kpi("Lợi nhuận ròng", money(a.profit), "Trừ giá vốn, phí bán và vận hành", "wallet")}</div><div class="grid two-col" style="margin-bottom:20px"><section class="card">${cardHead("Tăng trưởng theo tháng", "6 tháng gần nhất")}${revenueChart()}<div class="card-bottom">Lợi nhuận âm được ghi trong tooltip và bảng tổng hợp.</div></section><section class="card pad"><h2>Theo dõi hoàn vốn</h2><div class="kpi-value" style="margin:25px 0 15px">${num(a.recovered)}<small>%</small></div>${progress(a.recovered)}<div class="result-row"><span>Đầu tư ban đầu</span><b>${money(d.settings.initial)}</b></div><div class="result-row"><span>Lợi nhuận lũy kế dùng để hoàn vốn</span><b>${money(Math.max(0, a.cumulative))}</b></div><div class="result-row"><span>Còn cần thu hồi</span><b>${money(Math.max(0, d.settings.initial - a.cumulative))}</b></div><div class="result-row"><span>Dự kiến hòa vốn</span><b>${breakEvenDate()}</b></div><p class="card-sub" style="line-height:1.8;margin-top:10px">Ước tính theo lợi nhuận ròng bình quân 3 tháng kết thúc ở tháng đang chọn. ROI ${num(a.roi)}%. Không phải cam kết doanh thu.</p></section></div><div class="grid two-col"><section class="card pad"><h2>Báo cáo kết quả tháng ${month.slice(5)}</h2>${[
              ["Doanh thu", a.revenue],
              ["Giá vốn", -a.cogs],
              ["Lợi nhuận gộp", a.gross],
              ["Phí sàn + quảng cáo theo đơn", -a.selling],
              ["Chi phí vận hành", -a.operating],
              ["Lợi nhuận ròng / dòng tiền vận hành", a.profit],
              ["Vốn + lợi nhuận giữ lại ước tính", a.remaining],
            ]
              .map(
                ([l, v]) =>
                  `<div class="result-row"><span>${l}</span><b>${money(v)}</b></div>`,
              )
              .join(
                "",
              )}<p class="card-sub" style="line-height:1.8;margin-top:13px">MVP theo cơ sở tiền mặt: chỉ đơn “Đã thanh toán” được ghi nhận. Giá vốn là chi phí phân bổ theo đơn; chưa quản lý công nợ, thuế hoặc khấu hao kế toán.</p></section><section class="card pad"><h2>Chi phí theo danh mục</h2>${expenseBreakdown()}<p class="card-sub" style="line-height:1.8;margin-top:15px">Tránh ghi lại giá vốn / phí đã có trong đơn hàng. Giải ngân đầu tư không ghi lặp vào chi phí vận hành.</p></section></div><div class="card table-wrap" style="margin-top:20px"><table><thead><tr><th>Tháng</th><th>Doanh thu</th><th>Giá vốn</th><th>Chi phí bán + vận hành</th><th>Lợi nhuận</th></tr></thead><tbody>${monthsBack()
              .map((x) => {
                const z = metrics(d, x);
                return `<tr><td>${x}</td><td>${money(z.revenue)}</td><td>${money(z.cogs)}</td><td>${money(z.operating + z.selling)}</td><td>${money(z.profit)}</td></tr>`;
              })
              .join("")}</tbody></table></div>`)
  );
}
function breakEvenDate() {
  const a = m(),
    avg =
      sum(
        monthsBack()
          .slice(-3)
          .map((x) => metrics(d, x)),
        "profit",
      ) / 3;
  if (a.cumulative >= d.settings.initial) return "Đã hoàn vốn";
  if (avg <= 0) return "Chưa đủ cơ sở";
  const t = new Date(month + "-01T12:00:00");
  t.setMonth(
    t.getMonth() + Math.ceil((d.settings.initial - a.cumulative) / avg),
  );
  return `${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
}
function expenseBreakdown() {
  const rows = d.expenses.filter((e) => e.date.startsWith(month));
  const cats = [...new Set(rows.map((x) => x.category))];
  return (
    cats
      .map((c) => {
        const total = sum(
          rows.filter((x) => x.category === c),
          "amount",
        );
        return `<div class="result-row"><span>${esc(c)}</span><b>${money(total)}</b></div>`;
      })
      .join("") || '<div class="empty">Tháng này chưa có chi phí.</div>'
  );
}
function investment() {
  const budget = sum(d.budget, "budget"),
    actual = sum(d.budget, "actual");
  return (
    summary([
      ["Ngân sách phân bổ", money(budget)],
      ["Đã giải ngân", money(actual)],
      ["Chưa giải ngân", money(budget - actual)],
    ]) +
    `<div class="notice"><span>${icon("wallet")} Vốn khởi điểm: <b>${money(d.settings.initial)}</b>. ${budget !== d.settings.initial ? "Tổng phân bổ khác vốn ban đầu — hãy điều chỉnh kế hoạch." : "Phân bổ đã khớp với vốn khởi điểm."}</span></div><div class="grid two-col" style="margin-bottom:20px"><section class="card pad"><h2>Phân bổ ngân sách</h2><div style="margin-top:15px">${d.budget.map((x, i) => `<div class="result-row" style="gap:15px"><span><i class="dot" style="background:${colors[i % 8]}"></i>${esc(x.name)}</span><b>${num((x.budget / (budget || 1)) * 100)}%</b></div><div>${progress((x.budget / (budget || 1)) * 100, colors[i % 8])}</div>`).join("")}</div></section><section class="card pad"><h2>Đầu tư có kỷ luật</h2><p style="font-size:12px;margin:18px 0">Bắt đầu từ lab nội bộ. Giữ phần dự phòng để thử nghiệm, xử lý lỗi và học từ nhu cầu thực tế.</p><div class="result-row"><span>Vốn ban đầu chưa giải ngân</span><b>${money(d.settings.initial - actual)}</b></div><div class="result-row"><span>Chênh lệch ngân sách – thực tế</span><b>${money(budget - actual)}</b></div><div class="warn" style="margin-top:20px">Giải ngân được cập nhật thủ công tại từng hạng mục. Thêm máy hay nhập filament không tự tạo khoản giải ngân để tránh ghi trùng.</div></section></div>${table("budget", d.budget)}<div style="margin-top:15px">${btn(icon("plus") + " Thêm hạng mục", "add", 'data-table="budget"')}</div>`
  );
}
function orders() {
  const a = m(),
    ranking = productRanking(a.monthly);
  return (
    listPage(
      "orders",
      "Một dòng đơn hàng cho một SKU. Đơn nhiều SKU có thể tách thành các dòng có mã hậu tố.",
      ["Đang xử lý", "Đã thanh toán", "Đã hủy"],
      [
        ["Doanh thu tháng", money(a.revenue)],
        ["Giá trị đơn trung bình", money(a.aov)],
        ["Khách quay lại", num(a.repeats.length)],
      ],
    ) +
    `<div class="grid two-col" style="margin-top:22px"><section class="card">${cardHead("Doanh thu theo kênh", "Tháng đang chọn")}${channelChart()}</section><section class="card pad"><h2>Hiệu quả từng kênh</h2>${channels
      .map((c) => {
        const rs = a.monthly.filter((x) => x.channel === c);
        return `<div class="result-row"><span>${c} · ${rs.length} đơn</span><b>${money(sum(rs, (x) => x.revenue - x.cogs - x.fee - x.ad))}</b></div>`;
      })
      .join(
        "",
      )}</section></div><div class="grid two-col" style="margin-top:20px"><section class="card">${cardHead("Top SKU", "Xếp theo doanh thu tháng")}<div class="top-products">${
      ranking
        .slice(0, 5)
        .map(
          (x, i) =>
            `<div class="top-product"><span class="rank">0${i + 1}</span><div><b>${esc(x.name)}</b><p class="muted">${x.quantity} sản phẩm</p></div><span class="amount">${money(x.revenue)}</span></div>`,
        )
        .join("") || '<div class="empty">Chưa có đơn trả tiền</div>'
    }</div></section><section class="card pad"><h2>SKU cần xem lại</h2><p class="card-sub">3 SKU có lợi nhuận thấp nhất trong các SKU đã bán</p>${
      [...ranking]
        .sort((a, b) => a.profit - b.profit)
        .slice(0, 3)
        .map(
          (x) =>
            `<div class="result-row"><span>${esc(x.name)}</span><b>${money(x.profit)}</b></div>`,
        )
        .join("") || '<div class="empty">Chưa đủ dữ liệu</div>'
    }</section></div>`
  );
}
function customers() {
  const a = m();
  return (
    listPage(
      "customers",
      "Hiểu người dùng thật. Biến phản hồi thành sản phẩm tốt hơn.",
      [],
      [
        ["Khách hàng", d.customers.length],
        ["Khách trả tiền tháng này", a.customers.length],
        [
          "Tỷ lệ quay lại tháng này",
          num(
            a.customers.length
              ? (a.repeats.length / a.customers.length) * 100
              : 0,
          ) + "%",
        ],
      ],
    ) +
    `<section class="card table-wrap" style="margin-top:22px"><table><thead><tr><th>Phân khúc</th><th>Khách hàng</th><th>Doanh thu tháng</th><th>Đơn TB</th><th>Tỷ lệ quay lại</th></tr></thead><tbody>${segments
      .map((s) => {
        const cs = d.customers.filter((c) => c.segment === s),
          ids = cs.map((c) => c.id),
          os = a.monthly.filter((o) => ids.includes(o.customer)),
          active = [...new Set(os.map((o) => o.customer))],
          repeat = active.filter(
            (id) => a.paid.filter((o) => o.customer === id).length > 1,
          );
        return `<tr><td>${s}</td><td>${cs.length}</td><td>${money(sum(os, "revenue"))}</td><td>${money(os.length ? sum(os, "revenue") / os.length : 0)}</td><td>${num(active.length ? (repeat.length / active.length) * 100 : 0)}%</td></tr>`;
      })
      .join("")}</tbody></table></section>`
  );
}
function storeConditions() {
  const a = m(),
    s = d.store;
  const external = a.monthly.filter((o) => o.channel !== "Internal Center"),
    externalRevenue = sum(external, "revenue");
  const localIds = d.customers
      .filter((c) => ["Khách Củ Chi", "Doanh nghiệp nhỏ"].includes(c.segment))
      .map((c) => c.id),
    localRepeat = localIds.filter(
      (id) =>
        a.paid.filter(
          (o) => o.customer === id && o.channel !== "Internal Center",
        ).length > 1,
    ).length;
  const custom = a.monthly.filter(
    (o) => o.channel === "Custom Printing",
  ).length;
  const profitable = productRanking(a.monthly).filter(
    (p) => p.profit > 0,
  ).length;
  const positive = monthsBack()
    .slice(-s.positiveMonths)
    .filter((x) => metrics(d, x).profit > 0).length;
  const reserves = Math.max(0, a.remaining) / (s.rent + s.other || 1);
  return [
    {
      label: "Doanh thu ngoài trung tâm / tháng",
      value: externalRevenue,
      target: s.externalRevenue,
      display: money(externalRevenue) + " / " + money(s.externalRevenue),
      ok: externalRevenue >= s.externalRevenue,
    },
    {
      label: "Khách local đã quay lại",
      display: `${localRepeat} / ${s.localRepeat} khách`,
      ok: localRepeat >= s.localRepeat,
    },
    {
      label: "Đơn custom printing / tháng",
      display: `${custom} / ${s.customOrders} đơn`,
      ok: custom >= s.customOrders,
    },
    {
      label: "SKU bán có lợi nhuận trong tháng",
      display: `${profitable} / ${s.steadySku} SKU`,
      ok: profitable >= s.steadySku,
    },
    {
      label: "Tháng có dòng tiền dương liên tiếp",
      display: `${positive} / ${s.positiveMonths} tháng`,
      ok: positive === s.positiveMonths,
    },
    {
      label: "Dự phòng chi phí cửa hàng",
      display: `${num(reserves)} / ${s.reserveMonths} tháng`,
      ok: reserves >= s.reserveMonths,
    },
  ];
}
function storePage() {
  const conditions = storeConditions(),
    ready = conditions.every((x) => x.ok);
  return (
    header(
      "3D Store Củ Chi",
      "Kế hoạch cho cửa hàng tương lai — mở khi thị trường đã chứng minh nhu cầu.",
      btn(
        icon("settings") + " Ngưỡng quyết định",
        "store-config",
        "",
        "secondary",
      ),
    ) +
    `<div class="decision ${ready ? "go" : ""}" style="margin-bottom:21px"><h2>${ready ? "GO · READY FOR STORE" : "NO-GO · CHƯA MỞ CỬA HÀNG"}</h2><p>${conditions.filter((x) => x.ok).length}/6 điều kiện đạt. ${ready ? "Có thể nghiên cứu địa điểm, chi phí và pháp lý cụ thể trước khi cam kết." : "Tiếp tục kiểm chứng nhu cầu local và tích lũy dòng tiền. Không thuê cửa hàng chỉ vì muốn mở rộng."}</p></div><div class="grid two-col"><section class="card pad"><h2>GO / NO-GO theo dữ liệu</h2>${conditions.map((c) => `<div class="check-row"><span class="pill ${c.ok ? "green" : "orange"}">${c.ok ? "✓" : "•"}</span><div style="flex:1">${c.label}<p>${c.display}</p></div>${badge(c.ok ? "ĐẠT" : "CHƯA", c.ok ? "green" : "orange")}</div>`).join("")}<p class="card-sub" style="line-height:1.8;margin-top:15px">Đánh giá theo tháng đang chọn. Đây là bộ ngưỡng nội bộ có thể điều chỉnh; không thay thế dự toán chi tiết và khảo sát mặt bằng.</p></section><section class="card pad"><h2>Checklist chuẩn bị cửa hàng</h2>${ensurePlan(
      d,
    )
      .storeChecklist.split("\n")
      .filter(Boolean)
      .map(
        (s, i) =>
          `<label class="check-row"><input type="checkbox" data-store-check="${i}" ${d.store.checks[i] ? "checked" : ""}>${esc(s)}</label>`,
      )
      .join(
        "",
      )}</section></div><section class="card pad" style="margin-top:21px"><h2>Nguồn doanh thu dự kiến</h2><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">${ensurePlan(
      d,
    )
      .storeStreams.split("\n")
      .filter(Boolean)
      .map((x) => badge(x, "gray"))
      .join("")}</div></section>`
  );
}
function operatingRoadmap() {
  return (
    header(
      "Lộ trình vận hành",
      "LEARN → TEST → VALIDATE → SELL → SCALE. Qua cổng kiểm chứng rồi mới sang bước tiếp theo.",
      `<button class="btn" data-plan-action="phase-add">Thêm giai đoạn</button>`,
    ) +
    `<div class="notice"><span>${icon("road")} Bắt đầu dự án: <b>${esc(d.settings.startMonth)}</b> · Giai đoạn hiện tại: <b>${d.settings.phase}</b>. Checklist phản ánh công việc; gate cần được xác nhận bằng bằng chứng thực tế.</span></div><div class="grid">${d.roadmap.map((p, i) => `<section class="card phase-card ${d.settings.phase === i + 1 ? "current" : ""}"><div class="split"><div><div class="eyebrow">PHASE ${i + 1} · ${esc(p.months)}</div><h3>${esc(p.title)}</h3></div>${d.settings.phase === i + 1 ? badge("ĐANG THỰC HIỆN", "orange") : badge(p.passed ? "ĐÃ QUA GATE" : "SẮP TỚI", p.passed ? "green" : "gray")}</div><div style="margin:16px 0">${progress((p.done.filter(Boolean).length / p.tasks.length) * 100)}</div><div class="grid two-col">${p.tasks.map((task, j) => `<label class="check-row"><input type="checkbox" data-road-phase="${i}" data-task="${j}" ${p.done[j] ? "checked" : ""}>${esc(task)}</label>`).join("")}</div><div class="split" style="margin-top:19px;flex-wrap:wrap"><label class="check-row" style="border:0;margin:0"><input type="checkbox" data-gate="${i}" ${p.passed ? "checked" : ""}><b>Gate: ${esc(p.gate)}</b></label>${btn("Đặt làm giai đoạn hiện tại", "set-phase", `data-value="${i + 1}"`, "secondary small")}<div class="row-actions"><button class="btn secondary small" data-plan-action="phase-edit" data-id="${i}">Sửa giai đoạn</button><button class="btn secondary small" data-plan-action="phase-delete" data-id="${i}">Xóa giai đoạn</button></div></div></section>`).join("")}</div>`
  );
}
function report() {
  const a = m(),
    ranking = productRanking(a.monthly),
    worst = [...ranking].sort((a, b) => a.profit - b.profit)[0],
    channel = channels
      .map((c) => ({
        name: c,
        value: sum(
          a.monthly.filter((o) => o.channel === c),
          "revenue",
        ),
      }))
      .sort((a, b) => b.value - a.value)[0],
    expense = [...d.expenses.filter((x) => x.date.startsWith(month))].sort(
      (a, b) => b.amount - a.amount,
    )[0],
    review = d.reviews[month] || {};
  const priorCustomers = new Set(
    a.paid.filter((o) => o.date.slice(0, 7) < month).map((o) => o.customer),
  );
  const fresh = a.customers.filter((id) => !priorCustomers.has(id));
  return (
    header(
      "Monthly Business Review",
      `Tháng ${month.slice(5)} / ${month.slice(0, 4)} · Nhìn lại điều đã học. Chọn đúng việc tiếp theo.`,
      btn(
        icon("download") + " Xuất báo cáo",
        "export-report",
        "",
        "secondary",
      ) + btn(icon("file") + " In / Lưu PDF", "print", "", "secondary"),
    ) +
    summary([
      ["Doanh thu", money(a.revenue)],
      ["Lợi nhuận ròng", money(a.profit)],
      ["Biên gộp", num(a.margin) + "%"],
    ]) +
    `<div class="grid two-col" style="margin-bottom:21px"><section class="card pad"><h2>Kinh doanh</h2>${[
      ["Sản phẩm tốt nhất", ranking[0]?.name || "Chưa có"],
      ["Sản phẩm lợi nhuận thấp nhất", worst?.name || "Chưa có"],
      ["Kênh doanh thu tốt nhất", channel?.value ? channel.name : "Chưa có"],
      [
        "Khoản chi lớn nhất",
        expense ? `${expense.name} · ${money(expense.amount)}` : "Chưa có",
      ],
      ["Đơn thanh toán", a.monthly.length],
    ]
      .map(
        ([l, v]) =>
          `<div class="result-row"><span>${l}</span><b>${esc(v)}</b></div>`,
      )
      .join(
        "",
      )}</section><section class="card pad"><h2>Vận hành & khách hàng</h2>${[
      ["Hiệu suất máy", num(a.utilization) + "%"],
      ["Tỷ lệ lỗi", num(a.failure) + "%"],
      ["Filament đã dùng", num(a.grams / 1000) + " kg"],
      ["Khách trả tiền lần đầu", fresh.length],
      ["Khách quay lại", a.repeats.length],
    ]
      .map(
        ([l, v]) =>
          `<div class="result-row"><span>${l}</span><b>${v}</b></div>`,
      )
      .join("")}</section></div><div class="report-grid">${[
      ["worked", "WHAT WORKED", "Điều gì hiệu quả?"],
      ["didnt", "WHAT DIDN’T", "Điều gì chưa hiệu quả?"],
      ["next", "WHAT TO DO NEXT MONTH", "Hành động cho tháng tới"],
    ]
      .map(
        ([k, t, ph]) =>
          `<section class="card pad"><div class="eyebrow">${t}</div><h2>${ph}</h2><textarea data-review="${k}" aria-label="${ph}" placeholder="Ghi nhận từ trải nghiệm thực tế…">${esc(review[k] || "")}</textarea><p class="card-sub">Tự động lưu theo tháng</p></section>`,
      )
      .join(
        "",
      )}</div><section class="card pad" style="margin-top:21px"><h2>KPI / GO–NO-GO</h2>${kpiSignals()}</section>`
  );
}
function kpiSignals() {
  const a = m(),
    s = d.settings,
    repeat = a.customers.length
      ? (a.repeats.length / a.customers.length) * 100
      : 0,
    success = d.products.length
      ? (d.products.filter((p) => ["VALIDATED", "SELLING"].includes(p.status))
          .length /
          d.products.length) *
        100
      : 0,
    stock =
      sum(d.inventory, (x) => x.cost * x.quantity) +
      sum(d.filaments, (x) => (x.spool ? (x.cost / x.spool) * x.remaining : 0)),
    turnover = stock ? a.cogs / stock : 0,
    runway = a.operating ? Math.max(0, a.remaining) / a.operating : 0;
  const values = {
    utilization: a.utilization,
    failure: a.failure,
    margin: a.margin,
    revenue: a.revenue,
    profit: a.profit,
    repeat,
    sku: success,
    turnover,
    runway,
  };
  const signals = ensurePlan(d).kpis.map((r) => [
    r.title,
    values[r.key] ?? 0,
    r.reverse ? r.green : r.yellow,
    r.reverse ? r.yellow : r.green,
    r.reverse,
    r.unit,
  ]);
  return (
    signals
      .map(([l, v, lo, hi, reverse, u]) => {
        const c = reverse
          ? v <= lo
            ? "green"
            : v <= hi
              ? "orange"
              : "red"
          : v >= hi
            ? "green"
            : v >= lo
              ? "orange"
              : "red";
        return `<div class="result-row"><span>${l}</span><span>${badge((u === "đ" ? money(v) : num(v) + " " + u) + " · " + (c === "green" ? "GREEN" : c === "orange" ? "YELLOW" : "RED"), c)}</span></div>`;
      })
      .join("") +
    `<p class="card-sub" style="line-height:1.8;margin-top:15px">Ngưỡng KPI có thể sửa trong Lộ trình phát triển → Giả định & KPI. Vòng quay dùng tồn cuối kỳ; runway dùng chi phí vận hành tháng, chưa gồm giá vốn.</p>`
  );
}
function settings() {
  return (
    header(
      "Cài đặt không gian",
      "Kiểm soát dữ liệu, vốn đầu tư và các giả định vận hành.",
    ) +
    `<div class="grid two-col"><section class="card pad"><h2>Cấu hình dự án</h2><form id="settings-form"><div class="calc-form">${[
      ["initial", "Vốn đầu tư ban đầu (đ)", "number"],
      ["startMonth", "Tháng bắt đầu dự án", "month"],
      ["capacityHours", "Giờ khả dụng / máy / tháng", "number"],
      ["filamentThreshold", "Cảnh báo filament dưới (g)", "number"],
      ["runwayReserve", "Vốn dự phòng mục tiêu (đ)", "number"],
    ]
      .map(
        ([k, l, t]) =>
          `<div><label for="setting-${k}">${l}</label><input id="setting-${k}" name="${k}" type="${t}" min="${["initial", "capacityHours"].includes(k) ? 1 : 0}" required value="${d.settings[k]}"></div>`,
      )
      .join(
        "",
      )}</div><button class="btn" style="margin-top:20px" type="submit">Lưu cấu hình</button></form></section><section class="card pad"><h2>Dữ liệu & sao lưu</h2><p style="font-size:11px;margin-top:16px">${d.demo ? "Hiện đang dùng dữ liệu mẫu." : "Đang sử dụng dữ liệu riêng của bạn."} Dữ liệu lưu tại trình duyệt trên thiết bị này. Không đồng bộ giữa thiết bị. Hãy xuất JSON thường xuyên.</p><div class="settings-actions">${btn(icon("download") + " Xuất JSON", "export", "", "secondary")}${btn(icon("file") + " Nhập JSON", "import", "", "secondary")}</div><input type="file" id="import-file" accept="application/json" hidden><div class="warn">Nhập bản sao lưu sẽ thay thế toàn bộ dữ liệu hiện tại sau khi xác nhận. Xuất dữ liệu trước khi xóa bộ nhớ trình duyệt hoặc đổi thiết bị.</div><div class="settings-actions">${btn("Bắt đầu với dữ liệu trống", "clear", "", "danger")}${btn("Khôi phục dữ liệu mẫu", "restore", "", "secondary")}</div><p class="muted" style="line-height:1.8">Không cần tài khoản để dùng trên thiết bị. Website hiện được chia sẻ công khai; dữ liệu cá nhân vẫn lưu trên trình duyệt của bạn. File STL/3MF và ảnh được lưu dưới dạng liên kết, không tải file lên máy chủ.</p></section></div><section class="card pad" style="margin-top:20px"><h2>Nguyên tắc ghi nhận của MVP</h2><p style="font-size:11px;line-height:2;margin-top:13px">Đơn hàng lưu giá vốn thực tế tại thời điểm nhập; thay đổi giá SKU không viết lại lịch sử đơn. Mỗi đơn một SKU. Workshop hiển thị doanh thu dự kiến, chỉ ghi nhận tiền khi nhập Thu nhập khác. Nhật ký bảo trì không tự tạo chi phí. Kho vật tư được điều chỉnh thủ công; filament tự trừ theo lệnh in. Vốn giải ngân là các hạng mục đầu tư, không nhập lặp vào chi phí. “Vốn + lợi nhuận giữ lại” là ước tính theo giá vốn phân bổ, không phải số dư ngân hàng. Vốn chưa giải ngân = vốn ban đầu − giải ngân đầu tư.</p></section>`
  );
}
const pages = {
  dashboard,
  lab,
  products: () =>
    listPage(
      "products",
      "Giá vốn, biên lợi nhuận và mức độ sẵn sàng của từng SKU.",
      stages,
      [
        ["SKU trong Lab", d.products.length],
        ["Đang bán", d.products.filter((p) => p.status === "SELLING").length],
        [
          "Đã kiểm chứng",
          d.products.filter((p) => p.status === "VALIDATED").length,
        ],
      ],
    ) +
    `<div style="margin-top:16px">${btn("Mở calculator", "open-calc", "", "secondary")}</div>`,
  jobs,
  machines,
  filaments: () =>
    listPage(
      "filaments",
      "Theo dõi từng cuộn. Tự động trừ gram khi lệnh in hoàn tất hoặc thất bại.",
      [],
      [
        ["Tồn filament", num(sum(d.filaments, "remaining") / 1000) + " kg"],
        [
          "Giá trị còn lại",
          money(
            sum(d.filaments, (x) =>
              x.spool ? (x.remaining / x.spool) * x.cost : 0,
            ),
          ),
        ],
        [
          "Cuộn cần bổ sung",
          d.filaments.filter((x) => x.remaining < d.settings.filamentThreshold)
            .length,
        ],
      ],
    ),
  orders,
  customers,
  finance,
  inventory: () =>
    listPage(
      "inventory",
      "Vật tư, phụ kiện, linh kiện và văn phòng phẩm. Tồn kho cập nhật thủ công.",
      [],
      [
        ["Loại vật tư", d.inventory.length],
        [
          "Giá trị tồn kho",
          money(sum(d.inventory, (x) => x.cost * x.quantity)),
        ],
        ["Dưới ngưỡng", d.inventory.filter((x) => x.quantity < x.min).length],
      ],
    ),
  store: storePage,
  workshops: () =>
    listPage(
      "workshops",
      "Mang tinh thần maker đến học viên và cộng đồng Củ Chi. Doanh thu dưới đây là dự kiến.",
      ["Dự kiến", "Mở đăng ký", "Hoàn thành", "Hủy"],
      [
        ["Workshop", d.workshops.length],
        ["Lượt đăng ký", sum(d.workshops, "registered")],
        [
          "Doanh thu dự kiến (trừ hủy)",
          money(
            sum(
              d.workshops.filter((x) => x.status !== "Hủy"),
              (x) => x.registered * x.price,
            ),
          ),
        ],
      ],
    ),
  roadmap: () => planUI.render(),
  ideas: () =>
    listPage(
      "ideas",
      "Opportunity Score = (Demand + Margin + 11 − Competition + Printability + Uniqueness) / 50 × 100.",
      ["Ý tưởng", "Đang nghiên cứu", "Đưa vào Lab", "Bỏ qua"],
    ),
  settings,
  report,
};
let previousFocus = null;
function modal(t, body, wide = false) {
  previousFocus = document.activeElement;
  $("#modal-root").innerHTML =
    `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(t)}" style="${wide ? "width:860px" : ""}"><div class="modal-header"><h2>${t}</h2><button class="icon-btn" data-action="close" aria-label="Đóng">${icon("close")}</button></div>${body}</section></div>`;
  setTimeout(
    () =>
      $(
        ".modal input:not([type=hidden]), .modal textarea, .modal button",
      )?.focus(),
    0,
  );
}
function closeModal() {
  $("#modal-root").innerHTML = "";
  previousFocus?.focus?.();
}
function confirmDialog(titleText, message, action) {
  modal(
    titleText,
    `<div class="pad"><p style="color:#667892;font-size:12px">${esc(message)}</p></div><div class="form-footer">${btn("Hủy", "close", "", "secondary")}${btn("Xác nhận", "confirm", "", "danger")}</div>`,
  );
  $('.modal [data-action="confirm"]').onclick = () => {
    closeModal();
    action();
  };
}
function formField(f, value) {
  const id = "field-" + f.key;
  let attrs = `id="${id}" name="${f.key}" ${f.required ? "required" : ""}`;
  if (f.type === "number")
    attrs += ` type="number" step="any" min="${f.min ?? 0}" ${f.max != null ? `max="${f.max}"` : ""}`;
  let control;
  if (f.type === "select")
    control = `<select ${attrs}>${f.options.map((x) => `<option ${value === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
  else if (f.type === "ref") {
    const opts = d[f.options];
    control = `<select ${attrs} ${["machine", "filament", "product"].includes(f.key) ? "required" : ""}><option value="">Chọn ${f.label.toLowerCase()}</option>${opts.map((x) => `<option value="${esc(x.id)}" ${x.id === value ? "selected" : ""}>${esc(x.name || x.brand + " · " + x.material + " · " + x.color)}</option>`).join("")}</select>`;
  } else if (f.type === "textarea")
    control = `<textarea ${attrs}>${esc(value)}</textarea>`;
  else
    control = `<input ${attrs} ${f.type !== "number" ? `type="${f.type}"` : ""} value="${esc(value)}">`;
  return `<div><label for="${id}">${f.label}${f.required ? " *" : ""}</label>${control}</div>`;
}
function openForm(t, id, initial = {}) {
  const schema = schemas[t],
    existing = byId(t, id),
    x = existing || initial;
  let fields = schema.fields;
  if (t === "jobs" && existing?.deducted)
    fields = fields.filter(
      (f) =>
        !["grams", "filament", "machine", "product", "quantity"].includes(
          f.key,
        ),
    );
  modal(
    `${existing ? "Chỉnh sửa" : "Thêm"} ${schema.title}`,
    `<form id="record-form" data-table="${t}" data-id="${esc(id || "")}"><div class="form-grid">${fields.map((f) => formField(f, x[f.key] ?? f.default ?? (f.type === "select" ? f.options[0] : ""))).join("")}${t === "products" ? '<div style="grid-column:1/-1" id="product-cost-preview"></div>' : ""}${t === "jobs" && existing ? `<div style="grid-column:1/-1" class="notice">Trạng thái ${esc(existing.status)} · ${existing.deducted ? "Đã trừ filament; thông số tiêu thụ được khóa để giữ đúng tồn kho." : "Sử dụng nút điều khiển ngoài bảng để bắt đầu, hoàn tất hoặc báo lỗi."}</div>` : ""}${t === "orders" ? '<div style="grid-column:1/-1" class="warn">Giá bán và giá vốn được gợi ý từ SKU khi chọn sản phẩm hoặc đổi số lượng. Bạn có thể nhập giá trị thực tế. Mã đơn phải duy nhất.</div>' : ""}</div><div class="form-footer">${btn("Hủy", "close", "", "secondary")}<button type="submit" class="btn">${icon("check")} Lưu ${schema.title}</button></div></form>`,
    true,
  );
  const form = $("#record-form");
  if (t === "products") {
    form.addEventListener("input", () => costPreview(form));
    costPreview(form);
  }
  if (["orders", "jobs"].includes(t))
    form.addEventListener("change", (e) => {
      if (!["product", "quantity"].includes(e.target.name)) return;
      const p = byId("products", form.elements.product.value);
      if (!p) return;
      const qty = Number(form.elements.quantity.value) || 1;
      if (t === "orders") {
        form.elements.revenue.value = p.price * qty;
        form.elements.cogs.value = Math.round(productCost(p, d).cogs * qty);
      } else {
        form.elements.grams.value = p.weight * qty;
        form.elements.estimated.value = p.hours * qty;
        form.elements.cost.value = Math.round(productCost(p, d).cogs * qty);
      }
    });
  if (t === "orders" && !existing)
    form.elements.code.value = "DH-" + Date.now().toString().slice(-7);
  if (t === "jobs" && !existing)
    form.elements.code.value = "PR-" + Date.now().toString().slice(-7);
}
function costPreview(form) {
  const row = Object.fromEntries(new FormData(form));
  for (const f of schemas.products.fields)
    if (f.type === "number") row[f.key] = Number(row[f.key]);
  const c = productCost(row, d);
  $("#product-cost-preview").innerHTML =
    `<div class="notice"><span>Giá vốn dự kiến <b>${money(c.cogs)}</b> · Biên gộp <b>${num(c.margin)}%</b> · Giá gợi ý (biên 60%) <b>${money(c.cogs / 0.4)}</b><br>Vật liệu ${money(c.material)} · Máy ${money(c.machine)} · Công ${money(row.labor)} · Bao bì ${money(row.packaging)} · Score ${productScore(row)}/100 · Đã bán ${num(
      sum(
        d.orders.filter(
          (o) => o.product === form.dataset.id && o.status === "Đã thanh toán",
        ),
        "quantity",
      ),
    )} sản phẩm</span></div>`;
}
function submitRecord(form) {
  const t = form.dataset.table,
    id = form.dataset.id,
    old = byId(t, id);
  const row = {
    ...old,
    ...Object.fromEntries(new FormData(form)),
    id: id || uid(),
  };
  for (const f of schemas[t].fields)
    if (f.type === "number" && f.key in row) {
      row[f.key] = Number(row[f.key]);
      if (
        !Number.isFinite(row[f.key]) ||
        row[f.key] < (f.min || 0) ||
        (f.max != null && row[f.key] > f.max)
      ) {
        toast("Kiểm tra giá trị " + f.label);
        return;
      }
    }
  if (
    ["orders", "jobs"].includes(t) &&
    (!Number.isInteger(row.quantity) || row.quantity < 1)
  ) {
    toast("Số lượng phải là số nguyên lớn hơn 0");
    return;
  }
  if (
    ["orders", "jobs"].includes(t) &&
    d[t].some((x) => x.id !== row.id && x.code === row.code)
  ) {
    toast("Mã đã tồn tại. Hãy nhập mã khác.");
    return;
  }
  if (t === "filaments" && (row.spool <= 0 || row.remaining > row.spool)) {
    toast("Khối lượng cuộn phải >0 và tồn không vượt khối lượng cuộn");
    return;
  }
  if (
    t === "workshops" &&
    (!Number.isInteger(row.registered) ||
      !Number.isInteger(row.capacity) ||
      row.registered > row.capacity ||
      row.capacity < 1)
  ) {
    toast("Sức chứa và đăng ký phải là số nguyên, đăng ký không vượt sức chứa");
    return;
  }
  if (t === "jobs") {
    if (row.grams <= 0 || row.estimated <= 0) {
      toast("Khối lượng và thời gian phải lớn hơn 0");
      return;
    }
    if (!old) {
      row.status = "Queued";
      row.start = "";
      row.finish = "";
      row.deducted = false;
      row.reprint = false;
    }
  }
  if (t === "products" && row.file && !/^https?:\/\//.test(row.file)) {
    toast("Liên kết STL/3MF cần bắt đầu bằng https:// hoặc http://");
    return;
  }
  if (t === "orders" && (!row.product || !row.customer)) {
    toast("Chọn sản phẩm và khách hàng trước khi lưu");
    return;
  }
  repo.upsert(t, row);
  d = repo.data;
  closeModal();
  render();
  toast("Đã lưu " + schemas[t].title);
}
function deleteRecord(t, id) {
  const links = {
    products: [
      ["orders", "product"],
      ["jobs", "product"],
    ],
    customers: [
      ["orders", "customer"],
      ["jobs", "customer"],
    ],
    machines: [
      ["jobs", "machine"],
      ["maintenance", "machine"],
    ],
    filaments: [["jobs", "filament"]],
  };
  if (
    (links[t] || []).some(([table, key]) => d[table].some((x) => x[key] === id))
  ) {
    toast(
      "Bản ghi đang được tham chiếu. Xử lý bản ghi liên quan trước khi xóa.",
    );
    return;
  }
  if (t === "jobs" && byId(t, id)?.status === "Printing") {
    toast("Hãy hoàn tất, báo lỗi hoặc hủy lệnh đang in trước khi xóa.");
    return;
  }
  confirmDialog(
    "Xóa " + schemas[t].title,
    t === "jobs"
      ? "Thao tác này xóa lịch sử in. Filament đã tiêu thụ không được hoàn kho. Bạn muốn tiếp tục?"
      : "Thao tác này xóa bản ghi và cập nhật số liệu liên quan. Bạn muốn tiếp tục?",
    () => {
      repo.delete(t, id);
      d = repo.data;
      render();
      toast("Đã xóa bản ghi");
    },
  );
}
function notifications() {
  const low = d.filaments.filter(
      (f) => f.remaining < d.settings.filamentThreshold,
    ),
    maintenance = d.maintenance.filter((x) => x.next && x.next <= TODAY);
  modal(
    "Thông báo & việc cần làm",
    `<div class="pad">${low.map((f) => `<div class="insight"><span class="insight-icon">${icon("layers")}</span><div><strong>${esc(f.brand)} · ${esc(f.color)} còn ${num(f.remaining)}g</strong><p>Nhập bổ sung hoặc chuẩn bị cuộn thay thế.</p></div></div>`).join("")}${maintenance.map((x) => `<div class="insight"><span class="insight-icon">${icon("settings")}</span><div><strong>${esc(nameOf("machines", x.machine))}: đến hạn bảo trì</strong><p>${esc(x.next)} · ${esc(x.task)}</p></div></div>`).join("")}<div class="insight"><span class="insight-icon">${icon("printer")}</span><div><strong>${d.jobs.filter((x) => x.status === "Queued").length} lệnh chờ in</strong><p>Xem hàng đợi và kiểm tra đủ filament trước khi chạy máy.</p></div></div>${repo.error ? '<div class="warn">Không lưu được dữ liệu. Hãy xuất bản sao lưu ngay.</div>' : ""}</div>`,
  );
}
function globalSearch() {
  modal(
    "Tìm kiếm không gian làm việc",
    `<div class="pad"><div class="search-wrap">${icon("search")}<input id="global-search" placeholder="Sản phẩm, mã đơn, khách hàng, ý tưởng…" aria-label="Tìm kiếm toàn hệ thống"></div><div id="search-results" style="margin-top:16px"><p class="muted">Nhập từ khóa để tìm trong dữ liệu của bạn.</p></div></div>`,
  );
  $("#global-search").addEventListener("input", (e) => {
    const q = e.target.value.toLocaleLowerCase("vi").trim();
    const matches = [];
    if (q)
      for (const t of Object.keys(schemas))
        for (const x of d[t])
          if (
            Object.values(x).some((v) =>
              String(v).toLocaleLowerCase("vi").includes(q),
            )
          )
            matches.push({ t, x });
    $("#search-results").innerHTML = q
      ? matches
          .slice(0, 20)
          .map(
            ({ t, x }) =>
              `<button style="width:100%;text-align:left;background:transparent;border-bottom:1px solid #edf1f7;padding:13px 0" data-action="edit" data-table="${t}" data-id="${esc(x.id)}"><strong>${esc(x.name || x.code || x.brand || x.task)}</strong><p class="card-sub">${schemas[t].name}</p></button>`,
          )
          .join("") || '<div class="empty">Không tìm thấy kết quả.</div>'
      : '<p class="muted">Nhập từ khóa để tìm.</p>';
  });
}
function download(name, content, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportReport() {
  const a = m(),
    r = d.reviews[month] || {};
  download(
    "3d-cu-chi-review-" + month + ".txt",
    `3D CỦ CHI — MONTHLY BUSINESS REVIEW ${month}\n\nDoanh thu: ${money(a.revenue)}\nGiá vốn: ${money(a.cogs)}\nLợi nhuận ròng: ${money(a.profit)}\nUtilization: ${num(a.utilization)}%\nTỷ lệ lỗi: ${num(a.failure)}%\nKhách quay lại: ${a.repeats.length}\nBest Product: ${productRanking(a.monthly)[0]?.name || "Chưa có"}\n\nWHAT WORKED\n${r.worked || ""}\n\nWHAT DIDN'T\n${r.didnt || ""}\n\nWHAT TO DO NEXT MONTH\n${r.next || ""}\n`,
    "text/plain;charset=utf-8",
  );
}
function resetData(demo) {
  const next = seed();
  if (!demo) {
    for (const key of Object.keys(schemas)) next[key] = [];
    next.roadmap.forEach((p) => {
      p.done = p.tasks.map(() => false);
      p.passed = false;
    });
    next.settings.phase = 1;
    next.settings.startMonth = TODAY.slice(0, 7);
    next.demo = false;
  }
  repo.data = next;
  repo.save();
  d = repo.data;
  query = "";
  filter = "";
  render();
  toast(demo ? "Đã khôi phục dữ liệu mẫu" : "Không gian mới đã sẵn sàng");
}
function bindPage() {
  const form = $("#settings-form");
  if (form)
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(form));
      for (const k of Object.keys(v))
        d.settings[k] = k === "startMonth" ? v[k] : Number(v[k]);
      persist();
      render();
      toast("Đã lưu cấu hình");
    };
  $("#import-file")?.addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      if (f.size > 5 * 1024 * 1024) throw Error("File vượt 5 MB");
      const next = validateImport(JSON.parse(await f.text()));
      confirmDialog(
        "Thay thế dữ liệu?",
        `Nhập ${f.name} sẽ thay toàn bộ dữ liệu hiện tại. Hãy chắc chắn bạn đã sao lưu.`,
        () => {
          repo.data = next;
          repo.save();
          d = repo.data;
          render();
          toast("Đã nhập bản sao lưu");
        },
      );
    } catch (err) {
      toast("Không nhập được: " + err.message);
    }
  });
}
function preserveSearch() {
  const pos = $("#table-search")?.selectionStart;
  render();
  const s = $("#table-search");
  s?.focus();
  if (s && pos != null) s.setSelectionRange(pos, pos);
}
document.addEventListener("input", (e) => {
  if (e.target.id === "table-search") {
    query = e.target.value;
    preserveSearch();
  }
  if (e.target.dataset.calc) {
    const k = e.target.dataset.calc,
      value = Number(e.target.value);
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      (k === "failure" && value >= 100) ||
      (k === "platform" && value > 100)
    ) {
      e.target.setCustomValidity("Giá trị không hợp lệ");
      e.target.reportValidity();
      return;
    }
    e.target.setCustomValidity("");
    d.calc[k] = value;
    persist();
    $("#calc-results").innerHTML = calcResults();
    $("#price-comparison").innerHTML = priceComparison();
  }
  if (e.target.dataset.review) {
    d.reviews[month] ??= {};
    d.reviews[month][e.target.dataset.review] = e.target.value;
    persist();
  }
});
document.addEventListener("change", (e) => {
  const target = e.target;
  if (target.id === "month-select") {
    month = target.value;
    render();
  }
  if (target.id === "status-filter") {
    filter = target.value;
    render();
  }
  if (target.dataset.storeCheck != null) {
    d.store.checks[Number(target.dataset.storeCheck)] = target.checked;
    persist();
  }
  if (target.dataset.roadPhase != null) {
    d.roadmap[Number(target.dataset.roadPhase)].done[
      Number(target.dataset.task)
    ] = target.checked;
    if (!target.checked)
      d.roadmap[Number(target.dataset.roadPhase)].passed = false;
    persist();
    render();
  }
  if (target.dataset.gate != null) {
    const p = d.roadmap[Number(target.dataset.gate)];
    if (target.checked && !p.done.every(Boolean)) {
      target.checked = false;
      toast("Hoàn tất checklist trước khi xác nhận gate");
      return;
    }
    p.passed = target.checked;
    persist();
    render();
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "record-form") {
    e.preventDefault();
    submitRecord(e.target);
  }
  if (e.target.id === "store-form") {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    for (const [k, v] of Object.entries(values)) d.store[k] = Number(v);
    persist();
    closeModal();
    render();
    toast("Đã lưu ngưỡng quyết định");
  }
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b) return;
  const a = b.dataset.action,
    t = b.dataset.table,
    id = b.dataset.id;
  try {
    switch (a) {
      case "menu":
        $(".sidebar").classList.toggle("open");
        break;
      case "navigate":
        location.hash = b.dataset.route;
        break;
      case "close":
        closeModal();
        break;
      case "add":
        openForm(t);
        break;
      case "edit":
        openForm(t, id);
        break;
      case "delete":
        deleteRecord(t, id);
        break;
      case "quick":
        modal(
          "Bạn muốn thêm gì?",
          `<div class="quick-grid">${[
            ["products", "box"],
            ["expenses", "wallet"],
            ["orders", "cart"],
            ["jobs", "printer"],
            ["ideas", "bulb"],
            ["customers", "users"],
          ]
            .map(
              ([t, i]) =>
                `<button data-action="add" data-table="${t}">${icon(i)}<b>Thêm ${schemas[t].title}</b></button>`,
            )
            .join("")}</div>`,
        );
        break;
      case "search":
        globalSearch();
        break;
      case "notifications":
        notifications();
        break;
      case "labview":
        view = b.dataset.view;
        render();
        break;
      case "finance-tab":
        financeTab = b.dataset.tab;
        query = "";
        filter = "";
        render();
        break;
      case "open-calc":
        financeTab = "calculator";
        location.hash = "finance";
        if (route === "finance") render();
        break;
      case "price":
        d.calc.price = Number(b.dataset.value);
        persist();
        render();
        break;
      case "job": {
        const next = b.dataset.next;
        if (next === "Failed") {
          modal(
            "Ghi nhận lệnh in lỗi",
            `<form id="failure-form"><div class="pad"><label for="failure-reason">Nguyên nhân lỗi *</label><textarea id="failure-reason" required style="width:100%"></textarea><p class="muted" style="margin-top:10px">Kiểm tra gram thực tế trong Sửa lệnh in trước khi xác nhận. Filament sẽ được trừ theo số gram đã ghi.</p></div><div class="form-footer"><button class="btn" type="submit">Xác nhận lỗi</button></div></form>`,
          );
          $("#failure-form").onsubmit = (e) => {
            e.preventDefault();
            try {
              const j = byId("jobs", id);
              const reason = $("#failure-reason").value.trim();
              if (!reason) {
                toast("Nhập nguyên nhân lỗi");
                return;
              }
              transitionJob(d, id, next);
              j.failureReason = reason;
              persist();
              closeModal();
              render();
              toast("Đã ghi nhận lệnh lỗi và vật liệu tiêu thụ");
            } catch (err) {
              toast(err.message);
            }
          };
        } else {
          transitionJob(d, id, next);
          persist();
          render();
          toast(
            next === "Printing"
              ? "Máy đã bắt đầu in"
              : "Đã hoàn tất và cập nhật filament",
          );
        }
        break;
      }
      case "cancel-job": {
        const j = byId("jobs", id);
        if (j.status === "Printing") {
          toast(
            "Lệnh đã chạy: dùng FAILED và ghi số gram thực tế để bảo toàn tồn kho.",
          );
          break;
        }
        transitionJob(d, id, "Cancelled");
        persist();
        render();
        toast("Đã hủy lệnh");
        break;
      }
      case "reprint": {
        const old = byId("jobs", id);
        openForm("jobs", null, {
          ...old,
          id: undefined,
          code: "PR-" + Date.now().toString().slice(-7),
          actual: 0,
          failureReason: "",
        });
        break;
      }
      case "set-phase": {
        const target = Number(b.dataset.value);
        if (
          target > d.settings.phase &&
          !d.roadmap.slice(0, target - 1).every((p) => p.passed)
        ) {
          toast("Xác nhận gate của các giai đoạn trước để chuyển tiếp.");
          break;
        }
        d.settings.phase = target;
        persist();
        render();
        toast("Đã cập nhật giai đoạn");
        break;
      }
      case "store-config":
        modal(
          "Ngưỡng GO / NO-GO",
          `<form id="store-form"><div class="form-grid">${[
            ["externalRevenue", "Doanh thu ngoài trung tâm / tháng (đ)"],
            ["localRepeat", "Khách local quay lại tối thiểu"],
            ["customOrders", "Đơn custom / tháng tối thiểu"],
            ["steadySku", "SKU bán có lãi tối thiểu"],
            ["positiveMonths", "Số tháng dòng tiền dương liên tiếp (1–6)"],
            ["reserveMonths", "Số tháng dự phòng"],
            ["rent", "Tiền thuê dự kiến / tháng (đ)"],
            ["other", "Chi phí cửa hàng khác / tháng (đ)"],
          ]
            .map(
              ([k, l]) =>
                `<div><label for="store-${k}">${l}</label><input id="store-${k}" name="${k}" type="number" min="1" ${k === "positiveMonths" ? 'max="6"' : ""} required value="${d.store[k]}"></div>`,
            )
            .join(
              "",
            )}</div><div class="form-footer"><button type="submit" class="btn">Lưu ngưỡng</button></div></form>`,
        );
        break;
      case "export":
        download(
          "3d-cu-chi-backup-" + TODAY + ".json",
          JSON.stringify(d, null, 2),
        );
        toast("Đã xuất bản sao lưu JSON");
        break;
      case "import":
        $("#import-file").click();
        break;
      case "clear":
        confirmDialog(
          "Bắt đầu với dữ liệu trống?",
          "Toàn bộ dữ liệu hiện tại sẽ bị xóa. Cấu hình vốn 30 triệu và lộ trình được giữ làm điểm khởi đầu. Xuất JSON trước nếu cần.",
          () => resetData(false),
        );
        break;
      case "restore":
        confirmDialog(
          "Khôi phục dữ liệu mẫu?",
          "Toàn bộ dữ liệu hiện tại sẽ được thay bằng bộ dữ liệu mẫu ban đầu.",
          () => resetData(true),
        );
        break;
      case "print":
        window.print();
        break;
      case "export-report":
        exportReport();
        break;
    }
  } catch (err) {
    toast(err.message);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if (
    (e.key === "Enter" || e.key === " ") &&
    e.target.matches(".product-card")
  ) {
    e.preventDefault();
    e.target.click();
  }
  if (e.key === "Tab" && $(".modal")) {
    const elements = [
      ...$(".modal").querySelectorAll("button,input,textarea,select,a[href]"),
    ].filter((el) => !el.disabled && el.type !== "hidden");
    if (e.shiftKey && document.activeElement === elements[0]) {
      e.preventDefault();
      elements.at(-1).focus();
    } else if (!e.shiftKey && document.activeElement === elements.at(-1)) {
      e.preventDefault();
      elements[0].focus();
    }
  }
});
window.addEventListener("hashchange", () => {
  route = location.hash.slice(1) || "dashboard";
  query = "";
  filter = "";
  closeModal();
  render();
  window.scrollTo(0, 0);
});
window.addEventListener("storage", (e) => {
  if (e.key === "cuchi-os-v1" && e.newValue) {
    try {
      d = repo.data = validateImport(JSON.parse(e.newValue));
      render();
      toast("Đã đồng bộ từ tab khác trên thiết bị");
    } catch {}
  }
});
const planUI = createPlanUI({
  getData: () => d,
  esc,
  money,
  num,
  icon,
  btn,
  modal,
  closeModal,
  confirmDialog,
  toast,
  persist,
  render,
  operatingRoadmap,
});
render();
if (repo.recovered)
  toast("Dữ liệu cũ không đọc được. Đã khởi tạo dữ liệu mẫu.");
