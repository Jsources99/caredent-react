const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24" };

export const IconHome = () => (<svg {...base}><path d="M3 10l9-7 9 7" /><path d="M5 9v10h14V9" /></svg>);
export const IconPerson = () => (<svg {...base}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" /></svg>);
export const IconCalendar = () => (<svg {...base}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>);
export const IconUsers = () => (<svg {...base}><circle cx="9" cy="8" r="3" /><path d="M3 20c.8-3.4 2.8-5 6-5s5.2 1.6 6 5" /><path d="M16 5.5a3 3 0 010 5M17 15c2.2.3 3.7 1.8 4 4" /></svg>);
export const IconLogout = () => (<svg {...base}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>);
export const IconSearch = () => (<svg {...base}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
export const IconPlus = ({ size }) => (<svg {...base} strokeWidth="2.4" width={size} height={size}><path d="M12 5v14M5 12h14" /></svg>);
