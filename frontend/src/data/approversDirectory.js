// Directory of corporate users for Approvers / Members selection dialog

const DEPARTMENTS = [
  'All Departments',
  'PMO',
  'IT Leadership',
  'Software Engineering',
  'Enterprise Architecture',
  'Finance & Accounting',
  'Legal & Compliance',
  'Cyber Security',
  'Operations & Logistics',
  'Cloud & Infrastructure',
  'Digital Transformation'
];

const FIRST_NAMES = [
  'Claire', 'Ajmal', 'Muhammad', 'Asif', 'Sarah', 'Alexander', 'Fatima', 'Omar', 'Tariq', 'Zainab',
  'Hamdan', 'Rashid', 'Mariam', 'Aisha', 'Youssef', 'Nour', 'Khalid', 'Sultan', 'Laila', 'Hassan',
  'Ibrahim', 'Reem', 'Sami', 'May', 'Faisal', 'Rania', 'Walid', 'Huda', 'Adel', 'Salma',
  'Mostafa', 'Dina', 'Karim', 'Mona', 'Mahmoud', 'Nada', 'Ahmed', 'Yasmin', 'Amr', 'Heba',
  'David', 'Emily', 'Michael', 'Jessica', 'James', 'Sophia', 'Daniel', 'Olivia', 'Matthew', 'Emma',
  'Andrew', 'Isabella', 'Joseph', 'Mia', 'Christopher', 'Charlotte', 'Joshua', 'Amelia', 'Ryan', 'Harper',
  'Nicholas', 'Evelyn', 'Benjamin', 'Abigail', 'William', 'Emily', 'Lucas', 'Elizabeth', 'Henry', 'Sofia',
  'Sanjay', 'Priya', 'Amit', 'Neha', 'Rajesh', 'Pooja', 'Vikram', 'Ananya', 'Rahul', 'Sunita',
  'Sunil', 'Kavita', 'Rohan', 'Swati', 'Manish', 'Divya', 'Suresh', 'Deepika', 'Arjun', 'Meera'
];

const LAST_NAMES = [
  'Bure', 'Khan', 'Ali', 'Smith', 'Al Mansoori', 'Al Hashimi', 'Al Falasi', 'Al Maktoum', 'Al Zaabi', 'Al Nuaimi',
  'Al Mazrouei', 'Al Ketbi', 'Al Suwaidi', 'Al Shamsi', 'Al Dhaheri', 'Al Qassimi', 'Al Kaabi', 'Al Harbi', 'Al Hosani', 'Al Otaiba',
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez',
  'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Reddy', 'Rao', 'Nair', 'Deshmukh', 'Joshi'
];

const ROLES = {
  'PMO': ['Head of PMO', 'Senior Portfolio Manager', 'PMO Lead', 'Project Governance Specialist', 'Agile Coach'],
  'IT Leadership': ['Chief Information Officer (CIO)', 'VP of IT Strategy', 'Director of Technology', 'IT Program Manager'],
  'Software Engineering': ['Lead Software Engineer', 'Principal Fullstack Developer', 'Frontend Architect', 'Engineering Manager'],
  'Enterprise Architecture': ['Chief Architect', 'Enterprise Solutions Architect', 'Cloud Solutions Architect', 'Data Architect'],
  'Finance & Accounting': ['Chief Financial Officer (CFO)', 'Head of Financial Planning', 'Financial Controller', 'Budget Analyst'],
  'Legal & Compliance': ['General Counsel', 'Legal Risk Director', 'Compliance Officer', 'Senior Contracts Manager'],
  'Cyber Security': ['CISO', 'Head of Cyber Security', 'Security Operations Manager', 'Information Security Auditor'],
  'Operations & Logistics': ['Director of Operations', 'Operations Specialist', 'Resource Planning Manager'],
  'Cloud & Infrastructure': ['Head of Cloud Operations', 'DevOps Manager', 'Infrastructure Engineer', 'SysOps Architect'],
  'Digital Transformation': ['Chief Digital Officer (CDO)', 'Digital Product Owner', 'Innovation Lead', 'UX/UI Director']
};

export { DEPARTMENTS };

export const APPROVERS_DIRECTORY = Array.from({ length: 120 }, (_, index) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 7) % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const deptList = DEPARTMENTS.filter(d => d !== 'All Departments');
  const dept = deptList[index % deptList.length];
  const deptRoles = ROLES[dept] || ['Specialist'];
  const role = deptRoles[index % deptRoles.length];
  const cleanEmailName = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
  const email = `${cleanEmailName}${index > 30 ? index : ''}@emaar.ae`;
  const avatarId = (index % 70) + 1;

  return {
    id: `appr-${index + 1}`,
    name,
    email,
    department: dept,
    role,
    avatar: index < 15 ? `https://i.pravatar.cc/150?img=${avatarId}` : null,
  };
});
