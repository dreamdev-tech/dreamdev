import {
    boolean,
    date,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
export const userRoles = pgEnum("user_roles", ["admin", "student", "teacher"]);
export const chapterType = pgEnum("chapter_type", ["learn", "exercise"]);

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: userRoles("role").default("student").notNull(),
    password: varchar({ length: 255 }),
    is_active: boolean().default(false),
    is_premium: boolean().default(false),
    premium_start_date: date(),
    premium_end_date: date(),
    login_provider: varchar({ length: 15 }).notNull(),
    otp_secret: varchar({ length: 10 }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        emailIndex: uniqueIndex("email").on(table.email),
    };
});

export const coursesTable = pgTable("courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    course_name: varchar("course_name", { length: 255 }).notNull(),
    course_image_url: varchar({ length: 255 }),
    course_description: text("course_description").notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

export const chaptersTable = pgTable("chapters", {
    id: uuid("id").primaryKey().defaultRandom(),
    course_id: uuid("course_id").notNull().references(() => coursesTable.id),
    chapter_type: chapterType("chapter_type").default("learn").notNull(),
    chapter_name: varchar("chapter_name", { length: 255 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        courseIndex: index().on(table.course_id),
    };
});

export const chapterSectionsTable = pgTable("chapter_sections", {
    id: uuid("id").primaryKey().defaultRandom(),
    chapter_id: uuid("chapter_id").notNull().references(() => chaptersTable.id),
    text: text("text").notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        chapterIndex: index().on(table.chapter_id),
    };
});

export const chapterSectionFilesTable = pgTable("chapter_section_files", {
    id: uuid("id").primaryKey().defaultRandom(),
    chapter_section_id: uuid("chapter_section_id").notNull().references(() =>
        chapterSectionsTable.id
    ),
    file_title: varchar({ length: 255 }),
    file_type: varchar({ length: 255 }),
    file_url: varchar({ length: 255 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        chapterSectionIndex: index().on(table.chapter_section_id),
    };
});

export const userCoursesTable = pgTable("user_courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").notNull().references(() => usersTable.id),
    course_id: uuid("course_id").notNull().references(() => coursesTable.id),
    is_finished: boolean().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        userIndex: index().on(table.user_id),
        courseIndex: index().on(table.course_id),
    };
});

export const userCourseProgressTable = pgTable("user_course_progress", {
    id: uuid("id").primaryKey().defaultRandom(),
    user_course_id: uuid("user_course_id").notNull().references(() =>
        userCoursesTable.id
    ),
    chapter_id: uuid("chapter_id").notNull().references(() => chaptersTable.id),
    is_finished: boolean().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        userCourseIndex: index().on(table.user_course_id),
        chapterIndex: index().on(table.chapter_id),
    };
});
