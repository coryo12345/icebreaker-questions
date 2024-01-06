import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').unique(),
    passwordHash: text('password_hash')
});

export const groups = sqliteTable('groups', {}); // groups players together

export const questions = sqliteTable('questions', {}); // list of questions

export const groupAnswers = sqliteTable('group_answers', {}); // player answers for each group

// export const userAnswers = sqliteTable('user_answers', {}); // answers for a user that they can re-use for different groups
