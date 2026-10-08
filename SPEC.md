# Flyp Property CRM & Task Management — Specification

> Generated from the Grill Me discovery conversation. This is an initial build-ready product specification; unresolved decisions and recommended defaults are listed in section 15.

## 1. Product Definition

An internal task-management and property-operations feature embedded in Flyp Engine. It uses Engine as the source of truth for properties, Marketplace Managers, check-in schedules, portal-rotation data, and agent/branch information. It adds property-linked tasks, shared notes and discussions, and in-Engine notifications without replacing Engine or ClickUp data in the existing system. The first version is successful when Flyp members can see and manage work by property, reliably receive relevant reminders, and collaborate without duplicating property or agent details already maintained in Engine.

## 2. Target User

- **Primary users:** Flyp team members, including Marketplace Managers.
- **Secondary users:** N/A. Agents, agency branches, property owners, and customers do not access this feature.
- **Who is explicitly not a user:** Anyone who does not already have Flyp access through Engine.

## 3. Core User Flows

1. **Review and complete scheduled work:** Engine supplies check-in milestones and portal-rotation data → the feature creates a task under the relevant property and assigns it to the property's Marketplace Manager → the team sees the task grouped by due date and receives configured in-Engine reminders → a Flyp member completes the task in this feature → the completed task remains in that property's history.
2. **Create and assign a custom task:** A Flyp member opens a property → creates a task, initially assigned to themselves → optionally assigns it to any Flyp member, sets a due date and priority, and chooses To-do, In progress, or Done → the assignee receives an in-Engine notification when assigned or reassigned.
3. **Collaborate on a property:** A Flyp member adds a shared property note or comments in the property discussion → other Flyp members can read it → the assigned Marketplace Manager is notified when someone else comments; any mentioned member is notified as well.
4. **Collaborate on a task:** A Flyp member comments on a task or mentions a colleague → the task assignee is notified when another person comments → mentioned members are notified whether or not they are the assignee.
5. **Handle a portal rotation:** The feature reads the current portal rotation schedule from Engine → it reminds the assigned manager once when the rotation is due and flags the task overdue if still unfinished → the manager changes portal access in Engine, not in this feature → Engine records the next cycle → the feature creates a separate task for that new cycle and retains the old task in history.
6. **Follow a notification:** A Flyp member opens the notification list → selects a notification → the feature navigates to the associated property or task → the member can mark the notification read; it leaves the unread list but remains in All notifications history.
7. **Review agent/branch information:** A Flyp member views the read-only agent/branch information associated with the property's tasks → selects a link/button to open the corresponding Engine page to edit the source information.

## 4. Feature Requirements

### Must have (MVP)

