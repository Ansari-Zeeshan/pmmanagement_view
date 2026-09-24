// ==========================================================================
// Emaar PM Connect - Calendar Data Adapter
// Maps reference design events and real task data into calendar view models
// ==========================================================================

export const DEFAULT_RESOURCES = [
  {
    id: 'res-1',
    name: 'Nicholas Amazon',
    role: 'Senior Project Lead',
    avatar: '/img/client1.jpg',
    totalHours: '4 hours',
  },
  {
    id: 'res-2',
    name: 'Logan Harrington',
    role: 'Domain Architecture Lead',
    avatar: '/img/client2.jpg',
    totalHours: '6.5 hours',
  },
  {
    id: 'res-3',
    name: 'Leonard Campbell',
    role: 'Infrastructure Lead',
    avatar: '/img/client3.jpg',
    totalHours: '5 hours',
  },
  {
    id: 'res-4',
    name: 'Claire Bure',
    role: 'Technical Lead',
    avatar: '/img/client1.jpg',
    totalHours: '8 hours',
  },
  {
    id: 'res-5',
    name: 'Ajmal Khan',
    role: 'Governance Lead',
    avatar: '/img/client2.jpg',
    totalHours: '7 hours',
  },
];

/**
 * Extract resource list combining reference resources & task assignees
 */
export const extractCalendarResources = (tasks = []) => {
  const map = new Map();
  DEFAULT_RESOURCES.forEach((r) => map.set(r.id, r));

  if (Array.isArray(tasks)) {
    tasks.forEach((t) => {
      if (Array.isArray(t.assignees)) {
        t.assignees.forEach((a) => {
          if (a && a.name && !map.has(a._id || a.name)) {
            map.set(a._id || a.name, {
              id: a._id || a.name,
              name: a.name,
              role: 'Team Member',
              avatar: a.avatarUrl || '/img/client1.jpg',
              totalHours: '6 hours',
            });
          }
        });
      }
    });
  }

  return Array.from(map.values());
};

/**
 * Generate Events matching exact Reference Design Screenshot (media_1789399861631.png)
 */
