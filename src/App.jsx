import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Avatar, Badge, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, Drawer,
  DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, Menu, MenuItem,
  Paper, Popover, Select, Snackbar, Stack, Switch, Tab, Tabs, TextField, Tooltip, Typography,
} from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';
import ApartmentRounded from '@mui/icons-material/ApartmentRounded';
import AssignmentTurnedInRounded from '@mui/icons-material/AssignmentTurnedInRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CircleRounded from '@mui/icons-material/CircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import FlagRounded from '@mui/icons-material/FlagRounded';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import HomeWorkOutlined from '@mui/icons-material/HomeWorkOutlined';
import InboxRounded from '@mui/icons-material/InboxRounded';
import InsertCommentOutlined from '@mui/icons-material/InsertCommentOutlined';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import {
  currentUserId, initialComments, initialNotifications, initialNotes, initialTasks, properties, teamMembers,
} from './data.js';

const STORAGE_KEY = 'flyp-property-tasks-demo-v1';
const STATUSES = ['To-do', 'In progress', 'Done'];
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const todayKey = () => dateKey(new Date());
const localDate = (date) => date ? new Date(`${date}T12:00:00`) : null;
const dateLabel = (date, options = { weekday: 'short', month: 'short', day: 'numeric' }) => date ? localDate(date).toLocaleDateString('en-GB', options) : 'No due date';
const isOverdue = (task) => task.status !== 'Done' && Boolean(task.dueDate) && task.dueDate < todayKey();
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const memberById = (id) => teamMembers.find((member) => member.id === id);
const propertyById = (id) => properties.find((property) => property.id === id);
const taskDisplayName = (task) => {
  const code = propertyById(task.propertyId)?.code;
  return code ? `${code} | ${task.title}` : task.title;
};
const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function initialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.tasks && parsed?.comments && parsed?.notifications && parsed?.notes) return parsed;
    }
  } catch { /* use a clean demo state */ }
  return {
    tasks: initialTasks,
    comments: initialComments,
    notes: initialNotes,
    notifications: initialNotifications,
    reminderPrefs: Object.fromEntries(properties.map((property) => [property.id, property.checkInPrefs])),
  };
}

function MemberAvatar({ memberId, size = 28, sx = {} }) {
  const member = memberById(memberId);
  return (
    <Avatar
      aria-label={member?.name || 'Flyp system'}
      sx={{ width: size, height: size, fontSize: size * 0.36, bgcolor: member?.color || '#a4a7b3', fontWeight: 700, ...sx }}
    >
      {member?.initials || 'F'}
    </Avatar>
  );
}

function StatusChip({ status }) {
  const config = {
    'To-do': { color: '#111111', bg: '#DFFF91', dot: '#111111' },
    'In progress': { color: '#FFFFFF', bg: '#8DBAF4', dot: '#FFFFFF' },
    Done: { color: '#333438', bg: '#E8E8EA', dot: '#77797E' },
  }[status] || { color: '#111111', bg: '#DFFF91', dot: '#111111' };
  return <Chip size="small" icon={<CircleRounded sx={{ fontSize: '8px !important', color: `${config.dot} !important` }} />} label={status} sx={{ height: 25, bgcolor: config.bg, color: config.color, '& .MuiChip-label': { px: 1, fontSize: 11.5 } }} />;
}

function Sidebar({ page, onNavigate, onCreate, unreadCount, mobile = false, onClose }) {
  const navItems = [
    { id: 'tasks', label: 'My tasks', icon: <TaskAltRounded /> },
    { id: 'priority', label: 'Priority', icon: <FlagRounded />, badge: null },
    { id: 'properties', label: 'Properties', icon: <HomeWorkOutlined /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsNoneRounded />, badge: unreadCount || null },
  ];
  return (
    <Box className={mobile ? 'sidebar-inner mobile' : 'sidebar-inner'}>
      <Box className="brand-row">
        <Box className="brand-mark"><span>flyp</span></Box>
        <Box>
          <Typography className="brand-heading">Marketplace</Typography>
          <Typography sx={{ fontSize: 9, color: 'text.secondary', mt: .2, letterSpacing: '.08em' }}>PROPERTY OPERATIONS</Typography>
        </Box>
        {mobile && <IconButton aria-label="Close navigation" onClick={onClose} sx={{ ml: 'auto' }}><CloseRounded /></IconButton>}
      </Box>
      <Button className="sidebar-create" fullWidth variant="contained" startIcon={<AddRounded />} onClick={() => { onCreate(); onClose?.(); }}>New task</Button>
      <Typography className="sidebar-label">WORKSPACE</Typography>
      <Stack spacing={.45}>
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => { onNavigate(item.id); onClose?.(); }}
            className={`nav-item ${page === item.id ? 'selected' : ''}`}
            startIcon={item.icon}
            endIcon={item.badge ? <Box className="nav-badge">{item.badge}</Box> : null}
            fullWidth
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box className="sidebar-bottom">
        <Paper variant="outlined" className="engine-card">
          <Box className="engine-card-icon"><CheckRounded sx={{ fontSize: 15 }} /></Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={700} fontSize={12}>Flyp Engine</Typography>
            <Typography color="text.secondary" fontSize={10.5}>Demo workspace</Typography>
          </Box>
          <CircleRounded sx={{ ml: 'auto', fontSize: 8, color: '#49a985' }} />
        </Paper>
        <Button className="profile-button" fullWidth startIcon={<MemberAvatar memberId={currentUserId} size={32} />} endIcon={<MoreHorizRounded />}>
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <Typography fontSize={12} fontWeight={700} color="text.primary">Seb O’Hara</Typography>
            <Typography fontSize={10.5} color="text.secondary">Marketplace Manager</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

function Topbar({ onMenu, onNotifications, unreadCount }) {
  return (
    <Box className="topbar">
      <IconButton className="mobile-menu" aria-label="Open navigation" onClick={onMenu}><MenuRounded /></IconButton>
      <Box className="breadcrumbs"><Typography fontWeight={800}>Marketplace</Typography><span>/</span><Typography fontWeight={800}>Property operations</Typography></Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
        <Tooltip title="Notifications">
          <IconButton aria-label={`${unreadCount} unread notifications`} onClick={onNotifications} sx={{ color: '#111111' }}>
            <Badge badgeContent={unreadCount} max={9} sx={{ '& .MuiBadge-badge': { bgcolor: '#8DBAF4', color: '#111111', fontWeight: 800 } }}><NotificationsNoneRounded /></Badge>
          </IconButton>
        </Tooltip>
        <MemberAvatar memberId={currentUserId} size={33} />
      </Stack>
    </Box>
  );
}

function PageHeading({ eyebrow, title, description, actions }) {
  return (
    <Box className="page-heading">
      <Box>
        {eyebrow && <Typography className="eyebrow">{eyebrow}</Typography>}
        <Typography variant="h1" component="h1">{title}</Typography>
        {description && <Typography color="text.secondary" fontSize={13.5} mt={.5}>{description}</Typography>}
      </Box>
      {actions && <Box className="heading-actions">{actions}</Box>}
    </Box>
  );
}

function TaskCommentsPopover({ task, comments, anchorEl, onClose, onAddComment }) {
  const [draft, setDraft] = useState('');
  const taskComments = comments.filter((comment) => comment.taskId === task.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onAddComment({ propertyId: task.propertyId, taskId: task.id, body: draft.trim() });
    setDraft('');
  };
  return (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose} onClick={(event) => event.stopPropagation()} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }} PaperProps={{ className: 'task-comment-popover-paper', onClick: (event) => event.stopPropagation() }}>
      <Box component="form" className="task-comment-popover" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-label={`Comments for ${taskDisplayName(task)}`}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}><Typography fontSize={13} fontWeight={800}>Task comments</Typography><Typography className="task-comment-popover-title">{taskDisplayName(task)}</Typography></Box>
          <IconButton size="small" onClick={(event) => { event.stopPropagation(); onClose(); }} aria-label="Close comments"><CloseRounded fontSize="small" /></IconButton>
        </Stack>
        <Box className="task-comment-popover-list" aria-live="polite">
          {taskComments.map((comment) => <MessageCard key={comment.id} item={comment} />)}
          {!taskComments.length && <Box className="comment-empty"><InsertCommentOutlined /><Typography fontSize={11.5} color="text.secondary">No comments yet. Start the conversation.</Typography></Box>}
        </Box>
        <Box className="task-comment-popover-composer"><TextField fullWidth multiline minRows={2} maxRows={3} size="small" placeholder="Write a comment… Use @name to mention someone." value={draft} onChange={(event) => setDraft(event.target.value)} inputProps={{ 'aria-label': 'Write a task comment' }} /><Button type="submit" variant="contained" size="small" disabled={!draft.trim()}>Send</Button></Box>
        <Typography fontSize={10} color="text.secondary" mt={.8}>The task assignee is notified. Use @name to mention a teammate.</Typography>
      </Box>
    </Popover>
  );
}

