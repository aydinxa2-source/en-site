import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const members=sqliteTable('members',{id:text('id').primaryKey(),email:text('email').notNull(),name:text('name').notNull()});
export const editors=sqliteTable('editors',{email:text('email').primaryKey()});
export const settings=sqliteTable('settings',{id:integer('id').primaryKey(),value:text('value').notNull(),version:integer('version').notNull().default(1)});
export const clips=sqliteTable('clips',{id:text('id').primaryKey(),room:text('room').notNull(),slot:integer('slot').notNull(),title:text('title').notNull(),embed:text('embed').notNull()});
export const votes=sqliteTable('votes',{userId:text('user_id').notNull().references(()=>members.id),room:text('room').notNull(),clipId:text('clip_id').notNull().references(()=>clips.id)},t=>[primaryKey({columns:[t.userId,t.room]})]);
