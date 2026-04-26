## Setup

1. Use this template to create a new repo
2. Add the following **secrets** under Settings → Secrets and variables → Actions:
   - `GIT_USER_NAME` — your GitHub username
   - `GIT_USER_EMAIL` — your GitHub email
3. Run `init.ts` locally with your start date:
   `deno run --allow-read --allow-write --allow-run --allow-env init.ts 2022-07-06`
4. Push to main: `git push origin main`
5. Go to the Actions tab and enable workflows
6. Run the workflow for the current day