function TaskRow({ task, comments = [], onOpen, onToggle, onUpdate, onAddComment, enableCommentPopover = false }) {
  const [commentAnchor, setCommentAnchor] = useState(null);
  const commentCount = comments.filter((comment) => comment.taskId === task.id).length;
  const overdue = isOverdue(task);
  const stopRowClick = (event) => event.stopPropagation();
  const openComments = (event) => {
    stopRowClick(event);
    if (enableCommentPopover) setCommentAnchor(event.currentTarget);
    else onOpen(task.id);
  };
  return (
    <Box className="task-row task-table-row" onClick={() => onOpen(task.id)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpen(task.id); } }}>
      <Box className="task-name-cell">
        <Checkbox
          checked={task.status === 'Done'}
          onClick={stopRowClick}
          onChange={(event) => onToggle(task.id, event.target.checked)}
          inputProps={{ 'aria-label': task.status === 'Done' ? `Reopen ${taskDisplayName(task)}` : `Complete ${taskDisplayName(task)}` }}
          className="task-check"
          size="small"
        />
        <Stack direction="row" spacing={.75} alignItems="center" useFlexGap flexWrap="wrap" className="task-name-stack">
          <Typography className={`task-title ${task.status === 'Done' ? 'is-done' : ''}`}>{taskDisplayName(task)}</Typography>
          {task.generated && <Chip size="small" label="Engine" className="engine-chip" />}
        </Stack>
      </Box>
      <Box className={`task-date-cell ${overdue ? 'is-overdue' : ''}`} onClick={stopRowClick}>
        {task.generated ? (
          <Tooltip title="This due date is managed by Engine">
            <Box className="task-date-display engine-managed"><Typography>{task.dueDate ? dateLabel(task.dueDate) : 'No due date'}</Typography><span>Engine</span></Box>
          </Tooltip>
        ) : (
          <Box className="task-date-display editable-date"><Typography>{task.dueDate ? dateLabel(task.dueDate) : 'Set due date'}</Typography><CalendarMonthRounded /><input type="date" value={task.dueDate || ''} aria-label={`Change due date for ${taskDisplayName(task)}`} onChange={(event) => onUpdate(task.id, { dueDate: event.target.value || null })} /></Box>
        )}
      </Box>
      <Box className="task-comments-cell">
        <Tooltip title={enableCommentPopover ? 'View and add comments' : 'Open task comments'}><Button className="task-comments-button" size="small" aria-label={`${commentCount} comments`} aria-haspopup={enableCommentPopover ? 'dialog' : undefined} aria-expanded={enableCommentPopover ? Boolean(commentAnchor) : undefined} onClick={openComments} startIcon={<InsertCommentOutlined />}>{commentCount}</Button></Tooltip>
        {enableCommentPopover && <TaskCommentsPopover task={task} comments={comments} anchorEl={commentAnchor} onClose={() => setCommentAnchor(null)} onAddComment={onAddComment} />}
      </Box>
      <Box className="task-priority-cell">
        <Button className={`task-priority-toggle ${task.priority ? 'is-priority' : ''}`} onClick={(event) => { stopRowClick(event); onUpdate(task.id, { priority: !task.priority }); }} startIcon={<FlagRounded />} aria-label={task.priority ? 'Remove priority' : 'Mark priority'}>{task.priority ? 'Priority' : 'Normal'}</Button>
      </Box>
      <Box className="task-status-cell" onClick={stopRowClick}>
        <Select size="small" variant="standard" disableUnderline value={task.status} onChange={(event) => onUpdate(task.id, { status: event.target.value })} renderValue={(value) => <StatusChip status={value} />} inputProps={{ 'aria-label': `Change status for ${taskDisplayName(task)}` }} MenuProps={{ PaperProps: { sx: { minWidth: 140 } } }}>
          {STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
        </Select>
      </Box>
      <Box className="task-engine-cell" onClick={stopRowClick}>
        {task.generated ? <Button size="small" className="engine-link-button" onClick={() => window.dispatchEvent(new CustomEvent('flyp-demo-toast', { detail: 'Engine links will be connected during integration setup.' }))} endIcon={<ArrowOutwardRounded />}>Open</Button> : <Typography color="text.secondary">—</Typography>}
      </Box>
      <Box className="task-assignee-cell" onClick={stopRowClick}>
        <Select size="small" variant="standard" disableUnderline value={task.assigneeId} onChange={(event) => onUpdate(task.id, { assigneeId: event.target.value })} renderValue={(memberId) => { const selected = memberById(memberId); return <Box className="assignee-inline"><MemberAvatar memberId={memberId} size={25} /><Typography className="assignee-name">{selected?.name?.split(' ')[0] || 'Unassigned'}</Typography></Box>; }} inputProps={{ 'aria-label': `Change assignee for ${taskDisplayName(task)}` }} MenuProps={{ PaperProps: { sx: { minWidth: 190 } } }}>
          {teamMembers.map((member) => <MenuItem key={member.id} value={member.id}><Box className="assignee-inline"><MemberAvatar memberId={member.id} size={23} /><Typography fontSize={12}>{member.name}</Typography></Box></MenuItem>)}
        </Select>
      </Box>
    </Box>
  );
}

