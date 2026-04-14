export const careerPaths = [
  { id: 'swe', name: 'Software Engineer', demand: 95, automation: 15, salary: '₹8-25 LPA', growth: 'High', skills: ['Programming', 'DSA', 'System Design', 'Databases', 'Git'] },
  { id: 'ds', name: 'Data Scientist', demand: 90, automation: 20, salary: '₹10-30 LPA', growth: 'Very High', skills: ['Python', 'Statistics', 'ML', 'SQL', 'Visualization'] },
  { id: 'pm', name: 'Product Manager', demand: 80, automation: 10, salary: '₹12-35 LPA', growth: 'High', skills: ['Strategy', 'Analytics', 'Communication', 'UX', 'Agile'] },
  { id: 'design', name: 'UX Designer', demand: 75, automation: 25, salary: '₹6-20 LPA', growth: 'Medium', skills: ['UI Design', 'Research', 'Prototyping', 'Figma', 'Psychology'] },
  { id: 'cyber', name: 'Cybersecurity Analyst', demand: 92, automation: 12, salary: '₹8-28 LPA', growth: 'Very High', skills: ['Networking', 'Security Tools', 'Linux', 'Scripting', 'Compliance'] },
  { id: 'ai', name: 'AI/ML Engineer', demand: 98, automation: 8, salary: '₹12-40 LPA', growth: 'Very High', skills: ['Deep Learning', 'Python', 'Math', 'MLOps', 'Research'] },
  { id: 'ca', name: 'Chartered Accountant', demand: 70, automation: 35, salary: '₹7-25 LPA', growth: 'Medium', skills: ['Accounting', 'Taxation', 'Auditing', 'Finance', 'Law'] },
  { id: 'doctor', name: 'Medical Doctor', demand: 85, automation: 5, salary: '₹8-50 LPA', growth: 'Stable', skills: ['Biology', 'Anatomy', 'Diagnostics', 'Patient Care', 'Research'] },
];

export const streamOptions = [
  { id: 'science', name: 'Science (PCM)', careers: ['swe', 'ds', 'ai', 'cyber'], icon: '🔬' },
  { id: 'science-bio', name: 'Science (PCB)', careers: ['doctor'], icon: '🧬' },
  { id: 'commerce', name: 'Commerce', careers: ['ca', 'pm'], icon: '📊' },
  { id: 'arts', name: 'Arts & Humanities', careers: ['design', 'pm'], icon: '🎨' },
];

export const personalityTraits = [
  { trait: 'Analytical', careers: ['ds', 'swe', 'cyber', 'ca'] },
  { trait: 'Creative', careers: ['design', 'pm'] },
  { trait: 'Leader', careers: ['pm', 'ca'] },
  { trait: 'Technical', careers: ['swe', 'ai', 'cyber'] },
  { trait: 'Empathetic', careers: ['doctor', 'design'] },
  { trait: 'Strategic', careers: ['pm', 'ds', 'ai'] },
];

export const quizQuestions = [
  { q: 'You enjoy solving complex puzzles and logical problems.', traits: ['Analytical', 'Technical'] },
  { q: 'You prefer working with people over working with data.', traits: ['Empathetic', 'Leader'] },
  { q: 'You love designing and creating visual content.', traits: ['Creative'] },
  { q: 'You are fascinated by how systems and machines work.', traits: ['Technical', 'Analytical'] },
  { q: 'You enjoy leading teams and making strategic decisions.', traits: ['Leader', 'Strategic'] },
  { q: 'You are drawn to understanding patterns in data.', traits: ['Analytical', 'Strategic'] },
  { q: 'You feel energized by helping others solve their problems.', traits: ['Empathetic'] },
  { q: 'You enjoy experimenting with new technologies.', traits: ['Technical', 'Creative'] },
];

export const skillCategories = [
  { name: 'Technical', skills: ['Programming', 'DSA', 'Databases', 'Git', 'Linux', 'Cloud'] },
  { name: 'Data & AI', skills: ['Python', 'Statistics', 'ML', 'Deep Learning', 'SQL', 'Visualization'] },
  { name: 'Soft Skills', skills: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management'] },
  { name: 'Domain', skills: ['System Design', 'UX', 'Security', 'Finance', 'Research'] },
];

export const courseSuggestions = [
  { name: 'CS50 by Harvard', skill: 'Programming', platform: 'edX', duration: '12 weeks', free: true },
  { name: 'Machine Learning Specialization', skill: 'ML', platform: 'Coursera', duration: '3 months', free: false },
  { name: 'Google UX Design Certificate', skill: 'UI Design', platform: 'Coursera', duration: '6 months', free: false },
  { name: 'SQL for Data Science', skill: 'SQL', platform: 'Coursera', duration: '4 weeks', free: true },
  { name: 'Python for Everybody', skill: 'Python', platform: 'Coursera', duration: '8 months', free: true },
  { name: 'The Complete Web Developer', skill: 'Programming', platform: 'Udemy', duration: '8 weeks', free: false },
];

export const examDeadlines = [
  { name: 'JEE Main 2026', date: 'April 2026', category: 'Engineering' },
  { name: 'NEET UG 2026', date: 'May 2026', category: 'Medical' },
  { name: 'CA Foundation', date: 'June 2026', category: 'Commerce' },
  { name: 'GATE 2026', date: 'Feb 2026', category: 'Engineering' },
  { name: 'CLAT 2026', date: 'Dec 2026', category: 'Law' },
];
