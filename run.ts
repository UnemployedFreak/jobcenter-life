import { getDays, readConfig, runCommit, updateCounter } from "./shared.ts";

const config = await readConfig();
const date = new Date().toISOString().split('T')[0];
const day = getDays(config.startDate, date);
await updateCounter(date);
await runCommit(day);