function TaskList({ tasks, comments = [], onOpenTask, onToggleTask, onUpdateTask, onAddComment, enableCommentPopover = false, completedView = false, emptyTitle = 'You’re all caught up', emptyText = 'New work will show here when it’s assigned to you.' }) {
  const grouped = useMemo(() => {
    const buckets = new Map();
    const completedAt = (task) => task.completedAt || task.updatedAt || task.createdAt || '';
    const sorted = [...tasks].sort((a, b) => {
      if (completedView) return completedAt(b).localeCompare(completedAt(a));
      if (!a.dueDate && !b.dueDate) return a.title.localeCompare(b.title);
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
    sorted.forEach((task) => {
      const key = completedView ? completedAt(task).slice(0, 10) || 'unknown' : !task.dueDate ? 'none' : isOverdue(task) ? 'overdue' : task.dueDate;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(task);
    });
    return [...buckets.entries()];
  }, [tasks, completedView]);

  if (!tasks.length) return (
    <Paper className="empty-state" variant="outlined">
      <Box className="empty-icon"><TaskAltRounded /></Box>
      <Typography fontWeight={750} fontSize={15}>{emptyTitle}</Typography>
      <Typography color="text.secondary" fontSize={13} mt={.5}>{emptyText}</Typography>
    </Paper>
  );

  return (
    <Stack spacing={2.25}>
      {grouped.map(([date, items]) => {
        const overdueGroup = !completedView && date === 'overdue';
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const label = completedView
          ? date === todayKey() ? 'Completed today' : date === dateKey(yesterday) ? 'Completed yesterday' : date === 'unknown' ? 'Completed' : `Completed ${dateLabel(date, { month: 'long', day: 'numeric' })}`
          : date === 'none' ? 'No due date' : overdueGroup ? 'Overdue' : date === todayKey() ? 'Today' : date === dateKey(tomorrow) ? 'Tomorrow' : dateLabel(date, { weekday: 'long', month: 'long', day: 'numeric' });
        return (
          <Box key={date}>
            <Box className="group-heading">
              <Typography fontSize={12} fontWeight={750} color={overdueGroup ? 'error.main' : 'text.primary'}>{overdueGroup ? 'Overdue' : label}</Typography>
              <Typography fontSize={11} color="text.secondary">{items.length} {items.length === 1 ? 'task' : 'tasks'}</Typography>
              <Divider sx={{ flex: 1, ml: 1.25 }} />
            </Box>
            <Paper className="task-list-card" variant="outlined">
              <Box className="task-table-header"><Typography>Name</Typography><Typography>Due date</Typography><Typography>Comments</Typography><Typography>Priority</Typography><Typography>Status</Typography><Typography>Engine Link</Typography><Typography>Assignee</Typography></Box>
              {items.map((task) => <TaskRow key={task.id} task={task} comments={comments} onOpen={onOpenTask} onToggle={onToggleTask} onUpdate={onUpdateTask} onAddComment={onAddComment} enableCommentPopover={enableCommentPopover} />)}
            </Paper>
          </Box>
        );
      })}
    </Stack>
  );
}

function SummaryCard({ icon, label, value, detail, tone = 'purple' }) {
  return (
    <Paper className="summary-card" variant="outlined">
      <Box className={`summary-icon ${tone}`}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography fontSize={12} color="text.secondary" fontWeight={600}>{label}</Typography>
        <Stack direction="row" spacing={.8} alignItems="baseline" mt={.25}>
          <Typography fontFamily={'"Roboto Slab", Georgia, serif'} fontSize={24} fontWeight={800} letterSpacing="-.05em" lineHeight={1.1}>{value}</Typography>
          <Typography fontSize={11} color="text.secondary">{detail}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

function TaskPage({ page, tasks, comments, onOpenTask, onToggleTask, onUpdateTask, onAddComment, onCreate, search, setSearch, scope, setScope }) {
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [dueFilter, setDueFilter] = useState('all');
  const [taskView, setTaskView] = useState('open');
  const isPriority = page === 'priority';
  const isCompletedView = !isPriority && taskView === 'completed';
  const openTasks = tasks.filter((task) => task.status !== 'Done');
  const completedTasks = tasks.filter((task) => task.status === 'Done');
  const scopedOpenTasks = !isPriority && scope === 'mine' ? openTasks.filter((task) => task.assigneeId === currentUserId) : openTasks;
  const scopedCompletedTasks = scope === 'mine' ? completedTasks.filter((task) => task.assigneeId === currentUserId) : completedTasks;
  let visible = isPriority
    ? openTasks.filter((task) => isOverdue(task) || task.priority)
    : isCompletedView ? scopedCompletedTasks : scopedOpenTasks;
  if ((isPriority || scope === 'team') && assigneeFilter !== 'all') {
    visible = visible.filter((task) => task.assigneeId === (assigneeFilter === 'mine' ? currentUserId : assigneeFilter));
  }
  if (priorityOnly) visible = visible.filter((task) => task.priority);
  if (!isCompletedView && dueFilter === 'overdue') visible = visible.filter(isOverdue);
  if (!isCompletedView && dueFilter === 'no-date') visible = visible.filter((task) => !task.dueDate);
  if (!isCompletedView && dueFilter === 'next-7') {
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
    visible = visible.filter((task) => task.dueDate && task.dueDate >= todayKey() && task.dueDate <= dateKey(nextWeek));
  }
  if (!isCompletedView && statusFilter !== 'All statuses') visible = visible.filter((task) => task.status === statusFilter);
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch) visible = visible.filter((task) => {
    const property = propertyById(task.propertyId);
    return `${task.title} ${property?.address} ${property?.city} ${property?.code}`.toLowerCase().includes(normalizedSearch);
  });

  const overdueCount = openTasks.filter(isOverdue).length;
  const dueToday = openTasks.filter((task) => task.dueDate === todayKey()).length;
  const prioritizedCount = openTasks.filter((task) => isOverdue(task) || task.priority).length;

  return (
    <>
      <PageHeading
        eyebrow="YOUR WORKSPACE"
        title={isPriority ? 'Priority' : 'My tasks'}
        description={isPriority ? 'Overdue and high-priority work that needs attention.' : isCompletedView ? 'A history of work completed across your properties.' : 'A clear view of the work moving your properties forward.'}
        actions={<Button variant="contained" startIcon={<AddRounded />} onClick={onCreate}>New task</Button>}
      />
      {!isPriority && !isCompletedView && <Box className="summary-grid">
        <SummaryCard icon={<TaskAltRounded />} label="Open tasks" value={scope === 'mine' ? openTasks.filter((task) => task.assigneeId === currentUserId).length : openTasks.length} detail={scope === 'mine' ? 'assigned to you' : 'across the team'} />
        <SummaryCard icon={<EventAvailableRounded />} label="Due today" value={scope === 'mine' ? openTasks.filter((task) => task.assigneeId === currentUserId && task.dueDate === todayKey()).length : dueToday} detail="across your properties" tone="green" />
        <SummaryCard icon={<WarningAmberRounded />} label="Need attention" value={scope === 'mine' ? openTasks.filter((task) => task.assigneeId === currentUserId && isOverdue(task)).length : overdueCount} detail={prioritizedCount ? 'overdue or marked priority' : 'all on track'} tone="amber" />
      </Box>}
      <Box className="list-toolbar">
        {!isPriority && <Box className="task-view-controls">
          <Tabs value={scope} onChange={(_, value) => setScope(value)} className="scope-tabs" aria-label="Task assignment scope">
            <Tab value="mine" label="Assigned to me" />
            <Tab value="team" label="Team tasks" />
          </Tabs>
          <Tabs value={taskView} onChange={(_, value) => { setTaskView(value); setDueFilter('all'); setStatusFilter('All statuses'); }} className="task-view-tabs" aria-label="Task status view">
            <Tab value="open" label={`Open (${scopedOpenTasks.length})`} />
            <Tab value="completed" label={`Completed (${scopedCompletedTasks.length})`} />
          </Tabs>
        </Box>}
        <Box className="filters-row">
          <TextField
            size="small" placeholder="Search tasks or properties" value={search} onChange={(event) => setSearch(event.target.value)}
            className="task-search" inputProps={{ 'aria-label': 'Search tasks or properties' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: '#9297a5' }} /></InputAdornment> }}
          />
          {!isCompletedView && <FormControl size="small" className="status-filter">
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} inputProps={{ 'aria-label': 'Filter by task status' }}>
              <MenuItem value="All statuses">All statuses</MenuItem>
              {STATUSES.filter((status) => status !== 'Done').map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </Select>
          </FormControl>}
          <Tooltip title="Filter tasks"><IconButton aria-label="Filter tasks" className="filter-icon" onClick={(event) => setFilterAnchor(event.currentTarget)}><Badge badgeContent={Number(assigneeFilter !== 'all') + Number(priorityOnly) + Number(!isCompletedView && dueFilter !== 'all')} color="primary"><TuneRounded /></Badge></IconButton></Tooltip>
        </Box>
      </Box>
      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)} PaperProps={{ sx: { width: 270, p: 1.7, border: '1px solid #eceef2', boxShadow: '0 12px 35px #11111114' } }}>
        <Stack spacing={1.7}>
          <Box><Typography className="field-label">Assignee</Typography><FormControl size="small" fullWidth disabled={!isPriority && scope === 'mine'}><Select value={isPriority || scope === 'team' ? assigneeFilter : 'mine'} onChange={(event) => setAssigneeFilter(event.target.value)} inputProps={{ 'aria-label': 'Filter by assignee' }}><MenuItem value="all">Everyone</MenuItem><MenuItem value="mine">Assigned to me</MenuItem>{teamMembers.map((member) => <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>)}</Select></FormControl></Box>
          {!isCompletedView && <Box><Typography className="field-label">Due date</Typography><FormControl size="small" fullWidth><Select value={dueFilter} onChange={(event) => setDueFilter(event.target.value)} inputProps={{ 'aria-label': 'Filter by due date' }}><MenuItem value="all">Any date</MenuItem><MenuItem value="overdue">Overdue</MenuItem><MenuItem value="next-7">Due in the next 7 days</MenuItem><MenuItem value="no-date">No due date</MenuItem></Select></FormControl></Box>}
          <FormControlLabel sx={{ ml: -.8, '& .MuiFormControlLabel-label': { fontSize: 12 } }} control={<Checkbox size="small" checked={priorityOnly} onChange={(event) => setPriorityOnly(event.target.checked)} />} label="Manually marked priority only" />
          <Button size="small" onClick={() => { setAssigneeFilter('all'); setPriorityOnly(false); setDueFilter('all'); setStatusFilter('All statuses'); setFilterAnchor(null); }}>Clear filters</Button>
        </Stack>
      </Menu>
      <Box className="list-meta"><Typography fontSize={12} color="text.secondary">{visible.length} {visible.length === 1 ? 'task' : 'tasks'}{isPriority ? ' to focus on' : isCompletedView ? (scope === 'mine' ? ' completed by you' : ' completed across the team') : scope === 'mine' ? ' assigned to you' : ' across the team'}</Typography>{!isCompletedView && <Button size="small" endIcon={<KeyboardArrowDownRounded />} className="sort-button">Due date</Button>}</Box>
      <TaskList tasks={visible} comments={comments} onOpenTask={onOpenTask} onToggleTask={onToggleTask} onUpdateTask={onUpdateTask} onAddComment={onAddComment} enableCommentPopover completedView={isCompletedView} emptyTitle={isPriority ? 'Nothing needs priority right now' : isCompletedView ? 'No completed tasks yet' : 'You’re all caught up'} emptyText={isPriority ? 'Overdue or manually prioritized tasks will appear here.' : isCompletedView ? 'Tasks you complete will appear here.' : 'Create a task for a property or switch to Team tasks to see shared work.'} />
    </>
  );
}

