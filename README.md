# Flyp Property Operations Prototype

A first front-end build based on [`SPEC.md`](./SPEC.md). It demonstrates property-linked task management, collaboration, and an in-app notification center using representative sample data.

## Run locally

```bash
npm install
npm run dev
```

Create and edit tasks, mark tasks complete, add property notes and comments, adjust check-in reminder preferences, and mark notifications read. Prototype changes persist in this browser via `localStorage`.

For a single-file version you can open directly, open [`flyp-property-operations.html`](./flyp-property-operations.html) in a browser. Rebuild it after source changes with `npm run build:standalone`.

## Current scope and limitations

- Built with React, Vite, and MUI.
- Includes My Tasks, Team Tasks, Priority, Properties, property details, task discussions, shared notes, and notifications.
- Engine-generated sample tasks are labelled as Engine-sourced; their due dates are read-only in the UI.
- Property, agency, access, and task records are mock data. There is no Engine authentication/API connection, backend persistence, scheduled reminder service, or real Engine deep link yet.
- Integration work should start with the Engine codebase/schema discovery described in `SPEC.md` before this prototype is treated as production data or security behavior.
