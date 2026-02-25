export interface Notification {
  id: string;
  patientName: string;
  address: string;
  distance: string;
  urgency: "critical" | "moderate" | "low";
  timestamp: string;
  issue: string;
  isNew: boolean;
}

export interface CreditEntry {
  id: string;
  description: string;
  points: number;
  date: string;
  type: "earned" | "bonus";
}

export const notifications: Notification[] = [
  {
    id: "1",
    patientName: "Ramesh Kumar",
    address: "42, MG Road, Sector 15, Gurugram, Haryana 122001",
    distance: "1.2 km",
    urgency: "critical",
    timestamp: "2 min ago",
    issue: "Cardiac emergency — chest pain reported",
    isNew: true,
  },
  {
    id: "2",
    patientName: "Priya Sharma",
    address: "B-204, Sunrise Apartments, Dwarka Sector 7, New Delhi 110077",
    distance: "3.5 km",
    urgency: "moderate",
    timestamp: "8 min ago",
    issue: "High fever — 103°F, needs medication delivery",
    isNew: true,
  },
  {
    id: "3",
    patientName: "Anil Verma",
    address: "15, Lajpat Nagar, Central Market, New Delhi 110024",
    distance: "5.1 km",
    urgency: "low",
    timestamp: "22 min ago",
    issue: "Follow-up visit — post-surgery checkup",
    isNew: false,
  },
  {
    id: "4",
    patientName: "Meena Devi",
    address: "78, Karol Bagh, WEA Block, New Delhi 110005",
    distance: "2.8 km",
    urgency: "moderate",
    timestamp: "35 min ago",
    issue: "Breathing difficulty — asthma attack",
    isNew: false,
  },
];

export const creditHistory: CreditEntry[] = [
  { id: "1", description: "Emergency response — Cardiac", points: 50, date: "Today", type: "earned" },
  { id: "2", description: "Medication delivery", points: 20, date: "Today", type: "earned" },
  { id: "3", description: "Weekly streak bonus", points: 100, date: "Yesterday", type: "bonus" },
  { id: "4", description: "Patient follow-up", points: 15, date: "Yesterday", type: "earned" },
  { id: "5", description: "First aid assistance", points: 30, date: "2 days ago", type: "earned" },
  { id: "6", description: "Monthly top warrior bonus", points: 200, date: "3 days ago", type: "bonus" },
];

export const warriorStats = {
  name: "Arjun Singh",
  creditPoints: 1450,
  missionsCompleted: 87,
  activeMissions: 2,
  rank: "Gold Warrior",
  streak: 12,
};