function PropertyList({ tasks, onOpenProperty, search, setSearch, scope, setScope }) {
  const [managerFilter, setManagerFilter] = useState('all');
  const normalizedSearch = search.trim().toLowerCase();
  const myProperties = properties.filter((property) => property.managerId === currentUserId);
  const managerIds = [...new Set(properties.map((property) => property.managerId))];
  const managers = managerIds.map(memberById).filter(Boolean);
  const propertyScope = scope === 'mine' ? myProperties : properties;
  const visibleProperties = propertyScope.filter((property) => {
    const matchesManager = scope !== 'all' || managerFilter === 'all' || property.managerId === managerFilter;
    const matchesSearch = `${property.address} ${property.city} ${property.postcode} ${property.code} ${memberById(property.managerId)?.name || ''}`.toLowerCase().includes(normalizedSearch);
    return matchesManager && matchesSearch;
  });
  return (
    <>
      <PageHeading eyebrow="ENGINE PROPERTIES" title="Properties" description="Your assigned properties, with a separate view of the wider marketplace." actions={<Button variant="outlined" startIcon={<ArrowOutwardRounded />} onClick={() => window.dispatchEvent(new CustomEvent('flyp-demo-toast', { detail: 'Engine connection is not configured in this demo.' }))}>Open Engine</Button>} />
      <Box className="property-controls">
        <Tabs value={scope} onChange={(_, value) => setScope(value)} className="property-scope-tabs" aria-label="Property manager scope">
          <Tab value="mine" label={`My properties (${myProperties.length})`} />
          <Tab value="all" label={`All properties (${properties.length})`} />
        </Tabs>
        <Box className="property-toolbar">
          <TextField size="small" placeholder="Search address, city or property ID" value={search} onChange={(event) => setSearch(event.target.value)} className="property-search" inputProps={{ 'aria-label': 'Search properties' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: '#9297a5' }} /></InputAdornment> }} />
          {scope === 'all' && <FormControl size="small" className="property-manager-filter"><Select value={managerFilter} onChange={(event) => setManagerFilter(event.target.value)} inputProps={{ 'aria-label': 'Filter properties by marketplace manager' }}><MenuItem value="all">All marketplace managers</MenuItem>{managers.map((manager) => <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>)}</Select></FormControl>}
          <Typography color="text.secondary" fontSize={12}>{visibleProperties.length} {visibleProperties.length === 1 ? 'property' : 'properties'}</Typography>
        </Box>
      </Box>
      {visibleProperties.length ? (
        <Box className="property-list">
          <Box className="property-list-header"><Typography>Property</Typography><Typography>Marketplace Manager</Typography><Typography>Status</Typography><Typography>Open</Typography><span /></Box>
          {visibleProperties.map((property) => {
            const openCount = tasks.filter((task) => task.propertyId === property.id && task.status !== 'Done').length;
            const manager = memberById(property.managerId);
            const statusClass = property.status === 'Inactive' ? 'inactive' : property.status === 'Under offer' ? 'under-offer' : '';
            return (
              <Box key={property.id} className="property-row" onClick={() => onOpenProperty(property.id)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpenProperty(property.id); } }}>
                <Box className="property-identity">
                  <Typography className="property-row-code">{property.code}</Typography>
                  <Box className="property-address-block"><Typography className="property-row-address">{property.address}</Typography><Typography className="property-row-location">{property.city} · {property.postcode} · {property.beds} bed {property.propertyType}</Typography></Box>
                </Box>
                <Box className="property-manager-cell"><MemberAvatar memberId={property.managerId} size={25} /><Typography>{manager?.name || 'Unavailable'}</Typography></Box>
                <Box className="property-status-cell"><Chip size="small" label={property.status} className={`property-status ${statusClass}`} /></Box>
                <Box className="property-open-cell"><Typography>{openCount}</Typography><span>open</span></Box>
                <IconButton className="property-row-open" size="small" aria-label={`Open ${property.address}`} onClick={(event) => { event.stopPropagation(); onOpenProperty(property.id); }}><ArrowOutwardRounded sx={{ fontSize: 16 }} /></IconButton>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Paper className="empty-state" variant="outlined"><Typography fontWeight={700}>No properties match</Typography><Typography fontSize={13} color="text.secondary" mt={.5}>Try another search or manager, or view all properties.</Typography></Paper>
      )}
    </>
  );
}

