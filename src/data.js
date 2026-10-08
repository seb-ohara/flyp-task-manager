export const currentUserId = 'm1';

export const teamMembers = [
  { id: 'm1', name: 'Seb O’Hara', initials: 'SO', color: '#F75B26', role: 'Marketplace Manager' },
  { id: 'm2', name: 'Ava Bennett', initials: 'AB', color: '#8DBAF4', role: 'Marketplace Manager' },
  { id: 'm3', name: 'Mason Lee', initials: 'ML', color: '#90B2C7', role: 'Marketplace Manager' },
  { id: 'm4', name: 'Chloe Evans', initials: 'CE', color: '#D9B282', role: 'Operations' },
  { id: 'm5', name: 'Oliver James', initials: 'OJ', color: '#6D7680', role: 'Marketplace Manager' },
];

export const properties = [
  {
    id: 'p1', code: 'FLY-2486', address: '12 Wellington Street', city: 'Leeds', postcode: 'LS1 4EA',
    status: 'Live', beds: 2, propertyType: 'Apartment', managerId: 'm1', engineUrl: '#engine-p1',
    agent: { name: 'North & Co.', location: 'Leeds City', phone: '0113 555 0142', email: 'leeds@northandco.example', engaged: 4, invited: 5 },
    checkInPrefs: { advanceDays: 2, dueDate: true, overdue: true },
  },
  {
    id: 'p2', code: 'FLY-2519', address: '8 Parkside Avenue', city: 'Manchester', postcode: 'M20 2LS',
    status: 'Live', beds: 3, propertyType: 'Terraced house', managerId: 'm1', engineUrl: '#engine-p2',
    agent: { name: 'Harcourt Residential', location: 'Didsbury', phone: '0161 555 0188', email: 'hello@harcourt.example', engaged: 3, invited: 4 },
    checkInPrefs: { advanceDays: 3, dueDate: true, overdue: true },
  },
  {
    id: 'p3', code: 'FLY-2634', address: '46 Mill Road', city: 'Bristol', postcode: 'BS3 1QY',
    status: 'Under offer', beds: 2, propertyType: 'Semi-detached', managerId: 'm3', engineUrl: '#engine-p3',
    agent: { name: 'Oakfield Homes', location: 'Southville', phone: '0117 555 0166', email: 'team@oakfield.example', engaged: 2, invited: 3 },
    checkInPrefs: { advanceDays: 2, dueDate: true, overdue: true },
  },
  {
    id: 'p4', code: 'FLY-2421', address: '3 Station View', city: 'York', postcode: 'YO24 1AB',
    status: 'Inactive', beds: 1, propertyType: 'Apartment', managerId: 'm2', engineUrl: '#engine-p4',
    agent: { name: 'City & Vale', location: 'York Central', phone: '01904 555 0121', email: 'york@cityandvale.example', engaged: 2, invited: 2 },
    checkInPrefs: { advanceDays: 2, dueDate: true, overdue: true },
  },
  {
    id: 'p5', code: 'FLY-2710', address: '71 Queen Street', city: 'Sheffield', postcode: 'S1 2DW',
    status: 'Live', beds: 4, propertyType: 'Townhouse', managerId: 'm2', engineUrl: '#engine-p5',
    agent: { name: 'Haven Property Group', location: 'Sheffield', phone: '0114 555 0190', email: 'sales@haven.example', engaged: 3, invited: 5 },
    checkInPrefs: { advanceDays: 2, dueDate: true, overdue: true },
  },
];

