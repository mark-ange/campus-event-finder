export interface HubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  category: string;
  description: string;
  summary: string;
  location: string;
  organizer: string;
  capacity: number;
  registrations: number;
  status?: EventStatus;
}

export const EVENTS_STORAGE_KEY = 'campusEvents';

export type EventStatus = 'active' | 'inactive' | 'draft';
export const DEFAULT_EVENTS: HubEvent[] = [
  {
    id: 'ev-1',
    title: 'ByteCode 2026: 24-Hour Hackathon',
    date: 'March 18-19, 2026',
    time: '9:00 AM - 9:00 PM',
    image:
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    description:
      'A 24-hour coding marathon where students work in teams to build innovative software solutions.',
    summary: 'Join us for an intense 24-hour coding challenge!',
    location: 'Computer Science Building',
    organizer: 'Computer Science Department',
    capacity: 100,
    registrations: 45,
    status: 'active'
  },
  {
    id: 'ev-2',
    title: 'The Bridge-Building Challenge',
    date: 'April 05, 2026',
    time: '10:00 AM - 4:00 PM',
    image:
      'https://images.unsplash.com/photo-1475776408506-9a5371e7a068?auto=format&fit=crop&w=1200&q=80',
    category: 'Engineering',
    description: 'Students compete to design and build the strongest bridge using limited materials.',
    summary: 'Test your engineering skills in this hands-on competition!',
    location: 'Engineering Multi-Purpose Hall',
    organizer: 'Engineering Society',
    capacity: 50,
    registrations: 30,
    status: 'active'
  },
  {
    id: 'ev-3',
    title: 'Liceo White Coat: First Aid & CPR Workshop',
    date: 'April 10, 2026',
    time: '2:00 PM - 5:00 PM',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    category: 'Healthcare',
    description: 'Learn essential first aid techniques and CPR basics from licensed trainers.',
    summary: 'Gain life-saving skills in this hands-on workshop.',
    location: 'Medical Training Center',
    organizer: 'Pre-Med Society',
    capacity: 30,
    registrations: 25,
    status: 'inactive'
  },
  {
    id: 'ev-4',
    title: 'Modern Classroom: Digital Literacy Seminar',
    date: 'May 02, 2026',
    time: '9:00 AM - 12:00 PM',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: 'Seminar',
    description:
      'A practical seminar on research tools, online safety, and building strong digital study habits.',
    summary: 'Boost your digital skills for the modern classroom.',
    location: 'Rodelsa Hall, Room 204',
    organizer: 'Academic Affairs Office',
    capacity: 120,
    registrations: 62,
    status: 'active'
  },
  {
    id: 'ev-5',
    title: 'Campus Startup Night',
    date: 'March 14, 2026',
    time: '5:00 PM - 8:00 PM',
    image:
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    category: 'Business',
    description:
      'Pitch your idea, meet mentors, and connect with student founders. Teams can demo prototypes and get feedback.',
    summary: 'An evening of pitches, demos, and networking.',
    location: 'Innovation Lab, 3rd Floor',
    organizer: 'Entrepreneurship Club',
    capacity: 180,
    registrations: 98,
    status: 'active'
  },
  {
    id: 'ev-6',
    title: 'Data Science Bootcamp: From Zero to Insights',
    date: 'March 23, 2026',
    time: '1:00 PM - 6:00 PM',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
    category: 'Workshop',
    description:
      'Hands-on intro to data cleaning, visualization, and simple modeling. Bring a laptop; datasets provided.',
    summary: 'A practical bootcamp for beginners.',
    location: 'IT Innovation Lab, 2nd Floor',
    organizer: 'IT Department',
    capacity: 60,
    registrations: 44,
    status: 'active'
  },
  {
    id: 'ev-7',
    title: 'Intramurals 2026: Opening Ceremony',
    date: 'February 15, 2026',
    time: '8:00 AM - 11:00 AM',
    image:
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
    category: 'Sports',
    description:
      'Cheer on your department teams and enjoy performances, games, and the official kickoff of intramurals.',
    summary: 'Departments unite for the opening of intramurals.',
    location: 'University Gymnasium',
    organizer: 'Sports Development Office',
    capacity: 800,
    registrations: 540,
    status: 'active'
  },
  {
    id: 'ev-8',
    title: 'Research Colloquium 2025: Student Paper Presentations',
    date: 'May 18, 2025',
    time: '9:30 AM - 4:30 PM',
    image:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    category: 'Academic',
    description:
      'A full-day colloquium featuring student research presentations across departments with Q&A panels.',
    summary: 'Showcasing student research and innovation.',
    location: 'Rodelsa Hall Auditorium',
    organizer: 'Research Office',
    capacity: 300,
    registrations: 210,
    status: 'active'
  },
  {
    id: 'ev-9',
    title: 'Campus Career Fair 2025',
    date: 'September 09, 2025',
    time: '10:00 AM - 5:00 PM',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    category: 'Business',
    description:
      'Meet recruiters, practice interviews, and explore internship opportunities. Bring printed resumes.',
    summary: 'Recruiters, interviews, and internships in one place.',
    location: 'Main Quadrangle',
    organizer: 'Career Services Office',
    capacity: 1000,
    registrations: 680,
    status: 'active'
  },
  {
    id: 'ev-10',
    title: 'Arts Week 2024: Visions of Liceo Exhibit',
    date: 'November 22, 2024',
    time: '3:00 PM - 7:00 PM',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    category: 'Arts',
    description:
      'A student-curated exhibit featuring painting, photography, and mixed media inspired by campus life.',
    summary: 'A gallery night celebrating student artists.',
    location: 'Arts Center Lobby',
    organizer: 'Fine Arts Department',
    capacity: 250,
    registrations: 190,
    status: 'active'
  },
  {
    id: 'ev-11',
    title: 'Freshmen Orientation 2024',
    date: 'August 12, 2024',
    time: '8:30 AM - 3:30 PM',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    category: 'Social',
    description:
      'Welcome program for incoming students featuring campus tours, student org fair, and department briefings.',
    summary: 'Start your Liceo journey with a full-day welcome program.',
    location: 'University Grounds',
    organizer: 'Student Affairs Office',
    capacity: 1500,
    registrations: 1200,
    status: 'active'
  },
  {
    id: 'ev-12',
    title: 'Community Outreach 2024: School Supplies Drive',
    date: 'December 03, 2024',
    time: '9:00 AM - 12:00 PM',
    image:
      'https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?auto=format&fit=crop&w=1200&q=80',
    category: 'Social',
    description:
      'Join volunteers as we pack and distribute school supplies for local partner communities. Donations welcome.',
    summary: 'Volunteer and make a difference in the community.',
    location: 'Community Extension Office',
    organizer: 'Community Extension Office',
    capacity: 200,
    registrations: 160,
    status: 'active'
  }
];

