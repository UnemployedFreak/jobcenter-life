export interface Config {
  startDate: string;
  unemployed: boolean;
}

export async function readConfig(): Promise<Config> {
  console.log("Reading config...");
  return JSON.parse(await Deno.readTextFile("config.json"));
}

export async function writeConfig(config: Config) {
  console.log("Writing config...");
  await Deno.writeTextFile("config.json", JSON.stringify(config, null, 2));
}

export function getDays(start: string, now: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(now).getTime() - new Date(start).getTime()) / msPerDay) + 1;
};

export async function updateCounter(date: string) {
  await new Deno.Command("deno", {
    args: ["run", "--allow-write", "--allow-read", "./update-counter.ts", date],
  }).output();
}

export async function backfillCommit(date: string, day: number) {
  await new Deno.Command("git", {
    args: ["add", "README.md"],
  }).output();

  const commitMessage = getCommitMessage(day);
  const result = await new Deno.Command("git", {
    args: ["commit", "-m", commitMessage],
    env: {
      ...Deno.env.toObject(),
      GIT_AUTHOR_DATE: `${date}T00:00:00`,
      GIT_COMMITTER_DATE: `${date}T00:00:00`,
    },
  }).output();

  if (!result.success) throw new Error(new TextDecoder().decode(result.stderr));
  const out = new TextDecoder().decode(result.stdout);
  console.log(out.trim());
}

export async function runCommit(day: number) {
  console.log("Commiting updated README.md...");
  await new Deno.Command("git", {
    args: ["add", "README.md"],
  }).output();

  const commitMessage = getCommitMessage(day);
  const result = await new Deno.Command("git", {
    args: ["commit", "-m", commitMessage],
  }).output();

  if (!result.success) throw new Error(new TextDecoder().decode(result.stderr));
  const out = new TextDecoder().decode(result.stdout);
  console.log(out.trim());
}

export async function configCommit(date: string) {
  console.log("Commiting config...");
  await new Deno.Command("git", {
    args: ["add", "config.json"],
  }).output();

  const result = await new Deno.Command("git", {
    args: ["commit", "-m", `Update config.json`],
    env: {
      ...Deno.env.toObject(),
      GIT_AUTHOR_DATE: `${date}T00:00:00`,
      GIT_COMMITTER_DATE: `${date}T00:00:00`,
    },
  }).output();

  if (!result.success) throw new Error(new TextDecoder().decode(result.stderr));
  const out = new TextDecoder().decode(result.stdout);
  console.log(out.trim());
}

export function getTitle(days: number): string {
  if (days >= 1460) return "Langzeit-Bürgergeld-Veteran & Jobcenter-Legende";
  if (days >= 1095) return "Vollzeit-Profibürgergeldempfänger";
  if (days >= 730) return "Erfahrener Bürgergeld-Spezialist";
  if (days >= 365) return "Fortgeschrittener Jobcenter-Kunde";
  if (days >= 180) return "Motivierter Langzeit-Bewerber";
  if (days >= 90) return "Engagierter Arbeitsuchender";
  if (days >= 30) return "Neuer Jobcenter-Klient";
  return "Frisch arbeitslos – Noch optimistisch";
}

const commitMessageTemplates = [
  "Wieder ein Tag arbeitslos. Tag {day}. Arno Dübel wäre stolz auf sein Erbe.",
  "Ein weiterer Tag beim Jobcenter. Tag {day}. Mehr arbeiten? Schon erledigt.",
  "Loyaler Jobcenter-Kunde meldet sich. Tag {day}. Grüße an Friedrich Merz.",
  "Tag {day} im Dienst der Grundsicherung. Arno Dübel, dein Nachfolger meldet sich.",
  "Produktiv im Nichtstun. Tag {day}. Neue Bestleistung erreicht.",
  "Tag {day}. Bewerbungen schreiben war gestern, heute wird committet.",
  "Stammkunde beim Jobcenter meldet sich pünktlich. Tag {day}.",
  "Noch immer open to work… theoretisch. Tag {day}.",
  "Integrationsvereinbarung erfüllt: Einen Commit gemacht. Tag {day}.",
  "Grundsicherung läuft einwandfrei. Tag {day}. Danke Jobcenter.",
  "Tag {day}. Merz will mehr arbeiten – ich mache es wie Arno Dübel.",
  "Fallakte aktualisiert. Tag {day}. Keine Änderungen im Lebenslauf.",
  "Tag {day}. Immer noch unschlagbar im Langzeit-Arbeitslos-Sein.",
  "Pünktlich wie die Rente. Tag {day}. Nur ohne Rente.",
  "Tag {day}. Mein Beitrag zur deutschen Wirtschaft: stabile grüne Kästchen.",
  "Interner Statusbericht: Immer noch arbeitslos. Tag {day}.",
  "Merz wäre beeindruckt von meiner Arbeitsmoral. Tag {day}.",
  "Jellyfin pausiert für diesen wichtigen Commit. Tag {day}.",
  "Pünktlich wie immer: Nichts getan, aber dokumentiert. Tag {day}.",
  "Bewerbung abgelehnt? Egal, Commit gesendet. Tag {day}.",
  "Tag {day}. Der Arbeitsmarkt sucht mich immer noch nicht.",
  "Termin beim Jobcenter wahrgenommen – virtuell per Commit. Tag {day}.",
  "Tag {day}. Lebenslauf aktualisiert: Berufserfahrung +1 Tag Grundsicherung.",
  "Der Tut nix, der bekommt Bürgergeld. Tag {day}. Klassiker.",
  "Merz fordert mehr Effizienz. Tag {day}. Meine Couch und ich geben alles.",
  "Jobcenter-Modus aktiv. Tag {day}. Produktivität auf Sparflamme.",
  "Eintrag für Tag {day}: Weiterhin erfolgreich im Projekt Arbeitslosigkeit.",
  "Heute wieder pünktlich nichts erreicht. Tag {day}.",
  "Tag {day}. Von der Maßnahme direkt ins Repository.",
  "Heute wieder belegt: Arbeitslos, aber beschäftigt. Tag {day}.",
  "Tag {day}. Ich arbeite hart daran, nicht zu arbeiten.",
  "Tag {day}. Die Jobsuche ist noch in Alpha.",
  "Tag {day}. Wieder ein Tag im Dienst der gepflegten Untätigkeit."
];

export function getCommitMessage(day: number): string {
  const index = Math.floor(Math.random() * commitMessageTemplates.length);
  let message = commitMessageTemplates[index];
  return message.replace("{day}", day.toString());
}