- [ ] Embed the feature within Flyp Engine and inherit its access control; do not create external/agent logins.
- [ ] Treat each Engine property as the parent record. All tasks must belong to a property; there is no general/unlinked task list and no nested subtasks.
- [ ] Provide a main task view grouped chronologically by due date, including a “No due date” group for custom tasks without a due date.
- [ ] Provide a separate Priority view containing unfinished overdue tasks and unfinished tasks manually marked as priority.
- [ ] Support task statuses **To-do**, **In progress**, and **Done**.
- [ ] Support custom tasks that any Flyp member can create and assign to any Flyp member. Default the assignee to the creator. Record the task creator.
- [ ] Let any Flyp member edit and reassign tasks and change their status. Keep creator attribution even when the task is reassigned.
- [ ] Support optional due dates for custom tasks and a manually set priority flag.
- [ ] Generate check-in and portal-rotation tasks from Engine data. Create a distinct task for each check-in milestone and each portal-rotation cycle.
- [ ] Assign Engine-generated tasks to the Marketplace Manager recorded for the property in Engine. When that manager changes, reassign open Engine-generated tasks to the new manager. Preserve completed task history.
- [ ] Keep property records and task history accessible after a property becomes inactive in Engine. Unfinished tasks on inactive properties remain visible in task views until completed.
- [ ] Sync Engine changes to an open system-generated task’s due date. Do not reopen or retime a completed task; a genuinely new milestone/cycle creates a new task.
- [ ] Allow Flyp members to mark check-in and portal-rotation tasks Done in this feature. Check-in feedback and changes to property or portal data remain in Engine; task completion does not duplicate those workflows or write those changes back to Engine.
- [ ] Show “agents engaged” based on Engine’s access/acceptance data, not inferred or manually entered activity. Show branch-level agency name/location and phone/email where available; do not assume an individual agent’s details always exist.
- [ ] Keep agent/branch details read-only here and provide a direct link to the relevant Engine page for edits.
- [ ] Support shared property-level notes, property-level comments, and task-level comments. All are visible to Flyp members with access to the property.
- [ ] Support @mentions of Flyp members in comment threads and notify each mentioned member.
- [ ] Provide an in-Engine notification center with an unread count, a reviewable list, links to the relevant task/property, mark-as-read behavior, and an All notifications history.
- [ ] Send an in-Engine notification when a task is assigned or reassigned to a member.
- [ ] Do not send notifications by default for task status changes.
- [ ] Configure check-in reminders per property, shared by the property's current assignee(s). Default to two days before, on the due date, and once when overdue. Managers can customize the advance reminder, due-date reminder, and overdue reminder cadence for that property.
- [ ] For portal rotations and custom tasks, send one notification at the due time, then flag overdue without repeat notifications.
- [ ] Notify the assigned Marketplace Manager(s) when someone else comments on a property. Notify the task assignee when someone else comments on a task. Mentioned people are notified even if they are not assigned to the property/task.
- [ ] Do not notify the person who authored the comment about their own comment.
- [ ] Marking a notification read removes it from the unread list but preserves it in All notifications history.

### Should have

- [ ] Search and filters for properties, assignees, statuses, priorities, and due-date ranges.
- [ ] Additional reminder configuration presets or bulk configuration across properties.
- [ ] Export or reporting of completed tasks and operational activity.

### Could have

- [ ] N/A for the initial specification; additional scope can be prioritized after an MVP pilot.

## 5. Business Rules

- **Property linkage:** Every task has exactly one property parent. Property identity and existing property fields come from Engine.
- **Task creation:** Any Flyp member can create a custom task for a property and assign it to any Flyp member. Default assignee is the creator. Creator identity is immutable attribution.
- **Task editing:** Any Flyp member can edit/reassign tasks and change status. Completed tasks are retained as history.
- **Task statuses:** The only statuses are To-do, In progress, and Done. Overdue is a derived flag, not a status; any unfinished task can be overdue, including one in In progress.
- **Priority:** Priority is a manually applied yes/no flag. An unfinished task appears in Priority view if it is overdue, marked priority, or both. Done tasks are excluded from active views by default.
- **Custom task due dates:** Optional. Undated tasks appear under “No due date.” A task with a due date becomes overdue after that date/time passes unless it is Done.
- **Check-ins:** Each Engine check-in milestone (including the existing 14-, 30-, 60-, 90-day schedule and any other milestones in Engine) creates its own property-linked task. The schedule is property-specific and sourced from Engine.
- **Check-in reminder default:** Notify two days before, on the due date, and once when overdue. Reminder configuration is shared at the property level and may be customized for that property.
- **Portal rotation:** One agent has portal access for a four-week period at a time. Engine remains responsible for granting/removing access and selecting the next agent. The new feature only tracks/reminds; it never changes portal permissions.
- **Portal rotation task:** Source the current rotation date/cycle from Engine. Send one notification when due, then flag overdue if unfinished; do not repeat the overdue notification. A new Engine cycle creates a new task, retaining prior completed tasks.
- **Custom task reminder:** One due-time notification, then an overdue flag without repeat notifications.
- **Engine sync:** A changed date updates its matching open system-generated task and reminder schedule. A completed task is not reopened or changed by a later date edit. A new milestone or portal cycle is represented by a separate task.
- **Manager change:** When Engine changes the property’s Marketplace Manager, reassign open check-in and portal-rotation tasks to the new manager. Do not rewrite completed history.
- **Property lifecycle:** An inactive/sold/withdrawn property’s existing task history stays accessible; its open tasks remain visible and actionable until Done.
- **Comments and notes:** Property notes and property/task comments are shared with Flyp members who can access the property. Notes are property-level; comment threads can be at property and task level.
- **Comment notifications:** A property comment by another person notifies its assigned Marketplace Manager(s); a task comment by another person notifies its assignee. @mentions notify the mentioned member in either thread. No broad team-wide comment alert and no self-notification.
- **Assignment notifications:** Notify the new assignee when a task is assigned or reassigned. Do not notify for status changes by default.
- **Notification read state:** Read notifications leave the unread list and remain accessible in All notifications history. Selecting a notification opens its linked property or task.
- **Source of truth:** Engine is authoritative for properties, assigned managers, check-in dates, portal-rotation data, and agent/branch information. Task, note, comment, reminder-preference, and notification records belong to this feature.