function PropertyDetail({ property, tasks, comments, notes, reminderPrefs, onUpdateReminder, onOpenTask, onToggleTask, onUpdateTask, onAddComment, onAddNote, onToast, onBack, onCreateTask }) {
  const [tab, setTab] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [reminderAnchor, setReminderAnchor] = useState(null);
  const propertyTasks = tasks.filter((task) => task.propertyId === property.id).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  const propertyComments = comments.filter((comment) => comment.propertyId === property.id && !comment.taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const propertyNotes = notes.filter((note) => note.propertyId === property.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const manager = memberById(property.managerId);
  const prefs = reminderPrefs[property.id] || property.checkInPrefs;
  const agentsPercent = Math.round((property.agent.engaged / property.agent.invited) * 100);

  const handleComment = () => {
    if (!commentText.trim()) return;
    onAddComment({ propertyId: property.id, taskId: null, body: commentText.trim() });
    setCommentText('');
  };
  const handleNote = () => {
    if (!noteText.trim()) return;
    onAddNote(property.id, noteText.trim());
    setNoteText('');
  };

  return (
    <>
      <Button startIcon={<ArrowBackRounded />} onClick={onBack} className="back-button">Properties</Button>
      <Box className="property-detail-heading">
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap"><Typography variant="h1" component="h1">{property.address}</Typography><Chip label={property.status} size="small" className={`property-status ${property.status === 'Inactive' ? 'inactive' : property.status === 'Under offer' ? 'under-offer' : ''}`} /></Stack>
          <Typography color="text.secondary" fontSize={13.5} mt={.55}>{property.city} · {property.postcode}<span className="dot-sep">·</span><span className="property-code-text">{property.code}</span></Typography>
        </Box>
        <Button variant="contained" className="engine-property-button" startIcon={<ArrowOutwardRounded />} onClick={() => onToast('Engine property links will be connected during integration setup.')}>Open in Engine</Button>
      </Box>
      <Box className="property-info-grid">
        <Paper variant="outlined" className="info-card"><Box className="info-label"><PersonOutlineRounded />MARKETPLACE MANAGER</Box><Box className="assignee-inline" mt={1.2}><MemberAvatar memberId={property.managerId} size={35} /><Box><Typography fontSize={13} fontWeight={700}>{manager?.name || 'Unavailable'}</Typography><Typography fontSize={11} color="text.secondary">Assigned from Engine</Typography></Box></Box></Paper>
        <Paper variant="outlined" className="info-card"><Box className="info-label"><ApartmentRounded />AGENCY BRANCH</Box><Typography fontSize={13} fontWeight={700} mt={1.2}>{property.agent.name}</Typography><Typography fontSize={11.5} color="text.secondary" mt={.25}>{property.agent.location}</Typography><Typography fontSize={11} color="text.secondary" mt={.65}>{property.agent.phone} · {property.agent.email}</Typography></Paper>
        <Paper variant="outlined" className="info-card"><Box className="info-label"><CheckRounded />AGENTS ENGAGED</Box><Stack direction="row" alignItems="baseline" spacing={.8} mt={.8}><Typography fontFamily={'"Roboto Slab", Georgia, serif'} fontSize={24} fontWeight={800}>{property.agent.engaged}</Typography><Typography fontSize={12} color="text.secondary">of {property.agent.invited} invited</Typography></Stack><Box className="progress-track"><Box className="progress-fill" sx={{ width: `${agentsPercent}%` }} /></Box><Typography fontSize={10.5} color="text.secondary" mt={.5}>Based on Engine access and acceptance data</Typography></Paper>
      </Box>
      <Box className="property-detail-tabs"><Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Property sections"><Tab label={`Tasks (${propertyTasks.length})`} /><Tab label="Notes & discussion" /></Tabs><Chip size="small" variant="outlined" label="Engine data · read-only" className="readonly-label" /></Box>
      {tab === 0 ? (
        <Box className="property-detail-layout">
          <Box className="property-task-column">
            <Box className="section-heading-row"><Box><Typography variant="h3">Property tasks</Typography><Typography color="text.secondary" fontSize={12} mt={.35}>Generated work and custom tasks for this property.</Typography></Box>
              <Stack direction="row" className="property-task-actions" spacing={.75}>
                <Button size="small" variant="outlined" className="reminder-settings-button" onClick={(event) => setReminderAnchor(event.currentTarget)} startIcon={<SettingsOutlined />} endIcon={<KeyboardArrowDownRounded />} aria-haspopup="dialog" aria-expanded={Boolean(reminderAnchor)} aria-label={`Check-in reminder settings for ${property.code}`}>Check-in reminders</Button>
                <Button size="small" variant="contained" className="property-new-task-button" startIcon={<AddRounded />} onClick={onCreateTask}>New task</Button>
              </Stack>
            </Box>
            <Popover anchorEl={reminderAnchor} open={Boolean(reminderAnchor)} onClose={() => setReminderAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ className: 'reminder-menu-paper' }}>
              <Box className="reminder-menu-content" role="dialog" aria-label={`Check-in reminder settings for ${property.code}`}>
                <Typography fontWeight={750} fontSize={13}>Check-in reminders</Typography><Typography fontSize={10.5} color="text.secondary" mt={.25}>Shared by this property’s assignees.</Typography>
                <Divider sx={{ my: 1.3 }} />
                <Typography fontSize={11.5} fontWeight={650} mb={.7}>Advance reminder</Typography>
                <FormControl size="small" fullWidth><Select value={prefs.advanceDays} onChange={(event) => onUpdateReminder(property.id, { ...prefs, advanceDays: Number(event.target.value) })} inputProps={{ 'aria-label': 'Advance reminder timing' }}>
                  {[1, 2, 3, 5, 7].map((days) => <MenuItem key={days} value={days}>{days} {days === 1 ? 'day' : 'days'} before</MenuItem>)}
                </Select></FormControl>
                <FormControlLabel sx={{ mt: .4, ml: -.8, '& .MuiFormControlLabel-label': { fontSize: 11.5 } }} control={<Switch size="small" checked={prefs.dueDate} onChange={(event) => onUpdateReminder(property.id, { ...prefs, dueDate: event.target.checked })} />} label="On the due date" />
                <FormControlLabel sx={{ mt: -.8, ml: -.8, '& .MuiFormControlLabel-label': { fontSize: 11.5 } }} control={<Switch size="small" checked={prefs.overdue} onChange={(event) => onUpdateReminder(property.id, { ...prefs, overdue: event.target.checked })} />} label="Once when overdue" />
                <Typography fontSize={10.5} color="text.secondary" mt={.5}>Applies to check-in tasks. Other reminders follow their source rules.</Typography>
              </Box>
            </Popover>
            <TaskList tasks={propertyTasks.filter((task) => task.status !== 'Done')} comments={comments} onOpenTask={onOpenTask} onToggleTask={onToggleTask} onUpdateTask={onUpdateTask} onAddComment={onAddComment} enableCommentPopover emptyTitle="No open tasks" emptyText="Completed tasks remain in property history." />
            {propertyTasks.some((task) => task.status === 'Done') && <Box mt={2}><Typography className="eyebrow" mb={1}>COMPLETED HISTORY</Typography><Paper className="history-list" variant="outlined">{propertyTasks.filter((task) => task.status === 'Done').map((task) => <Box key={task.id} className="history-row" onClick={() => onOpenTask(task.id)}><CheckRounded sx={{ color: '#45987c', fontSize: 17 }} /><Typography flex={1} fontSize={12.5}>{taskDisplayName(task)}</Typography><Typography color="text.secondary" fontSize={11}>{dateLabel(task.dueDate)}</Typography></Box>)}</Paper></Box>}
          </Box>
        </Box>
      ) : (
        <Box className="discussion-layout">
          <Paper variant="outlined" className="discussion-card"><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h3">Shared notes</Typography><Typography fontSize={11.5} color="text.secondary" mt={.3}>Useful context for everyone working on this property.</Typography></Box><Chip label="Team visible" size="small" className="readonly-label" /></Stack>
            <Box className="composer"><TextField fullWidth multiline minRows={2} maxRows={5} size="small" placeholder="Add a property note…" value={noteText} onChange={(event) => setNoteText(event.target.value)} /><Button variant="contained" onClick={handleNote} disabled={!noteText.trim()}>Add note</Button></Box>
            <Stack spacing={1.1} mt={2}>{propertyNotes.map((note) => <MessageCard key={note.id} item={note} />)}{!propertyNotes.length && <Typography color="text.secondary" fontSize={12}>No shared notes yet.</Typography>}</Stack>
          </Paper>
          <Paper variant="outlined" className="discussion-card"><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h3">Property discussion</Typography><Typography fontSize={11.5} color="text.secondary" mt={.3}>Updates for the whole property team.</Typography></Box><ForumOutlined sx={{ color: '#868b9b' }} /></Stack>
            <Box className="composer"><TextField fullWidth multiline minRows={2} maxRows={5} size="small" placeholder="Write a comment… Use @name to mention a teammate." value={commentText} onChange={(event) => setCommentText(event.target.value)} /><Button variant="contained" onClick={handleComment} disabled={!commentText.trim()}>Comment</Button></Box>
            <Stack spacing={1.1} mt={2}>{propertyComments.map((comment) => <MessageCard key={comment.id} item={comment} />)}{!propertyComments.length && <Typography color="text.secondary" fontSize={12}>No comments yet.</Typography>}</Stack>
          </Paper>
        </Box>
      )}
    </>
  );
}

function MessageCard({ item }) {
  const member = memberById(item.authorId);
  const date = new Date(item.createdAt);
  return <Box className="message-card"><MemberAvatar memberId={item.authorId} size={30} /><Box sx={{ minWidth: 0, flex: 1 }}><Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap"><Typography fontWeight={700} fontSize={12}>{member?.name || 'Flyp member'}</Typography><Typography fontSize={10.5} color="text.secondary">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Typography></Stack><Typography fontSize={12.5} color="#505568" lineHeight={1.55} mt={.45} sx={{ overflowWrap: 'anywhere' }}>{item.body}</Typography></Box></Box>;
}

function TaskDialog({ dialog, tasks, comments, onClose, onSave, onAddComment, onOpenProperty }) {
  const editingTask = dialog?.mode === 'edit' ? tasks.find((task) => task.id === dialog.taskId) : null;
  const [title, setTitle] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [assigneeId, setAssigneeId] = useState(currentUserId);
  const [status, setStatus] = useState('To-do');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!dialog) return;
    const task = dialog.mode === 'edit' ? tasks.find((item) => item.id === dialog.taskId) : null;
    setTitle(task?.title || '');
    setPropertyId(task?.propertyId || dialog.propertyId || '');
    setAssigneeId(task?.assigneeId || currentUserId);
    setStatus(task?.status || 'To-do');
    setDueDate(task?.dueDate || '');
    setPriority(task?.priority || false);
    setCommentText('');
  }, [dialog?.mode, dialog?.taskId, dialog?.propertyId, tasks]);

  if (!dialog) return null;
  const savedComments = dialog.mode === 'edit' && editingTask ? comments.filter((comment) => comment.taskId === editingTask.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];
  const isGenerated = Boolean(editingTask?.generated);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !propertyId) return;
    onSave({ id: editingTask?.id, title: title.trim(), propertyId: editingTask?.propertyId || propertyId, assigneeId, status, dueDate: isGenerated ? editingTask.dueDate : (dueDate || null), priority, generated: editingTask?.generated || false, type: editingTask?.type || 'custom', sourceId: editingTask?.sourceId || null });
  };
  const handleComment = () => {
    if (!commentText.trim() || !editingTask) return;
    onAddComment({ propertyId: editingTask.propertyId, taskId: editingTask.id, body: commentText.trim() });
    setCommentText('');
  };

  return (
    <Dialog open={Boolean(dialog)} onClose={onClose} fullWidth maxWidth={editingTask ? 'md' : 'sm'} PaperProps={{ className: 'task-dialog' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle className="dialog-heading">
          <Box><Typography variant="h2">{editingTask ? taskDisplayName(editingTask) : 'Create a task'}</Typography><Typography color="text.secondary" fontSize={12} mt={.35}>{editingTask ? 'Update details or add a comment for the team.' : 'Every task belongs to a property.'}</Typography></Box>
          <IconButton onClick={onClose} aria-label="Close dialog"><CloseRounded /></IconButton>
        </DialogTitle>
        <DialogContent dividers className="task-dialog-content">
          <Box className={editingTask ? 'task-dialog-grid' : ''}>
            <Stack spacing={1.8}>
              <TextField label="Task name" value={title} onChange={(event) => setTitle(event.target.value)} required autoFocus fullWidth />
              <FormControl fullWidth required disabled={Boolean(editingTask)}>
                <Typography className="field-label">Property</Typography>
                <Select value={propertyId} onChange={(event) => setPropertyId(event.target.value)} displayEmpty inputProps={{ 'aria-label': 'Task property' }}>
                  <MenuItem value="" disabled>Select a property</MenuItem>
                  {properties.map((property) => <MenuItem key={property.id} value={property.id}>{property.address}, {property.city} · {property.code}</MenuItem>)}
                </Select>
              </FormControl>
              {editingTask && <Box><Typography className="field-label">Property</Typography><Button className="property-dialog-link" startIcon={<HomeWorkOutlined />} onClick={() => { onClose(); onOpenProperty(editingTask.propertyId); }}>{propertyById(editingTask.propertyId)?.address}, {propertyById(editingTask.propertyId)?.city}<ArrowOutwardRounded sx={{ fontSize: 14, ml: .5 }} /></Button></Box>}
              <Box className="dialog-fields-row">
                <FormControl fullWidth><Typography className="field-label">Assignee</Typography><Select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} inputProps={{ 'aria-label': 'Task assignee' }}>{teamMembers.map((member) => <MenuItem key={member.id} value={member.id}><Stack direction="row" spacing={1} alignItems="center"><MemberAvatar memberId={member.id} size={22} />{member.name}</Stack></MenuItem>)}</Select></FormControl>
                <FormControl fullWidth><Typography className="field-label">Status</Typography><Select value={status} onChange={(event) => setStatus(event.target.value)} inputProps={{ 'aria-label': 'Task status' }}>{STATUSES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
              </Box>
              <Box className="dialog-fields-row">
                <TextField label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} fullWidth InputLabelProps={{ shrink: true }} disabled={isGenerated} helperText={isGenerated ? 'Managed by Engine source data' : 'Optional'} />
                <Paper className="priority-control" variant="outlined"><Box><Typography fontSize={12.5} fontWeight={700}>Priority</Typography><Typography fontSize={10.5} color="text.secondary">Pin this in Priority</Typography></Box><Switch checked={priority} onChange={(event) => setPriority(event.target.checked)} inputProps={{ 'aria-label': 'Mark as priority' }} /></Paper>
              </Box>
              {editingTask && <Stack direction="row" spacing={1} alignItems="center" className="task-attribution"><PersonOutlineRounded sx={{ fontSize: 16 }} /><Typography fontSize={11.5} color="text.secondary">Created by {editingTask.creatorId === 'system' ? 'Engine automation' : memberById(editingTask.creatorId)?.name || 'Flyp member'}</Typography>{editingTask.generated && <Chip size="small" label={`${editingTask.type} · Engine`} className="engine-chip" />}</Stack>}
            </Stack>
            {editingTask && <Box className="task-comments-column"><Typography fontWeight={750} fontSize={13}>Task discussion</Typography><Typography fontSize={11} color="text.secondary" mt={.3}>The assignee is notified when another person comments. Use @name to mention a teammate.</Typography>
              <Box className="comment-composer"><TextField fullWidth multiline minRows={2} maxRows={5} size="small" placeholder="Write a comment…" value={commentText} onChange={(event) => setCommentText(event.target.value)} /><Button variant="contained" size="small" onClick={handleComment} disabled={!commentText.trim()}>Send</Button></Box>
              <Stack spacing={1.15} mt={1.5} className="task-comment-list">{savedComments.map((comment) => <MessageCard key={comment.id} item={comment} />)}{!savedComments.length && <Box className="comment-empty"><InsertCommentOutlined /><Typography fontSize={11.5} color="text.secondary">No comments yet. Start the conversation.</Typography></Box>}</Stack>
            </Box>}
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions"><Button onClick={onClose} color="inherit">Cancel</Button><Button type="submit" variant="contained" disabled={!title.trim() || !propertyId}>{editingTask ? 'Save changes' : 'Create task'}</Button></DialogActions>
      </Box>
    </Dialog>
  );
}

