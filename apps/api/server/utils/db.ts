import { createDatabase } from "db0";
import postgresql from "db0/connectors/postgresql";

export const db = createDatabase(
    postgresql({
        bindingName: "DB",
        url: process.env.DATABASE_URL,
    }),
);