## 6. AI and Automation Behaviour

- **What is automated vs user-triggered:** Deterministic automation generates and syncs check-in/portal tasks, assigns them from Engine property ownership, evaluates due/overdue state, and creates configured notifications. Flyp members manually create custom tasks, update task status, edit/reassign tasks, write notes/comments, and perform property or portal changes in Engine.
- **Model/prompt responsibilities:** N/A. No AI behavior is in scope for the MVP.
- **Inputs the automation receives:** Engine property identifiers/status, current Marketplace Manager, check-in milestone dates, portal-rotation cycle/date/current access data, and agent/branch access and acceptance records; plus feature-owned task, reminder, comment, mention, and notification data.
- **Output format and where it surfaces:** Property-linked tasks, overdue/priority flags, and in-Engine notifications with deep links to the relevant property or task.
- **Human review / confirmation step:** A human performs and completes the check-in/portal-rotation task. The feature does not execute business changes in Engine.
- **Fallback behaviour:** Do not guess or fabricate missing Engine values. Suppress generation when a required source field is unavailable and surface a clear data-unavailable state for investigation. The exact error treatment should follow Engine conventions.
- **Cost / rate limits:** N/A for AI. Notification volume should be bounded by the reminder rules and idempotent per event.
- **Data sent to third parties:** No external notification provider is in scope. All notifications are in-Engine. No AI or external service receives property/task content as part of the MVP.

## 7. Edge Cases and Failure Handling

| Scenario | Expected behaviour |
| --- | --- |
| Empty input / first run | Show properties and tasks available from Engine; show a clear empty state when a property has no tasks. |
| Partial or malformed Engine data | Do not invent agent, branch, manager, or due-date values. Mark the affected information unavailable and report the integration/data issue. |
| Duplicate or repeated automation event | Use stable Engine property + milestone/cycle identifiers to avoid duplicate generated tasks and notifications. |
| External service fails | No external service is required for MVP. If Engine data cannot be reached, show an error/stale-data indication and retry according to Engine integration conventions. |
| AI returns invalid output | N/A; no AI. |
| Permission denied | Enforce Engine access; do not show properties, comments, notes, tasks, or notification targets to unauthorized users. |
| Concurrent edits by two users | Preserve the latest valid task state and record creator separately from current assignee. Avoid duplicate generated tasks. Conflict-resolution details follow Engine conventions. |
| Very large volume of data | Paginate or load incrementally using Engine conventions; notification read state and task history must not require loading all records at once. |
| Offline / connection lost | Show that data may be stale and avoid claiming that a task update or comment succeeded until confirmed by the backend. Offline editing is not required for MVP. |
| User abandons mid-flow | Do not create a task or comment until the user submits it. |
| Due date changes in Engine | Update the matching open generated task and its reminder schedule. Do not reopen or retime a Done task. |
| New check-in/rotation cycle | Create a separate task for the new milestone/cycle; retain the prior task and its completion history. |
| Assigned Marketplace Manager changes | Reassign open generated check-in/rotation tasks to the new Engine assignee; retain completed task history. |
| Property becomes inactive | Keep the property’s task history accessible and unfinished tasks visible/actionable. |
| Reminder permission/settings | Notifications are in-Engine; no browser or OS notification permission is needed. |
| Task has no due date | Keep it out of date-specific groups and show it in “No due date”; it cannot become overdue until a due date exists. |
| User comments on own property/task | Do not notify the author about their own comment. Notify the assigned person only for comments made by someone else; mentions still notify the mentioned recipient. |