function NotificationsPage({ notifications, tasks, onRead, onReadAll, onOpen }) {
  const [tab, setTab] = useState(0);
  const mine = notifications.filter((item) => item.recipientId === currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = mine.filter((item) => !item.readAt);
  const shown = tab === 0 ? unread : mine;
  const relativeTime = (dateString) => {
    const diff = Math.max(0, Date.now() - new Date(dateString).getTime());
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  const iconFor = (type) => type === 'reminder' ? <CalendarMonthRounded /> : type === 'mention' ? <ForumOutlined /> : type === 'assignment' ? <AssignmentTurnedInRounded /> : <InsertCommentOutlined />;
  return (
    <>
      <PageHeading eyebrow="IN-ENGINE UPDATES" title="Notifications" description="Reminders, assignments and conversations relevant to your work." actions={unread.length > 0 && <Button variant="outlined" onClick={onReadAll}>Mark all read</Button>} />
      <Box className="notification-tabs"><Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Notification history"><Tab label={<Stack direction="row" spacing={.75} alignItems="center">Unread{unread.length > 0 && <Box className="tab-count">{unread.length}</Box>}</Stack>} /><Tab label="All notifications" /></Tabs></Box>
      <Paper variant="outlined" className="notifications-list">
        {shown.map((item) => {
          const actor = memberById(item.actorId);
          const linkedTask = item.taskId && tasks.find((task) => task.id === item.taskId);
          return <Box key={item.id} className={`notification-row ${!item.readAt ? 'unread' : ''}`}>
            <Box className={`notification-icon ${item.type}`}>{iconFor(item.type)}</Box>
            <Box className="notification-copy" onClick={() => onOpen(item)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpen(item); }}>
              <Typography fontSize={13} fontWeight={!item.readAt ? 700 : 600}>{item.message}</Typography>
              <Stack direction="row" spacing={.7} alignItems="center" mt={.35}><Typography fontSize={11} color="text.secondary">{relativeTime(item.createdAt)}</Typography>{actor && <><CircleRounded sx={{ fontSize: 4, color: '#a3a7b3' }} /><Typography fontSize={11} color="text.secondary">{actor.name}</Typography></>}{linkedTask && <><CircleRounded sx={{ fontSize: 4, color: '#a3a7b3' }} /><Typography fontSize={11} color="text.secondary">{taskDisplayName(linkedTask)}</Typography></>}</Stack>
            </Box>
            {!item.readAt && <Tooltip title="Mark as read"><IconButton size="small" aria-label="Mark notification as read" onClick={() => onRead(item.id)}><CheckRounded fontSize="small" /></IconButton></Tooltip>}
            {!item.readAt && <Box className="unread-dot" />}
          </Box>;
        })}
        {!shown.length && <Box className="notification-empty"><Box className="empty-icon"><InboxRounded /></Box><Typography fontWeight={750} fontSize={15}>{tab === 0 ? 'You’re all caught up' : 'No notifications yet'}</Typography><Typography fontSize={12.5} color="text.secondary" mt={.5}>{tab === 0 ? 'New reminders and team updates will appear here.' : 'Your notification history will appear here.'}</Typography></Box>}
      </Paper>
    </>
  );
}

export default function App() {
  const [store, setStore] = useState(initialState);
  const [page, setPage] = useState('tasks');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [scope, setScope] = useState('mine');
  const [propertyScope, setPropertyScope] = useState('mine');
  const [search, setSearch] = useState('');
  const [taskDialog, setTaskDialog] = useState(null);
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = store.notifications.filter((item) => item.recipientId === currentUserId && !item.readAt).length;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* demo persistence is best effort */ }
  }, [store]);

  useEffect(() => {
    const handler = (event) => setToast(event.detail || 'Done');
    window.addEventListener('flyp-demo-toast', handler);
    return () => window.removeEventListener('flyp-demo-toast', handler);
  }, []);

  const openProperty = (id) => { setSelectedPropertyId(id); setPage('properties'); setSearch(''); };
  const navigate = (id) => { setSelectedPropertyId(null); setPage(id); setSearch(''); };
  const openTask = (id) => setTaskDialog({ mode: 'edit', taskId: id });
  const makeNotification = (notification) => ({ id: newId('nfy'), createdAt: new Date().toISOString(), readAt: null, actorId: currentUserId, ...notification });

  const saveTask = (form) => {
    const existing = form.id && store.tasks.find((task) => task.id === form.id);
    if (existing) {
      const changedAssignee = existing.assigneeId !== form.assigneeId;
      setStore((current) => ({
        ...current,
        tasks: current.tasks.map((task) => task.id === existing.id ? { ...task, title: form.title, assigneeId: form.assigneeId, status: form.status, dueDate: task.generated ? task.dueDate : form.dueDate, priority: form.priority, completedAt: form.status === 'Done' ? (task.completedAt || new Date().toISOString()) : null, updatedAt: new Date().toISOString() } : task),
        notifications: changedAssignee ? [...current.notifications, makeNotification({ recipientId: form.assigneeId, type: 'assignment', propertyId: existing.propertyId, taskId: existing.id, message: `You were assigned “${taskDisplayName({ ...existing, title: form.title })}”` })] : current.notifications,
      }));
      setToast(changedAssignee ? `Task updated and ${memberById(form.assigneeId)?.name} notified` : 'Task updated');
    } else {
      const created = { ...form, id: newId('task'), creatorId: currentUserId, generated: false, type: 'custom', sourceId: null, createdAt: new Date().toISOString(), completedAt: form.status === 'Done' ? new Date().toISOString() : null };
      setStore((current) => ({
        ...current,
        tasks: [created, ...current.tasks],
        notifications: form.assigneeId !== currentUserId ? [...current.notifications, makeNotification({ recipientId: form.assigneeId, type: 'assignment', propertyId: form.propertyId, taskId: created.id, message: `You were assigned “${taskDisplayName(created)}”` })] : current.notifications,
      }));
      setToast('Task created');
    }
    setTaskDialog(null);
  };

  const toggleTask = (id, complete) => {
    setStore((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, status: complete ? 'Done' : 'To-do', completedAt: complete ? new Date().toISOString() : null, updatedAt: new Date().toISOString() } : task) }));
    setToast(complete ? 'Task completed' : 'Task reopened');
  };

  const updateInlineTask = (id, patch) => {
    const existing = store.tasks.find((task) => task.id === id);
    if (!existing) return;
    const safePatch = { ...patch };
    if (existing.generated) delete safePatch.dueDate;
    const changedAssignee = safePatch.assigneeId && safePatch.assigneeId !== existing.assigneeId;
    const nextStatus = safePatch.status || existing.status;
    const completedAt = nextStatus === 'Done' ? (existing.completedAt || new Date().toISOString()) : null;
    setStore((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id ? { ...task, ...safePatch, completedAt, updatedAt: new Date().toISOString() } : task),
      notifications: changedAssignee ? [...current.notifications, makeNotification({ recipientId: safePatch.assigneeId, type: 'assignment', propertyId: existing.propertyId, taskId: id, message: `You were assigned “${taskDisplayName({ ...existing, ...safePatch })}”` })] : current.notifications,
    }));
    setToast(changedAssignee ? `${memberById(safePatch.assigneeId)?.name} assigned` : 'Task updated');
  };

  const addComment = ({ propertyId, taskId, body }) => {
    const comment = { id: newId('comment'), propertyId, taskId, body, authorId: currentUserId, createdAt: new Date().toISOString() };
    const task = taskId && store.tasks.find((item) => item.id === taskId);
    const property = propertyById(propertyId);
    const recipients = new Set();
    const assignee = task ? task.assigneeId : property?.managerId;
    if (assignee && assignee !== currentUserId) recipients.add(assignee);
    teamMembers.forEach((member) => {
      const mention = new RegExp(`@${member.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\w])`, 'i');
      if (member.id !== currentUserId && mention.test(body)) recipients.add(member.id);
    });
    const notifications = [...recipients].map((recipientId) => {
      const isMention = new RegExp(`@${memberById(recipientId)?.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\w])`, 'i').test(body);
      return makeNotification({ recipientId, type: isMention ? 'mention' : 'comment', propertyId, taskId, message: isMention ? `${memberById(currentUserId)?.name} mentioned you in a ${taskId ? 'task comment' : 'property discussion'}` : `${memberById(currentUserId)?.name} commented on ${property?.address}` });
    });
    setStore((current) => ({ ...current, comments: [...current.comments, comment], notifications: [...current.notifications, ...notifications] }));
    setToast('Comment added');
  };

  const addNote = (propertyId, body) => {
    const note = { id: newId('note'), propertyId, body, authorId: currentUserId, createdAt: new Date().toISOString() };
    setStore((current) => ({ ...current, notes: [...current.notes, note] }));
    setToast('Shared note added');
  };

  const updateReminder = (propertyId, value) => {
    setStore((current) => ({ ...current, reminderPrefs: { ...current.reminderPrefs, [propertyId]: value } }));
    setToast('Reminder preferences saved for this property');
  };

  const markRead = (id) => setStore((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, readAt: item.readAt || new Date().toISOString() } : item) }));
  const markAllRead = () => setStore((current) => ({ ...current, notifications: current.notifications.map((item) => item.recipientId === currentUserId ? { ...item, readAt: item.readAt || new Date().toISOString() } : item) }));
  const openNotification = (item) => {
    markRead(item.id);
    if (item.taskId) {
      setSelectedPropertyId(null);
      setPage('tasks');
      setTaskDialog({ mode: 'edit', taskId: item.taskId });
    } else if (item.propertyId) openProperty(item.propertyId);
  };
  const createTask = () => setTaskDialog({ mode: 'create', propertyId: selectedPropertyId || '' });
  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

  return (
    <Box className="app-root">
      <Box className="desktop-sidebar"><Sidebar page={page} onNavigate={navigate} onCreate={createTask} unreadCount={unreadCount} /></Box>
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ className: 'mobile-nav-paper' }}><Sidebar page={page} onNavigate={navigate} onCreate={createTask} unreadCount={unreadCount} mobile onClose={() => setMobileOpen(false)} /></Drawer>
      <Box className="main-shell">
        <Topbar onMenu={() => setMobileOpen(true)} onNotifications={() => navigate('notifications')} unreadCount={unreadCount} />
        <Box component="main" className="main-content">
          <Box className="demo-banner"><Box className="demo-banner-mark"><CircleRounded sx={{ fontSize: 7 }} /></Box><Typography><strong>Prototype workspace</strong> · Sample data only — not connected to Flyp Engine.</Typography><Button size="small" onClick={() => setToast('This first build is a front-end prototype. Engine auth, APIs and live property data need integration discovery.')}>What’s this?</Button></Box>
          {selectedProperty ? (
            <PropertyDetail property={selectedProperty} tasks={store.tasks} comments={store.comments} notes={store.notes} reminderPrefs={store.reminderPrefs || {}} onUpdateReminder={updateReminder} onOpenTask={openTask} onToggleTask={toggleTask} onUpdateTask={updateInlineTask} onAddComment={addComment} onAddNote={addNote} onToast={setToast} onCreateTask={createTask} onBack={() => { setSelectedPropertyId(null); setPage('properties'); }} />
          ) : page === 'properties' ? (
            <PropertyList tasks={store.tasks} onOpenProperty={openProperty} search={search} setSearch={setSearch} scope={propertyScope} setScope={setPropertyScope} />
          ) : page === 'notifications' ? (
            <NotificationsPage notifications={store.notifications} tasks={store.tasks} onRead={markRead} onReadAll={markAllRead} onOpen={openNotification} />
          ) : (
            <TaskPage page={page} tasks={store.tasks} comments={store.comments} onOpenTask={openTask} onToggleTask={toggleTask} onUpdateTask={updateInlineTask} onAddComment={addComment} onCreate={createTask} search={search} setSearch={setSearch} scope={scope} setScope={setScope} />
          )}
          <Box component="footer" className="app-footer"><Typography>Flyp Property Operations</Typography><Typography>Prototype · Changes saved in this browser</Typography></Box>
        </Box>
      </Box>
      <TaskDialog dialog={taskDialog} tasks={store.tasks} comments={store.comments} onClose={() => setTaskDialog(null)} onSave={saveTask} onAddComment={addComment} onOpenProperty={openProperty} />
      <Snackbar open={Boolean(toast)} autoHideDuration={3200} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ boxShadow: '0 8px 30px #1111111f' }}>{toast}</Alert></Snackbar>
    </Box>
  );
}
