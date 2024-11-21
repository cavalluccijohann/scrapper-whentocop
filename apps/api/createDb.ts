import { db } from "./server/utils/db";
import {c} from "openapi-typescript";

async function createItemsTable() {
    // Create users table
    console.log("Creating sneakers table");
    await db.sql`CREATE TABLE IF NOT EXISTS sneakers
                 (
                        id SERIAL PRIMARY KEY,
                        brand TEXT NOT NULL,
                        name TEXT NOT NULL,
                        indice TEXT NOT NULL
                 )`;

}

await createItemsTable().then(() => {
    console.log("Table created");
}).catch((e) => {
    console.error(e);
}).finally(() => {
    process.exit(0);
})