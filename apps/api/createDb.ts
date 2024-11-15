import { db } from "./server/utils/db";
import {c} from "openapi-typescript";

async function createItemsTable() {
    // Create users table
    console.log("Creating users table");
    await db.sql`CREATE TABLE IF NOT EXISTS users
                 (
                     "id"
                     TEXT
                     PRIMARY
                     KEY,
                     "firstName"
                     TEXT,
                     "lastName"
                     TEXT,
                     "email"
                     TEXT
                 )`;

}

await createItemsTable().then(() => {
    console.log("Table created");
}).catch((e) => {
    console.error(e);
}).finally(() => {
    process.exit(0);
})