export function mergeEvents(
  existing: HubEvent[],
  defaults: HubEvent[] = DEFAULT_EVENTS
): { events: HubEvent[]; changed: boolean } {
  const byId = new Map(existing.map(event => [event.id, event] as const));
  let changed = false;

  for (const event of defaults) {
    const stored = byId.get(event.id);

    if (!stored) {
      existing.push(event);
      byId.set(event.id, event);
      changed = true;
      continue;
    }

    const storedImage = typeof stored.image === 'string' ? stored.image.trim() : '';
    const defaultImage = typeof event.image === 'string' ? event.image.trim() : '';
    if (!storedImage && defaultImage) {
      stored.image = event.image;
      changed = true;
    }

    if (!stored.status && event.status) {
      stored.status = event.status;
      changed = true;
    }
  }

  return { events: existing, changed };
}

export function parseEventStartDate(dateText: string): number | null {
  const normalized = dateText.trim();

  const rangeMatch = /^([A-Za-z]+)\s+(\d{1,2})\s*-\s*(\d{1,2}),\s*(\d{4})$/.exec(normalized);
  if (rangeMatch) {
    const month = rangeMatch[1];
    const day = rangeMatch[2];
    const year = rangeMatch[4];
    const parsed = Date.parse(`${month} ${day}, ${year}`);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function sortEventsForDisplay(events: HubEvent[], now: Date = new Date()): HubEvent[] {
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const withSortKey = events.map(event => {
    const start = parseEventStartDate(event.date);
    const sortKey = start ?? -1;
    const isUpcoming = start !== null && start >= nowMidnight;
    return { event, sortKey, isUpcoming };
  });

  withSortKey.sort((a, b) => {
    if (a.isUpcoming !== b.isUpcoming) return a.isUpcoming ? -1 : 1;

    if (a.sortKey === -1 && b.sortKey === -1) return 0;
    if (a.sortKey === -1) return 1;
    if (b.sortKey === -1) return -1;

    if (a.isUpcoming) return a.sortKey - b.sortKey;
    return b.sortKey - a.sortKey;
  });

  return withSortKey.map(item => item.event);
}