## 8. Data Requirements

- **Entities and key fields:**
  - **Property reference:** Engine property ID/code, address/display label, property status, assigned Marketplace Manager(s), links to Engine detail page. Engine remains authoritative; avoid duplicating fields not needed for this feature.
  - **Task:** ID, property ID, title, type (custom/check-in/portal rotation), Engine source event/milestone/cycle ID where applicable, due date/time, status, priority flag, creator ID, assignee ID, generated/manual indicator, created/updated timestamps, completion timestamp, overdue state or derivation inputs.
  - **Reminder preferences:** Property ID, advance offsets, due-date reminder enabled/disabled, overdue cadence, updated by/at. Shared per property for check-ins.
  - **Property note:** ID, property ID, author ID, content, created/updated timestamps.
  - **Comment:** ID, property ID, optional task ID, author ID, body, created timestamp. A null task ID denotes a property-level comment.
  - **Mention:** Comment ID, mentioned member ID; used to generate notification recipients.
  - **Notification:** ID, recipient ID, event type, actor ID where relevant, linked property/task/comment ID, created timestamp, read timestamp.
- **Relationships:** Each task belongs to one Engine property; each task has one creator and one current assignee; task comments belong to a property and optionally a task; notifications belong to a recipient and link to the relevant property/task.
- **Validation rules:** A task requires a property, non-empty title, valid status, and valid Flyp creator/assignee. A custom task may omit due date. System-generated task date and cycle identity are sourced from Engine. Only Flyp members with Engine access can be assigned, mentioned, or receive notifications.
- **Retention and deletion:** Completed tasks and read notifications remain in history. No permanent task/comment deletion policy has been settled; see assumptions. Follow Engine retention/security policy for feature-owned data.
- **Import / export:** No ClickUp import or export is in MVP. Existing property/agent data is read from Engine.
- **Backup / recovery expectations:** Feature-owned records should be covered by Engine’s existing backup and recovery practices; confirm during implementation discovery.

## 9. UX Expectations

- **Key screens and states:**
  - Main task view: tasks grouped by due date, including “No due date.”
  - Priority view: all unfinished overdue and manually prioritized tasks.
  - Property view: Engine property context, related tasks, shared notes, property comments, agent/branch information, and a button/link to open the property in Engine.
  - Task view: title, property, status, assignee, creator, due date, priority, task comments, and source indicator for Engine-generated tasks.
  - Notification center: unread count/list, All notifications history, mark-as-read, and direct links.
  - Empty, loading, error, stale-data, and permission-denied states should be clear.
- **Interaction principles:** Property-first navigation; completing a task should be quick; Engine-owned data should be recognizable as read-only; task completion is not a substitute for completing the business action in Engine.
- **Accessibility and device targets:** Match Engine’s accessibility and responsive behavior. Support keyboard navigation, accessible labels, visible focus states, and screen-reader announcements for notification/read-state changes.
- **Latency expectations:** Follow Engine’s existing performance conventions; routine task changes should feel immediate and confirm success.
- **Tone / copy style:** Clear, concise, operational language. Use explicit labels such as To-do, In progress, Done, Priority, and Overdue.

