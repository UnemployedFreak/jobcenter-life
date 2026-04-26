import { readConfig, getDays, getTitle } from "./shared.ts";

const config = await readConfig();
if (!config.unemployed) {
  console.log("No longer unemployed :( Nothing to do here.");
  Deno.exit();
}

let dateArg: string = Deno.args[0];
const date = dateArg ? dateArg : new Date().toISOString().split('T')[0];
const day = getDays(config.startDate, date);

const title = getTitle(day);
const content = `## Jobcenter Simulator

**Tage arbeitslos**: ${day}<br>
**Zuletzt aktualisiert**: ${date}<br>
**Aktueller Arbeitgeber**: Jobcenter Berlin Spandau<br>
**Position**: ${title}<br>

*Professionell nichts tun seit Tag 1.*
`;

Deno.writeTextFile("README.md", content);
console.log("Updated README.md");