const dateOffset = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const initialTasks = [
  { id: 't1', propertyId: 'p1', title: 'Complete 14-day check-in', type: 'check-in', sourceId: 'checkin-p1-14', dueDate: dateOffset(-1), status: 'To-do', priority: false, creatorId: 'system', assigneeId: 'm1', generated: true, createdAt: new Date().toISOString() },
  { id: 't2', propertyId: 'p1', title: 'Confirm photography appointment', type: 'custom', sourceId: null, dueDate: dateOffset(0), status: 'In progress', priority: true, creatorId: 'm1', assigneeId: 'm1', generated: false, createdAt: new Date().toISOString() },
  { id: 't3', propertyId: 'p2', title: 'Review portal access rotation', type: 'portal rotation', sourceId: 'rotation-p2-2026-01', dueDate: dateOffset(0), status: 'To-do', priority: false, creatorId: 'system', assigneeId: 'm1', generated: true, createdAt: new Date().toISOString() },
  { id: 't4', propertyId: 'p2', title: 'Complete 30-day check-in', type: 'check-in', sourceId: 'checkin-p2-30', dueDate: dateOffset(2), status: 'To-do', priority: false, creatorId: 'system', assigneeId: 'm1', generated: true, createdAt: new Date().toISOString() },
  { id: 't5', propertyId: 'p3', title: 'Confirm viewing access instructions', type: 'custom', sourceId: null, dueDate: dateOffset(3), status: 'To-do', priority: false, creatorId: 'm3', assigneeId: 'm1', generated: false, createdAt: new Date().toISOString() },
  { id: 't6', propertyId: 'p1', title: 'Prepare updated viewing notes', type: 'custom', sourceId: null, dueDate: null, status: 'To-do', priority: false, creatorId: 'm1', assigneeId: 'm4', generated: false, createdAt: new Date().toISOString() },
  { id: 't7', propertyId: 'p4', title: 'Archive access instructions', type: 'custom', sourceId: null, dueDate: dateOffset(-5), status: 'Done', priority: false, creatorId: 'm2', assigneeId: 'm2', generated: false, createdAt: new Date().toISOString() },
  { id: 't8', propertyId: 'p5', title: 'Complete 60-day check-in', type: 'check-in', sourceId: 'checkin-p5-60', dueDate: dateOffset(-3), status: 'In progress', priority: false, creatorId: 'system', assigneeId: 'm2', generated: true, createdAt: new Date().toISOString() },
  { id: 't9', propertyId: 'p4', title: 'Review property handover notes', type: 'custom', sourceId: null, dueDate: null, status: 'To-do', priority: true, creatorId: 'm2', assigneeId: 'm2', generated: false, createdAt: new Date().toISOString() },
  { id: 't10', propertyId: 'p2', title: 'Send 14-day check-in summary', type: 'check-in', sourceId: 'checkin-p2-14', dueDate: dateOffset(-8), status: 'Done', priority: false, creatorId: 'system', assigneeId: 'm1', generated: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
];

export const initialComments = [
  { id: 'c1', propertyId: 'p1', taskId: null, authorId: 'm2', body: 'The branch confirmed the new photography slot for Thursday. @Seb O’Hara could you update the viewing notes afterwards?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: 'c2', propertyId: 'p1', taskId: 't2', authorId: 'm4', body: 'I have asked the agent to hold the morning appointment.', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'c3', propertyId: 'p2', taskId: null, authorId: 'm1', body: 'Rotation is due today. Agent details remain managed in Engine.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
];

export const initialNotes = [
  { id: 'n1', propertyId: 'p1', authorId: 'm1', body: 'The agent prefers access requests by email at least one day ahead. Keep the key safe with the branch.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: 'n2', propertyId: 'p2', authorId: 'm3', body: 'Parking instructions are in the Engine property record. Remember to include them in the next viewing update.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
];

export const initialNotifications = [
  { id: 'nfy1', recipientId: 'm1', type: 'comment', actorId: 'm2', propertyId: 'p1', taskId: null, message: 'Ava Bennett commented on 12 Wellington Street', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), readAt: null },
  { id: 'nfy2', recipientId: 'm1', type: 'reminder', actorId: null, propertyId: 'p2', taskId: 't3', message: 'Portal rotation is due today at 8 Parkside Avenue', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), readAt: null },
  { id: 'nfy3', recipientId: 'm1', type: 'mention', actorId: 'm2', propertyId: 'p1', taskId: null, message: 'Ava Bennett mentioned you in a property discussion', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), readAt: null },
  { id: 'nfy4', recipientId: 'm1', type: 'assignment', actorId: 'm3', propertyId: 'p3', taskId: 't5', message: 'Mason Lee assigned you a task', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), readAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'nfy5', recipientId: 'm1', type: 'reminder', actorId: null, propertyId: 'p2', taskId: 't4', message: '30-day check-in is coming up in 2 days', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), readAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
];