## 10. MVP Scope

- Engine-embedded, Flyp-only feature with inherited authentication and property access.
- Property-centric task list, date grouping, Priority view, task statuses, optional custom-task due dates, manual priority, creator and assignee records, reassignment, and team-wide task updates.
- Engine-generated check-in and portal-rotation tasks with property assignment, date sync, manager reassignment, cycle history, and overdue logic.
- Shared property notes and property/task comments with @mentions.
- In-Engine notifications for configured due reminders, assignments, comments, and mentions; persistent read/unread history and deep links.
- Read-only Engine agent/branch details and a link to edit them in Engine.

## 11. Explicit Non-Goals

- Replacing Flyp Engine or ClickUp wholesale.
- Editing property, check-in, portal-access, agent, or branch source data inside the new feature.
- Granting/removing portal access or choosing the next portal agent.
- Duplicating check-in feedback forms or recording business feedback already handled in Engine.
- Tasks without a property, nested subtasks, or a standalone general-task area.
- Agent/owner/customer access.
- Email, SMS, push, or operating-system notifications in the initial version.
- AI-generated tasks, summaries, or inferred agent engagement.

## 12. Technical Approach

- **Stack:** Use the existing Engine web application’s stack and conventions; the Engine codebase and integration contracts must be inspected before implementation. Do not introduce a second frontend stack without a technical need.
- **Data storage:** Reuse Engine’s property IDs and source data. Store task, note, comment, reminder, and notification entities as feature-owned records in the Engine environment, linked to property IDs. Do not write these into ClickUp or overwrite canonical Engine property fields.
- **Hosting / deployment:** Delivered as a section/feature inside Engine, using its existing deployment and monitoring.
- **Auth and permissions:** Inherit Engine authentication and Flyp access. Restrict every read/write and notification to authorized Flyp members.
- **Integrations:** Read Engine property, check-in, portal-rotation, Marketplace Manager, and agent/branch data. Deep-link to existing Engine pages for source-data edits.
- **Consequences worth knowing:** The actual Engine schema/API must be verified, especially the portal-rotation date/cycle identifier, check-in milestone identifiers, current Marketplace Manager, and agent invitation/acceptance fields. Reliable task generation requires stable event or milestone IDs and idempotent synchronization. Any custom fields remain inside this feature even though it is presented within Engine.

## 13. Implementation Phases

1. **Phase 1 — Data and access discovery:** Inspect Engine code, schemas/APIs, access rules, property lifecycle states, and available check-in/portal/agent fields; confirm integration and stable IDs.
2. **Phase 2 — Property tasks:** Implement property-linked custom tasks, creator/assignee, statuses, due dates, priority, date and Priority views, and inactive-property history.
3. **Phase 3 — Engine-generated tasks:** Add check-in and portal cycle generation, due-date/manager synchronization, overdue behavior, configurable check-in reminders, and duplicate prevention.
4. **Phase 4 — Collaboration and notifications:** Add property notes, property/task comments, @mentions, assignment/comment/reminder notifications, notification history/read state, and deep links.
5. **Phase 5 — Pilot and hardening:** Validate against representative Engine properties and cycles, check permissions and edge cases, then pilot with Flyp members before broad rollout.

## 14. Acceptance Criteria

