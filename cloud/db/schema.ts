import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
export const businessState = sqliteTable("business_state", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  payload: text("payload").notNull(),
  revision: integer("revision").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const stateVersions = sqliteTable(
  "state_versions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    stateId: text("state_id").notNull(),
    revision: integer("revision").notNull(),
    payload: text("payload").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [uniqueIndex("state_versions_revision").on(t.stateId, t.revision)],
);
