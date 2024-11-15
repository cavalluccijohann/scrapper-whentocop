import {defineEventHandler, H3Event} from "h3";
import { db } from "../utils/db";

export default defineEventHandler(async(event: H3Event) => {

    return db.sql`SELECT * FROM users WHERE id = ${event.id}`;
});

