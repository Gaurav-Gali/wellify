import { pgTable, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
    id: text('id').primaryKey(), // Clerk user ID
    firstName: varchar('first_name', { length: 50 }).notNull(),
    lastName: varchar('last_name', { length: 50 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Stats table
export const stats = pgTable('stats', {
    id: text('id').primaryKey(), // unique stat entry ID
    userId: text('user_id').notNull(), // normal column, no relation
    steps: integer('steps').default(0).notNull(),
    spo2: integer('spo2').default(0).notNull(),        // oxygen saturation
    stress: integer('stress').default(0).notNull(),    // stress level score
    waterIntake: integer('water_intake').default(0).notNull(), // ml
    calories: integer('calories').default(0).notNull(),
    inactivity: integer('inactivity').default(0).notNull(),    // minutes
    createdAt: timestamp('created_at').defaultNow(),
});

export const rewards = pgTable("rewards", {
    id: text("id").primaryKey(), // unique reward entry ID
    userId: text("user_id").notNull(),          // can be any user ID (no relation)
    rewardScore: integer("reward_score").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});