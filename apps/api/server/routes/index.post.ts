import {defineEventHandler, H3Event, readBody} from "h3";
import { db } from "../utils/db";

export default defineEventHandler(async(event: H3Event) => {
    const body =  await readBody(event);

    if (!Array.isArray(body)) {
        return {
            status: 400,
            body: {
                error: "Invalid body"
            }
        };
    }

    await Promise.all(body.map(async item => {
        return db.sql`INSERT INTO sneakers (brand, name, indice) VALUES (${item.brand}, ${item.name}, ${item.indice})`;
    }));

    return;
});