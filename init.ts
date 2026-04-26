import { writeConfig, getDays, backfillCommit, configCommit, updateCounter } from "./shared.ts";

console.log("Starting Jobcenter Simulator...");

const startDate: string = Deno.args[0];
console.log("Unemployed since: ", startDate);

const config = { startDate, unemployed: true };
await writeConfig(config);

const now = new Date();
await configCommit(startDate);

const days = getDays(config.startDate, now.toISOString().split('T')[0]);
console.log("Amount of days to backfill: ", days);
if (days === 0) {
  console.log("Nothing to do here... push and let the github actions handle the rest.");
  Deno.exit();
}

for (let i = days; i >= 1; i--) {
  if (i == days) continue;
  const date = new Date();
  date.setDate(now.getDate() - i);
  console.log("Backfilling: ", date.toISOString().split('T')[0], "Day: ", days - i);
  await updateCounter(date.toISOString().split('T')[0]);
  await backfillCommit(date.toISOString().split('T')[0], days - i);
}

console.log("Finished backfilling");
console.log("Review commits with: git log");
console.log("Then push with: git push origin main");
