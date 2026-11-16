import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// SQLite stores these UUIDs as text. Drizzle generates them on insert.
export const users = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    username: text("username").notNull(),
    role: text("role", { enum: ["admin", "member"] })
      .notNull()
      .default("member"),
  },
  (table) => [
    check("users_role_check", sql`${table.role} IN ('admin', 'member')`),
  ],
);

export const chatRooms = sqliteTable("chat_rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
});

// Each row connects one user to one room, replacing usersId: uuid[].
export const roomMembers = sqliteTable(
  "room_members",
  {
    chatRoomId: text("chat_room_id")
      .notNull()
      .references(() => chatRooms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.chatRoomId, table.userId] }),
    index("room_members_user_idx").on(table.userId),
  ],
);

export const messages = sqliteTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chatRoomId: text("chat_room_id")
      .notNull()
      .references(() => chatRooms.id, { onDelete: "cascade" }),
    msg: text("msg").notNull(),
    createdAt: integer("created_at")
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => [
    index("messages_room_time_idx").on(
      table.chatRoomId,
      table.createdAt,
      table.id,
    ),
    index("messages_user_idx").on(table.userId),
  ],
);
