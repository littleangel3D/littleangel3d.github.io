import { seed, validateImport } from "./model.js";
const DRAFT = "cuchi-cloud-draft-v1";
export class CloudSync {
  constructor(
    repo,
    {
      fetcher = globalThis.fetch?.bind(globalThis),
      storage = globalThis.localStorage,
      onChange = () => {},
      onStatus = () => {},
      canRefresh = () => true,
    } = {},
  ) {
    this.repo = repo;
    this.fetcher = fetcher;
    this.storage = storage;
    this.onChange = onChange;
    this.onStatus = onStatus;
    this.canRefresh = canRefresh;
    this.status = "connecting";
    this.revision = 0;
    this.canEdit = false;
    this.pending = null;
    this.inflight = false;
    this.originalSave = repo.save.bind(repo);
    repo.save = () => this.save();
  }
  clearDraft() {
    try {
      this.storage.removeItem(DRAFT);
    } catch {}
  }
  notify(status, message = "") {
    this.status = status;
    this.message = message;
    this.onStatus(this);
  }
  async request(path, options) {
    const response = await this.fetcher(path, {
      credentials: "same-origin",
      cache: "no-store",
      ...options,
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw Error("Máy chủ trả về dữ liệu không hợp lệ");
    }
    if (!response.ok) {
      const e = Error(result.error || "Không thể lưu máy chủ");
      e.code = result.code;
      e.status = response.status;
      throw e;
    }
    return result;
  }
  cache() {
    this.originalSave();
  }
  async start() {
    try {
      const session = await this.request("/api/session");
      this.session = session;
      if (!session.configured) throw Error("Máy chủ chưa kết nối database");
      this.canEdit = !!session.canEdit;
      if (!this.canEdit) {
        this.repo.data = seed();
        this.notify(session.authenticated ? "forbidden" : "signed-out");
        return;
      }
      const remote = await this.request("/api/state");
      this.revision = remote.revision;
      this.updatedAt = remote.updatedAt;
      let draft;
      try {
        draft = JSON.parse(this.storage.getItem(DRAFT));
      } catch {}
      if (remote.exists) {
        validateImport(remote.data);
        this.repo.data = remote.data;
        if (draft?.userId === session.userId) {
          if (JSON.stringify(draft.data) === JSON.stringify(remote.data))
            this.clearDraft();
          else {
            validateImport(draft.data);
            this.repo.data = draft.data;
            if (draft.baseRevision !== remote.revision) {
              this.cache();
              this.notify(
                "conflict",
                "Có bản nháp chưa đồng bộ. Xuất JSON trước khi tải dữ liệu mới từ máy chủ.",
              );
              return;
            }
            this.pending = structuredClone(draft.data);
          }
        }
        this.cache();
        this.notify("saved");
        if (this.pending) await this.flush();
      } else {
        this.notify("saved");
        this.save();
        await this.flush();
      }
    } catch (e) {
      this.canEdit = false;
      this.repo.data = seed();
      this.notify("unavailable", e.message);
    }
  }
  save() {
    if (!this.canEdit) return;
    this.cache();
    this.pending = structuredClone(this.repo.data);
    this.keepDraft();
    if (this.status === "conflict") return;
    this.notify("saving");
    queueMicrotask(() => this.flush());
  }
  keepDraft() {
    try {
      this.storage.setItem(
        DRAFT,
        JSON.stringify({
          userId: this.session.userId,
          baseRevision: this.revision,
          data: this.pending || this.repo.data,
        }),
      );
    } catch {
      this.message = "Không lưu được bản dự phòng trên thiết bị.";
    }
  }
  async flush() {
    if (
      this.inflight ||
      !this.pending ||
      !this.canEdit ||
      this.status === "conflict"
    )
      return;
    this.inflight = true;
    const snapshot = this.pending;
    this.pending = null;
    this.notify("saving");
    try {
      const result = await this.request("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseRevision: this.revision, data: snapshot }),
      });
      if (!result.saved || !Number.isInteger(result.revision))
        throw Error("Máy chủ chưa xác nhận dữ liệu");
      this.revision = result.revision;
      this.updatedAt = result.updatedAt;
      this.lastError = null;
      if (this.pending) {
        this.keepDraft();
      } else {
        this.clearDraft();
        this.notify("saved");
      }
    } catch (e) {
      this.lastError = e;
      this.pending = this.pending || snapshot;
      this.keepDraft();
      this.notify(e.status === 409 ? "conflict" : "error", e.message);
    } finally {
      this.inflight = false;
    }
    if (this.pending && !["error", "conflict"].includes(this.status))
      return this.flush();
  }
  async refresh() {
    if (
      !this.canEdit ||
      this.inflight ||
      this.pending ||
      !this.canRefresh() ||
      ["error", "conflict"].includes(this.status)
    )
      return;
    const revision = this.revision;
    try {
      const r = await this.request("/api/state");
      if (
        this.inflight ||
        this.pending ||
        this.revision !== revision ||
        !this.canRefresh()
      )
        return;
      if (!r.exists) throw Error("Chưa có dữ liệu máy chủ.");
      if (r.revision !== this.revision) {
        validateImport(r.data);
        this.repo.data = r.data;
        this.revision = r.revision;
        this.updatedAt = r.updatedAt;
        this.cache();
        this.notify("saved");
        this.onChange();
      } else if (this.status !== "saved") this.notify("saved");
    } catch (e) {
      if (!this.inflight && !this.pending) this.notify("error", e.message);
    }
  }
  async reloadRemote() {
    const r = await this.request("/api/state");
    if (!r.exists) throw Error("Chưa có dữ liệu máy chủ");
    validateImport(r.data);
    this.pending = null;
    this.clearDraft();
    this.repo.data = r.data;
    this.revision = r.revision;
    this.updatedAt = r.updatedAt;
    this.cache();
    this.notify("saved");
    this.onChange();
  }
  retry() {
    if (this.status === "conflict") return;
    this.notify("saving");
    return this.pending ? this.flush() : this.refresh();
  }
}
export function installCloudGuards(cloud, notify) {
  const readOnly = new Set([
    "menu",
    "navigate",
    "close",
    "search",
    "notifications",
    "labview",
    "finance-tab",
    "open-calc",
    "price",
    "export",
    "export-report",
    "print",
    "cloud-retry",
    "cloud-reload",
    "cloud-export-old",
  ]);
  document.addEventListener(
    "click",
    (e) => {
      if (cloud.canEdit) return;
      const a = e.target.closest("[data-action]")?.dataset.action,
        p = e.target.closest("[data-plan-action]")?.dataset.planAction;
      if ((a && !readOnly.has(a)) || (p && !["tab", "scroll"].includes(p))) {
        e.preventDefault();
        e.stopImmediatePropagation();
        notify("Đăng nhập để chỉnh sửa và lưu dữ liệu lên máy chủ.");
      }
    },
    true,
  );
  for (const type of ["submit", "change", "input"])
    document.addEventListener(
      type,
      (e) => {
        if (cloud.canEdit) return;
        const el = e.target;
        if (
          el.matches(
            "#month-select,#status-filter,#table-search,#global-search,[data-calc]",
          )
        )
          return;
        if (type === "submit" || el.matches("[type=checkbox],[data-review]")) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (el.type === "checkbox") el.checked = !el.checked;
          notify("Đăng nhập để lưu thay đổi.");
        }
      },
      true,
    );
}