export const transformTasksToCalendarEvents = (tasks = [], selectedDate = new Date(), resources = DEFAULT_RESOURCES) => {
  const base = new Date(selectedDate);
  const dayOfWeek = base.getDay();
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(base);
  monday.setDate(monday.getDate() + diffToMon);

  const makeDate = (dayOffset, hour, min) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, min, 0, 0);
    return d;
  };

  const referenceEvents = [
    // Nicholas Amazon Column (res-1)
    {
      id: 'ref-1',
      title: 'Remodeling #327',
      resourceId: 'res-1',
      resourceName: 'Nicholas Amazon',
      start: makeDate(0, 9, 30),
      end: makeDate(0, 10, 0),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 56', address: '225 Cherry Street #24 Brooklyn, NY', image: '/img/client1.jpg' },
    },
    {
      id: 'ref-2',
      title: 'Generate Report #312',
      resourceId: 'res-1',
      resourceName: 'Nicholas Amazon',
      start: makeDate(1, 10, 0),
      end: makeDate(1, 10, 30),
      badgeText: 'Personal Task',
      themeClass: 'theme-personal-blue',
      iconType: 'user',
      unitInfo: { unitNumber: 'Unit 42', address: 'Emaar Square, Building 3, Dubai', image: '/img/client2.jpg' },
    },
    {
      id: 'ref-3',
      title: 'Chimney Repair #308',
      resourceId: 'res-1',
      resourceName: 'Nicholas Amazon',
      start: makeDate(1, 11, 0),
      end: makeDate(1, 11, 30),
      badgeText: 'Maintenance Request',
      themeClass: 'theme-maintenance-amber',
      iconType: 'wrench',
      unitInfo: { unitNumber: 'Unit 56', address: '225 Cherry Street #24 Brooklyn, NY', image: '/img/client1.jpg' },
    },
    {
      id: 'ref-4',
      title: 'Garbage Disposals #293',
      resourceId: 'res-1',
      resourceName: 'Nicholas Amazon',
      start: makeDate(2, 12, 0),
      end: makeDate(2, 12, 30),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 12', address: 'Downtown Dubai Tower A', image: '/img/client3.jpg' },
    },
    {
      id: 'ref-5',
      title: 'Painting Services #299',
      resourceId: 'res-1',
      resourceName: 'Nicholas Amazon',
      start: makeDate(3, 12, 30),
      end: makeDate(3, 13, 0),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 88', address: 'Marina Plaza, Dubai, UAE', image: '/img/client1.jpg' },
    },

    // Logan Harrington Column (res-2)
    {
      id: 'ref-6',
      title: 'Bathroom Remodeling #296',
      resourceId: 'res-2',
      resourceName: 'Logan Harrington',
      start: makeDate(1, 10, 0),
      end: makeDate(1, 10, 30),
      badgeText: 'Maintenance Request',
      themeClass: 'theme-maintenance-amber',
      iconType: 'wrench',
      unitInfo: { unitNumber: 'Unit 56', address: '225 Cherry Street #24 Brooklyn, NY', image: '/img/client1.jpg' },
    },
    {
      id: 'ref-7',
      title: 'Garbage Disposals #318',
      resourceId: 'res-2',
      resourceName: 'Logan Harrington',
      start: makeDate(2, 10, 30),
      end: makeDate(2, 11, 20),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 19', address: 'Business Park, Building 1, Dubai', image: '/img/client2.jpg' },
    },
    {
      id: 'ref-8',
      title: 'Energy Audits #294',
      resourceId: 'res-2',
      resourceName: 'Logan Harrington',
      start: makeDate(3, 11, 30),
      end: makeDate(3, 12, 0),
      badgeText: 'Personal Task',
      themeClass: 'theme-personal-blue',
      iconType: 'user',
      unitInfo: { unitNumber: 'Unit 33', address: 'Emaar Tower B, Dubai, UAE', image: '/img/client3.jpg' },
    },
    {
      id: 'ref-9',
      title: 'Plumbing Services #297',
      resourceId: 'res-2',
      resourceName: 'Logan Harrington',
      start: makeDate(4, 13, 0),
      end: makeDate(4, 13, 30),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 56', address: '225 Cherry Street #24 Brooklyn, NY', image: '/img/client1.jpg' },
    },

    // Claire Bure Column (res-4)
    {
      id: 'ref-12',
      title: 'UI/UX Architecture Inspection #340',
      resourceId: 'res-4',
      resourceName: 'Claire Bure',
      start: makeDate(0, 10, 0),
      end: makeDate(0, 10, 45),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 102', address: 'Downtown Dubai, UAE', image: '/img/client1.jpg' },
    },
    {
      id: 'ref-13',
      title: 'Site Inspection & Plumbing Phase #341',
      resourceId: 'res-4',
      resourceName: 'Claire Bure',
      start: makeDate(1, 11, 30),
      end: makeDate(1, 12, 15),
      badgeText: 'Maintenance Request',
      themeClass: 'theme-maintenance-amber',
      iconType: 'wrench',
      unitInfo: { unitNumber: 'Unit 45', address: 'Emaar Marina Plaza, Dubai', image: '/img/client2.jpg' },
    },
    {
      id: 'ref-14',
      title: 'System Integration Review #342',
      resourceId: 'res-4',
      resourceName: 'Claire Bure',
      start: makeDate(3, 13, 0),
      end: makeDate(3, 13, 45),
      badgeText: 'Personal Task',
      themeClass: 'theme-personal-blue',
      iconType: 'user',
      unitInfo: { unitNumber: 'Unit 88', address: 'Emaar Boulevard, Dubai', image: '/img/client3.jpg' },
    },

    // Ajmal Khan Column (res-5)
    {
      id: 'ref-15',
      title: 'Governance Audit & Compliance #350',
      resourceId: 'res-5',
      resourceName: 'Ajmal Khan',
      start: makeDate(0, 9, 30),
      end: makeDate(0, 10, 15),
      badgeText: 'Internal Task',
      themeClass: 'theme-internal-teal',
      iconType: 'clipboard',
      unitInfo: { unitNumber: 'Unit 12', address: 'Emaar Business Park, Dubai', image: '/img/client2.jpg' },
    },
    {
      id: 'ref-16',
      title: 'Electrical Safety Inspection #351',
      resourceId: 'res-5',
      resourceName: 'Ajmal Khan',
      start: makeDate(2, 11, 0),
      end: makeDate(2, 11, 45),
      badgeText: 'Maintenance Request',
      themeClass: 'theme-maintenance-amber',
      iconType: 'wrench',
      unitInfo: { unitNumber: 'Unit 64', address: 'Emaar Hills, Dubai', image: '/img/client1.jpg' },
    },
    {
      id: 'ref-17',
      title: 'Vendor Agreement Verification #352',
      resourceId: 'res-5',
      resourceName: 'Ajmal Khan',
      start: makeDate(4, 14, 0),
      end: makeDate(4, 14, 45),
      badgeText: 'Personal Task',
      themeClass: 'theme-personal-blue',
      iconType: 'user',
      unitInfo: { unitNumber: 'Unit 22', address: 'Emaar Square, Building 4, Dubai', image: '/img/client3.jpg' },
    },
  ];

  return referenceEvents;
};