- [ ] Only Flyp members with Engine access can open the feature or receive its data/notifications.
- [ ] A custom task cannot be saved without a property and title; it may have no due date.
- [ ] A custom task defaults to its creator as assignee and can be assigned to any Flyp member.
- [ ] The creator remains recorded after edits or reassignment.
- [ ] Any authorized Flyp member can change task details, assignment, and status.
- [ ] Task statuses are exactly To-do, In progress, and Done.
- [ ] The main task list groups tasks by due date and includes No due date.
- [ ] The Priority view includes every unfinished overdue task and every unfinished priority task, including tasks that satisfy both conditions only once.
- [ ] Each Engine check-in milestone creates one task under the correct property and assigned manager.
- [ ] Each distinct four-week portal-rotation cycle creates one task under the correct property and assigned manager.
- [ ] Reprocessing the same Engine event does not duplicate its task or reminder notification.
- [ ] A change to the Engine due date updates its matching open generated task and future reminders.
- [ ] A completed generated task is not reopened by an edit to its source date; a new milestone/cycle creates a new task.
- [ ] An Engine Marketplace Manager change reassigns open generated tasks to the new manager and leaves completed history unchanged.
- [ ] Completing a check-in task records completion only in this feature; it does not create a second feedback form or change Engine business data.
- [ ] Completing a portal-rotation task does not change portal access in Engine.
- [ ] Check-in reminders default to two days before, on the due date, and once when overdue; changing a property’s settings applies to its check-in tasks and is shared with its current assignee.
- [ ] Portal-rotation and custom-task reminders notify once at due time and then show overdue without repeat notifications.
- [ ] Any overdue task remains flagged until it is Done or its applicable Engine schedule is updated.
- [ ] Property notes and property/task comments are visible to Flyp members with access to the property.
- [ ] A property comment by another person notifies the assigned Marketplace Manager(s); a task comment by another person notifies the assignee; neither notifies its author.
- [ ] @mentions notify the mentioned Flyp member, including when they are not the assigned manager or task assignee.
- [ ] Assigning or reassigning a task notifies the new assignee; status changes do not generate notifications by default.
- [ ] Notifications appear in the in-Engine center, link to the correct property/task, can be marked read, leave the unread list when read, and remain in All notifications history.
- [ ] Agent/branch data is read-only in the feature and the Engine link opens the relevant source page.
- [ ] An inactive property’s task history remains accessible and unfinished tasks remain visible/actionable.

## 15. Assumptions Made

- [ ] The feature uses Engine’s existing authentication, authorization, design system, and technical stack; implementation must verify these in the Engine repository.
- [ ] “One notification at due time” for custom tasks and portal rotations means one in-Engine event per task/cycle; if a notification is unread, it remains in the inbox rather than being repeatedly recreated.
- [ ] The Priority view and date-grouped active task view exclude Done tasks by default; completed work remains available from the property history.
- [ ] System-generated due dates and source-cycle identity are controlled by Engine. If the UI permits general task edits, Engine remains authoritative for these fields on generated tasks.
- [ ] A new portal cycle is identified by a stable Engine cycle/event ID or a validated change in Engine’s cycle data; simply changing a date on the same open cycle updates that task rather than creating a duplicate.
- [ ] Open generated tasks are assigned from the current Engine Marketplace Manager. Manual reassignment of a generated task may be superseded by a later Engine manager-change sync; confirm whether generated-task assignees should instead be locked to Engine.
- [ ] The exact users authorized to change shared per-property check-in reminder settings have not been specified. Recommended default: the assigned Marketplace Manager(s), with the setting visible to the whole team.
- [ ] Whether new tasks may be created for inactive properties was not specified. Recommended default: allow it for Flyp members who can access the property, while retaining the confirmed behavior that existing open tasks stay visible.
- [ ] Task deletion/cancellation policy was not specified. Recommended default: avoid hard deletion in the MVP; retain an audit-safe history and settle any cancellation/archive behavior during implementation design.
- [ ] The landing view’s default scope (all team tasks vs. tasks assigned to the signed-in user) was not explicitly specified. Recommended default: show tasks assigned to the current user, with filters/views to access the team’s tasks.
- [ ] Exact date buckets, search/filter details, notification retention duration, and task title/description fields can follow Engine conventions unless product review identifies a need to customize them.
- [ ] The user believes Engine already contains portal-rotation dates/current access data and agent/branch invitation/acceptance data; those fields and their reliability must be verified before implementation.
