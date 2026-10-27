import { ensurePlan, validatePlan, planSchemas, editPhase } from "./plan.js";
export function createPlanUI(ctx) {
  const {
    esc,
    money,
    num,
    icon,
    btn,
    modal,
    closeModal,
    confirmDialog,
    toast,
  } = ctx;
  const data = () => ctx.getData(),
    plan = () => ensurePlan(data());
  let active = "map";
  const list = (t) =>
    `<ul class="plan-points">${String(t || "")
      .split("\n")
      .filter(Boolean)
      .map((s) => `<li>${esc(s)}</li>`)
      .join("")}</ul>`;
  const action = (text, a, section = "", id = "", cls = "secondary small") =>
    `<button class="btn ${cls}" data-plan-action="${a}" data-section="${section}" data-id="${esc(id)}">${text}</button>`;
  const edit = (s, r) =>
    `<div class="row-actions"><button class="btn secondary small" data-plan-action="edit" data-section="${s}" data-id="${esc(r.id)}" aria-label="Sửa ${esc(r.title)}">${icon("edit")}</button>${s !== "kpis" ? `<button class="btn secondary small" data-plan-action="delete" data-section="${s}" data-id="${esc(r.id)}" aria-label="Xóa ${esc(r.title)}">${icon("trash")}</button>` : ""}</div>`;
  const section = (n, title, key, content) =>
    `<section class="card plan-section" id="plan-${key}"><div class="plan-section-head"><div><span class="plan-number">${n}</span><h2>${title}</h2></div>${action(icon("plus") + " Thêm", "edit", key)}</div>${content}</section>`;
  const range = (a, b) => `${money(a)} – ${money(b)}`;
  function map() {
    const p = plan(),
      low = p.investment.reduce((s, r) => s + r.low, 0),
      high = p.investment.reduce((s, r) => s + r.high, 0);
    return `<section class="plan-hero"><div class="eyebrow">TỪ CLASSROOM LAB ĐẾN LOCAL MAKER HUB</div><h2>${esc(p.title)}</h2><p>${esc(p.subtitle)}</p><div class="plan-hero-footer"><span>${icon("users")} ${num(p.studentCount)}+ học viên</span><span>${icon("wallet")} Vốn mục tiêu ${money(p.budget)}</span><span>${esc(p.tagline)}</span></div>${action(icon("edit") + " Sửa thông tin chung", "general", "", "", "small")}</section><div class="notice" style="margin-top:18px"><span>${icon("bulb")} Kế hoạch tham khảo chuyển từ ảnh bạn cung cấp. Mọi nội dung và khoảng tiền bên dưới đều sửa được. Dự báo không phải kết quả thực tế; quyết định thuê cửa hàng vẫn phải qua GO / NO-GO.</span></div><nav class="plan-anchors">${[
      ["vision", "01 Tầm nhìn"],
      ["values", "02 Giá trị"],
      ["segments", "03 Sản phẩm"],
      ["targets", "04 Khách hàng"],
      ["investment", "05 Đầu tư"],
      ["streams", "06 Doanh thu"],
      ["phases", "07 Lộ trình"],
      ["forecast", "08 Tài chính"],
    ]
      .map(
        ([id, t]) =>
          `<button data-plan-action="scroll" data-section="${id}">${t}</button>`,
      )
      .join(
        "",
      )}</nav><div class="grid two-col">${section("01", "Tầm nhìn & mục tiêu", "vision", `<div class="plan-stack">${p.vision.map((r) => `<article><div class="split"><h3>${esc(r.title)}</h3>${edit("vision", r)}</div><p>${esc(r.detail)}</p></article>`).join("") || empty()}</div>`)}${section("02", "Giá trị cốt lõi", "values", `<div class="plan-stack">${p.values.map((r) => `<article><div class="split"><h3>${esc(r.title)}</h3>${edit("values", r)}</div><p>${esc(r.detail)}</p></article>`).join("") || empty()}</div>`)}</div>${section("03", "Phân khúc sản phẩm & dịch vụ", "segments", `<div class="plan-product-grid">${p.segments.map((r, i) => `<article class="plan-tile tone-${i % 4}"><div class="split"><span class="plan-mini-icon">${icon(["box", "lab", "store", "printer"][i % 4])}</span>${edit("segments", r)}</div><h3>${esc(r.title)}</h3>${list(r.detail)}<div class="plan-price">${range(r.low, r.high)}</div><p>${esc(r.note)}</p></article>`).join("") || empty()}</div>`)}${section("04", "Khách hàng mục tiêu", "targets", `<div class="plan-targets">${p.targets.map((r) => `<article><span class="plan-person">${icon("users")}</span><div><div class="split"><h3>${esc(r.title)}</h3>${edit("targets", r)}</div><p>${esc(r.detail)}</p></div></article>`).join("") || empty()}</div>`)}${section("05", "Kế hoạch đầu tư ban đầu", "investment", `<div class="table-wrap"><table><thead><tr><th>Hạng mục</th><th>Gợi ý</th><th>Khoảng chi phí</th><th>Ghi chú</th><th>Sửa</th></tr></thead><tbody>${p.investment.map((r) => `<tr><td><strong>${esc(r.title)}</strong></td><td class="details">${esc(r.suggestion)}</td><td>${range(r.low, r.high)}</td><td class="details">${esc(r.note)}</td><td>${edit("investment", r)}</td></tr>`).join("")}</tbody></table></div><div class="plan-total"><span>Tổng đầu tư dự kiến (tự tính)</span><strong>${range(low, high)}</strong><span class="pill ${high > p.budget ? "orange" : "green"}">${high > p.budget ? "Kịch bản cao vượt ngân sách" : "Trong vốn mục tiêu"}</span></div><p class="muted" style="padding:0 22px 20px">Các khoản này là dự toán tham khảo, không ghi đè ngân sách / giải ngân thực tế ở Tài chính.</p>`)}${section("06", "Mô hình doanh thu", "streams", `<div class="grid two-col plan-inside">${p.streams.map((r, i) => `<article class="plan-tile tone-${i % 4}"><div class="split"><h3>${esc(r.title)}</h3>${edit("streams", r)}</div>${list(r.detail)}<div class="plan-price">${range(r.low, r.high)} / tháng</div><p>${esc(r.note)}</p></article>`).join("") || empty()}</div>`)}${section("07", "Lộ trình triển khai theo ảnh", "phases", `<div class="plan-timeline">${p.phases.map((r, i) => `<article style="--phase-color:${["#3887ea", "#37ae86", "#f2a141", "#9671d3", "#ed7c83"][i % 5]}"><div class="plan-phase-ribbon"><small>GIAI ĐOẠN ${i + 1}</small><h3>${esc(r.title)}</h3><span>Tháng ${num(r.start)}–${num(r.end)}</span></div><div class="plan-phase-body">${edit("phases", r)}${list(r.detail)}<div class="plan-gate"><b>Gate kiểm chứng</b><p>${esc(r.gate)}</p></div></div></article>`).join("") || empty()}</div><div class="plan-total"><p>Đây là lịch dự kiến. Giai đoạn cửa hàng trong ảnh được giữ dưới dạng khảo sát, chỉ triển khai khi đủ điều kiện.</p>${action("Dùng làm lộ trình vận hành", "apply-phases")}</div>`)}${section("08", "Dự báo tài chính tham khảo", "forecast", forecast(p))}<section class="card plan-section"><div class="plan-section-head"><div><span class="plan-number">↗</span><h2>Điểm hòa vốn & tầm nhìn dài hạn</h2></div>${action(icon("edit") + " Sửa giả định", "general")}</div><div class="grid two-col plan-inside"><div class="plan-tile tone-2"><h3>Hòa vốn dự kiến trong kế hoạch</h3><div class="plan-big">${num(p.breakEvenLow)}–${num(p.breakEvenHigh)} tháng</div><p>Mốc đặt mục tiêu từ ảnh, có thể chỉnh sửa. Theo dõi thời điểm hoàn vốn từ dữ liệu thật tại Tài chính.</p></div><div class="plan-tile tone-1"><h3>Sau ${num(p.longTermLow)}–${num(p.longTermHigh)} năm</h3><div class="plan-price">${range(p.longRevenueLow, p.longRevenueHigh)} / tháng</div><p>${esc(p.longTermNote)}</p></div></div></section>`;
  }
  function empty() {
    return '<div class="empty">Chưa có nội dung. Nhấn Thêm để nhập.</div>';
  }
  function forecast(p) {
    const max = Math.max(
      1,
      ...p.forecast.map((r) => Math.max(r.revenueHigh, r.profitHigh)),
    );
    return `<div class="plan-forecast-chart">${p.forecast.map((r) => `<div class="plan-forecast-col"><div class="plan-chart-bars"><div class="plan-range-bar" style="height:${Math.max(2, (r.revenueHigh / max) * 140)}px;background:#4167ed" title="Doanh thu ${range(r.revenueLow, r.revenueHigh)}"><span>${num(r.revenueLow / 1e6)}–${num(r.revenueHigh / 1e6)}tr</span></div><div class="plan-range-bar" style="height:${Math.max(2, (r.profitHigh / max) * 140)}px;background:#50b99a" title="Lợi nhuận ${range(r.profitLow, r.profitHigh)}"><span>${num(r.profitLow / 1e6)}–${num(r.profitHigh / 1e6)}tr</span></div></div><b>Tháng ${r.start}–${r.end}</b><small>${esc(r.title)}</small></div>`).join("")}</div><div class="legend" style="justify-content:center;margin-bottom:18px"><span><i class="dot"></i>Khoảng doanh thu / tháng</span><span><i class="dot" style="background:#50b99a"></i>Khoảng lợi nhuận / tháng</span></div><div class="table-wrap"><table><thead><tr><th>Giai đoạn</th><th>Doanh thu / tháng</th><th>Lợi nhuận / tháng</th><th>Giả định</th><th>Sửa</th></tr></thead><tbody>${p.forecast.map((r) => `<tr><td><strong>${esc(r.title)}</strong><p class="card-sub">Tháng ${r.start}–${r.end}</p></td><td>${range(r.revenueLow, r.revenueHigh)}</td><td>${range(r.profitLow, r.profitHigh)}</td><td class="details">${esc(r.note)}</td><td>${edit("forecast", r)}</td></tr>`).join("")}</tbody></table></div><p class="muted" style="padding:18px 22px;line-height:1.8">Cột cao biểu diễn mức cao của khoảng dự báo; khoảng đầy đủ nằm trên nhãn và trong bảng. Lợi nhuận âm được ghi đúng trong bảng. Số liệu do bạn đặt, không cộng vào doanh thu hay lợi nhuận thực tế.</p>`;
  }
  function render() {
    return `<div class="page-heading"><div><div class="eyebrow">CHIẾN LƯỢC / THỰC THI</div><h1>Bản đồ phát triển 3D Củ Chi</h1><p>Kế hoạch sống: sửa được, đo được, cập nhật theo điều đã học.</p></div><div class="heading-actions">${action(icon("settings") + " Giả định & KPI", "rules")}${btn(icon("file") + " In kế hoạch", "print", "", "secondary")}</div></div><div class="tabs">${[
      ["map", "Bản đồ kinh doanh"],
      ["execution", "Theo dõi triển khai"],
      ["reference", "Ảnh gốc"],
    ]
      .map(
        ([key, title]) =>
          `<button class="tab ${active === key ? "active" : ""}" data-plan-action="tab" data-section="${key}">${title}</button>`,
      )
      .join(
        "",
      )}</div>${active === "map" ? map() : active === "execution" ? ctx.operatingRoadmap() : `<section class="card pad"><h2>Bản kế hoạch gốc bạn cung cấp</h2><p class="card-sub" style="margin:12px 0">Nội dung đã được chuyển thành dữ liệu chỉnh sửa được trong tab Bản đồ kinh doanh. Ảnh gốc dùng để đối chiếu.</p><a href="roadmap-reference.png" target="_blank" rel="noopener"><img src="roadmap-reference.png" alt="Kế hoạch kinh doanh 3D Printing từ trung tâm ngoại ngữ đến cửa hàng local tại Củ Chi" style="display:block;width:100%;max-width:1000px;margin:auto;border-radius:9px"></a></section>`}`;
  }
  const input = (key, label, type, value) =>
    `<div><label for="plan-${key}">${label}</label>${type === "textarea" ? `<textarea id="plan-${key}" name="${key}" ${["detail", "tasks", "gate"].includes(key) ? 'rows="4"' : ""}>${esc(value)}</textarea>` : `<input id="plan-${key}" name="${key}" ${["number", "integer", "signed"].includes(type) ? `type="number" step="${type === "integer" ? "1" : "any"}" ${type === "signed" ? "" : 'min="' + (type === "integer" ? 1 : 0) + '"'}` : 'type="text"'} value="${esc(value)}" required>`}</div>`;
  function editor(section, id) {
    const schema = planSchemas[section];
    if (!schema) return;
    const r = plan()[section].find((x) => x.id === id) || {};
    modal(
      `${r.id ? "Sửa" : "Thêm"} ${schema.title}`,
      `<form id="plan-record-form" data-section="${section}" data-id="${esc(id)}"><div class="form-grid">${schema.fields.map(([k, l, t = "text"]) => input(k, l, t, r[k] ?? (["number", "signed"].includes(t) ? 0 : t === "integer" ? 1 : ""))).join("")}</div><div class="form-footer">${btn("Hủy", "close", "", "secondary")}<button class="btn" type="submit">Lưu thay đổi</button></div></form>`,
    );
  }
  const generalFields = [
    ["title", "Tên kế hoạch"],
    ["subtitle", "Định hướng phát triển"],
    ["tagline", "Thông điệp"],
    ["studentCount", "Số học viên hiện có", "number"],
    ["budget", "Vốn mục tiêu tham khảo (đ)", "number"],
    ["breakEvenLow", "Mục tiêu hòa vốn: từ tháng", "number"],
    ["breakEvenHigh", "Mục tiêu hòa vốn: đến tháng", "number"],
    ["longTermLow", "Tầm nhìn: từ năm", "number"],
    ["longTermHigh", "Tầm nhìn: đến năm", "number"],
    ["longRevenueLow", "Doanh thu dài hạn thấp / tháng (đ)", "number"],
    ["longRevenueHigh", "Doanh thu dài hạn cao / tháng (đ)", "number"],
    ["longTermNote", "Mục tiêu dài hạn", "textarea"],
  ];
  function general() {
    const p = plan();
    modal(
      "Chỉnh sửa thông tin kế hoạch",
      `<form id="plan-general-form"><div class="form-grid">${generalFields.map(([k, l, t = "text"]) => input(k, l, t, p[k])).join("")}</div><div class="form-footer"><button class="btn" type="submit">Lưu thông tin</button></div></form>`,
    );
  }
  function rules() {
    const p = plan();
    modal(
      "Giả định vận hành & KPI",
      `<div class="pad" style="overflow:auto"><h3>Điều kiện cân nhắc máy tiếp theo</h3><form id="plan-rules-form"><div class="calc-form">${[
        ["machineUtilization", "Công suất phải cao hơn (%)", "number"],
        ["machineMonths", "Số tháng liên tiếp (1–6)", "integer"],
        ["machineBacklog", "Lệnh chờ tối thiểu", "integer"],
        ["storeChecklist", "Checklist cửa hàng (mỗi dòng một mục)", "textarea"],
        ["storeStreams", "Nguồn thu cửa hàng (mỗi dòng một mục)", "textarea"],
      ]
        .map(([k, l, t]) => input(k, l, t, p[k]))
        .join(
          "",
        )}</div><button type="submit" class="btn" style="margin-top:15px">Lưu giả định</button></form><h3 style="margin-top:25px">Ngưỡng màu KPI</h3><p class="card-sub">KPI tỷ lệ lỗi: ngưỡng xanh phải thấp hơn hoặc bằng ngưỡng vàng. Các KPI khác: ngưỡng xanh cao hơn hoặc bằng vàng.</p>${p.kpis.map((r) => `<div class="result-row"><span>${esc(r.title)}<p class="card-sub">Vàng ${num(r.yellow)} · Xanh ${num(r.green)} ${esc(r.unit)}</p></span>${action("Sửa", "edit", "kpis", r.id)}</div>`).join("")}</div>`,
      true,
    );
  }
  function phaseEditor(index) {
    const p = data().roadmap[index];
    modal(
      p ? "Sửa giai đoạn vận hành" : "Thêm giai đoạn vận hành",
      `<form id="phase-editor-form" data-index="${index}"><div class="form-grid">${[
        ["title", "Tên giai đoạn"],
        ["months", "Thời gian / mốc tháng"],
        ["tasks", "Công việc (mỗi dòng một mục)", "textarea"],
        ["gate", "Gate kiểm chứng", "textarea"],
      ]
        .map(([k, l, t = "text"]) =>
          input(
            k,
            l,
            t,
            k === "tasks" ? p?.tasks.join("\n") || "" : p?.[k] || "",
          ),
        )
        .join(
          "",
        )}</div><div class="form-footer"><button class="btn" type="submit">Lưu giai đoạn</button></div></form>`,
    );
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-plan-action]");
    if (!b) return;
    const a = b.dataset.planAction,
      s = b.dataset.section,
      id = b.dataset.id;
    switch (a) {
      case "tab":
        active = s;
        ctx.render();
        break;
      case "scroll":
        document
          .getElementById("plan-" + s)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "edit":
        editor(s, id);
        break;
      case "general":
        general();
        break;
      case "rules":
        rules();
        break;
      case "phase-edit":
        phaseEditor(Number(id));
        break;
      case "phase-add":
        phaseEditor(-1);
        break;
      case "phase-delete": {
        if (data().roadmap.length === 1) {
          toast("Giữ ít nhất một giai đoạn");
          break;
        }
        confirmDialog(
          "Xóa giai đoạn?",
          "Công việc và trạng thái của giai đoạn này sẽ bị xóa.",
          () => {
            const index = Number(id);
            data().roadmap.splice(index, 1);
            if (data().settings.phase > index + 1) data().settings.phase--;
            data().settings.phase = Math.min(
              data().settings.phase,
              data().roadmap.length,
            );
            ctx.persist();
            ctx.render();
          },
        );
        break;
      }
      case "delete":
        confirmDialog(
          "Xóa mục kế hoạch?",
          "Nội dung này sẽ bị xóa khỏi bản đồ kinh doanh. Dữ liệu giao dịch thực tế không bị ảnh hưởng.",
          () => {
            plan()[s] = plan()[s].filter((x) => x.id !== id);
            ctx.persist();
            ctx.render();
            toast("Đã xóa mục kế hoạch");
          },
        );
        break;
      case "apply-phases":
        if (!plan().phases.length) {
          toast("Thêm ít nhất một giai đoạn");
          break;
        }
        confirmDialog(
          "Dùng kế hoạch này để triển khai?",
          "Thay lộ trình vận hành hiện tại bằng các giai đoạn trong kế hoạch; checklist và gate sẽ bắt đầu lại. Đơn hàng, sản phẩm và tài chính được giữ.",
          () => {
            data().roadmap = plan().phases.map((p) => ({
              title: p.title,
              months: `Tháng ${p.start}–${p.end}`,
              tasks: p.detail
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean),
              done: p.detail
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean)
                .map(() => false),
              gate: p.gate,
              passed: false,
            }));
            data().settings.phase = 1;
            ctx.persist();
            active = "execution";
            ctx.render();
            toast("Đã áp dụng lộ trình kế hoạch");
          },
        );
        break;
    }
  });
  document.addEventListener("submit", (e) => {
    if (
      ![
        "plan-record-form",
        "plan-general-form",
        "plan-rules-form",
        "phase-editor-form",
      ].includes(e.target.id)
    )
      return;
    e.preventDefault();
    try {
      const f = e.target,
        values = Object.fromEntries(new FormData(f));
      if (f.id === "phase-editor-form") {
        const index = Number(f.dataset.index),
          next = editPhase(data().roadmap[index], values);
        if (index < 0) data().roadmap.push(next);
        else data().roadmap[index] = next;
      } else {
        const next = structuredClone(plan());
        if (f.id === "plan-record-form") {
          const s = f.dataset.section,
            id = f.dataset.id,
            r = {
              ...next[s].find((x) => x.id === id),
              ...values,
              id: id || crypto.randomUUID(),
            };
          for (const [k, , t] of planSchemas[s].fields)
            if (["number", "integer", "signed"].includes(t))
              r[k] = Number(r[k]);
          if (!r.title.trim()) throw Error("Nhập tên mục");
          if (s === "phases" && (!r.detail.trim() || !r.gate.trim()))
            throw Error("Nhập công việc và điều kiện kiểm chứng");
          const index = next[s].findIndex((x) => x.id === id);
          if (index < 0) next[s].push(r);
          else next[s][index] = r;
        } else {
          for (const [k, v] of Object.entries(values))
            next[k] = typeof next[k] === "number" ? Number(v) : v;
          if (f.id === "plan-rules-form") {
            const old = plan().storeChecklist.split("\n").filter(Boolean),
              checks = data().store.checks;
            const labels = next.storeChecklist
              .split("\n")
              .map((x) => x.trim())
              .filter(Boolean);
            if (!labels.length) throw Error("Giữ ít nhất một mục checklist");
            next.storeChecklist = labels.join("\n");
            validatePlan(next);
            data().store.checks = labels.map(
              (label) => checks[old.indexOf(label)] === true,
            );
          }
        }
        validatePlan(next);
        data().businessPlan = next;
      }
      ctx.persist();
      closeModal();
      ctx.render();
      toast("Đã lưu thay đổi");
    } catch (err) {
      toast(err.message);
    }
  });
  return { render };
}
