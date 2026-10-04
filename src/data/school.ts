import {
  BookOpen,
  Calculator,
  Dumbbell,
  FlaskConical,
  MonitorSmartphone,
  Palette,
  Music,
  Trophy,
  Microscope,
  BookMarked,
  Sparkles,
  TentTree,
  Drama,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------- types --------------------------------- */

export type Subject = {
  title: string;
  description: string;
  icon: LucideIcon;
  bg: string;
  iconBg: string;
  iconColor: string;
};

export type Activity = {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  accent: string;
  chip: string;
};

export type SchoolEvent = {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  location: string;
  time: string;
  category: "Academic" | "Sports" | "Cultural" | "Holiday" | "Other";
  image: string;
};

export type Notice = {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  pinned?: boolean;
};

export type Teacher = {
  name: string;
  role: string;
  subject: string;
  bio: string;
  image: string;
  color: string;
};

export type Testimonial = {
  name: string;
  label: string;
  quote: string;
  avatar: string;
  color: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  category: "Campus" | "Classroom" | "Sports" | "Events" | "Activities";
  tall?: boolean;
};

/* --------------------------------- subjects -------------------------------- */

export const subjects: Subject[] = [
  {
    title: "Mathematics",
    description: "Numbers become games — puzzles, patterns and confident problem solving.",
    icon: Calculator,
    bg: "bg-sky-50 border-sky-100",
    iconBg: "bg-sky-400",
    iconColor: "text-white",
  },
  {
    title: "Science",
    description: "Hands-on experiments that turn “why?” into “wow, I get it!”",
    icon: FlaskConical,
    bg: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-400",
    iconColor: "text-white",
  },
  {
    title: "Language",
    description: "Reading, storytelling and writing that build strong little voices.",
    icon: BookOpen,
    bg: "bg-violet-50 border-violet-100",
    iconBg: "bg-violet-400",
    iconColor: "text-white",
  },
  {
    title: "Art & Creativity",
    description: "Paint, clay, craft and colour — imagination gets its own classroom.",
    icon: Palette,
    bg: "bg-pink-50 border-pink-100",
    iconBg: "bg-pink-400",
    iconColor: "text-white",
  },
  {
    title: "Technology",
    description: "Safe, playful coding, robotics and digital skills from an early age.",
    icon: MonitorSmartphone,
    bg: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-400",
    iconColor: "text-white",
  },
  {
    title: "Physical Education",
    description: "Sports, yoga and movement that keep bodies strong and minds happy.",
    icon: Dumbbell,
    bg: "bg-yellow-50 border-yellow-100",
    iconBg: "bg-yellow-400",
    iconColor: "text-white",
  },
];

/* -------------------------------- activities ------------------------------- */

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const activities: Activity[] = [
  {
    title: "Sports",
    description: "Football, athletics, swimming and teamwork every week.",
    icon: Trophy,
    image: img("photo-1461896836934-ffe607ba8211"),
    accent: "bg-sky-400",
    chip: "bg-sky-100 text-sky-700",
  },
  {
    title: "Music",
    description: "Choir, piano, drums and joyful little concerts.",
    icon: Music,
    image: img("photo-1507838153414-b4b713384a76"),
    accent: "bg-violet-400",
    chip: "bg-violet-100 text-violet-700",
  },
  {
    title: "Art Studio",
    description: "Painting, sculpture and exhibitions for young artists.",
    icon: Palette,
    image: img("photo-1515488042361-ee00e0ddd4e4"),
    accent: "bg-pink-400",
    chip: "bg-pink-100 text-pink-700",
  },
  {
    title: "Dance",
    description: "Ballet, hip-hop and cultural dance that build rhythm.",
    icon: Drama,
    image: img("photo-1508700115892-45ecd05ae2ad"),
    accent: "bg-orange-400",
    chip: "bg-orange-100 text-orange-700",
  },
  {
    title: "Science Club",
    description: "Rockets, robots and messy-fun experiments.",
    icon: Microscope,
    image: img("photo-1532094349884-543bc11b234d"),
    accent: "bg-emerald-400",
    chip: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Reading Club",
    description: "Story time, library quests and book buddies.",
    icon: BookMarked,
    image: img("photo-1521587760476-6c12a4b040da"),
    accent: "bg-yellow-400",
    chip: "bg-yellow-100 text-yellow-800",
  },
  {
    title: "Cultural Fest",
    description: "Festivals, theatre and traditions from around the world.",
    icon: Sparkles,
    image: img("photo-1530103862676-de8c9debad1d"),
    accent: "bg-fuchsia-400",
    chip: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    title: "Field Trips",
    description: "Museums, farms, nature parks — learning outside walls.",
    icon: TentTree,
    image: img("photo-1472162072942-cd5147eb3902"),
    accent: "bg-teal-400",
    chip: "bg-teal-100 text-teal-700",
  },
];

/* ---------------------------------- events --------------------------------- */

export const events: SchoolEvent[] = [
  {
    id: "sports-day",
    day: "20",
    month: "DEC",
    title: "Annual Sports Day",
    description: "Races, relays, cheering squads and medals for every young athlete.",
    location: "School Playground",
    time: "09:00 AM",
    category: "Sports",
    image: img("photo-1461896836934-ffe607ba8211"),
  },
  {
    id: "science-fair",
    day: "14",
    month: "JAN",
    title: "Young Inventors Science Fair",
    description: "Student-built robots, volcanoes and experiments the whole family can try.",
    location: "Innovation Hall",
    time: "10:00 AM",
    category: "Academic",
    image: img("photo-1532094349884-543bc11b234d"),
  },
  {
    id: "winter-concert",
    day: "22",
    month: "DEC",
    title: "Winter Music Concert",
    description: "Choir, orchestra and a sing-along finale under twinkling lights.",
    location: "Sunshine Auditorium",
    time: "05:30 PM",
    category: "Cultural",
    image: img("photo-1514320291840-2e0a9bf2a9ae"),
  },
  {
    id: "art-week",
    day: "08",
    month: "FEB",
    title: "Colors of Joy Art Week",
    description: "A week of painting, pottery and a gallery night hosted by our students.",
    location: "Art Courtyard",
    time: "11:00 AM",
    category: "Cultural",
    image: img("photo-1513364776144-60967b0f800f"),
  },
  {
    id: "book-parade",
    day: "02",
    month: "MAR",
    title: "Storybook Parade",
    description: "Dress as your favourite character and march through Bookland.",
    location: "Main Campus",
    time: "09:30 AM",
    category: "Academic",
    image: img("photo-1503676260728-1c00da094a0b"),
  },
  {
    id: "family-picnic",
    day: "18",
    month: "APR",
    title: "Family Fun Picnic",
    description: "Games, food stalls and sunshine — a day for the whole school family.",
    location: "Green Meadows Park",
    time: "10:00 AM",
    category: "Other",
    image: img("photo-1529156069898-49953e39b3ac"),
  },
];

/* ---------------------------------- notices -------------------------------- */

export const notices: Notice[] = [
  {
    id: "n1",
    date: "Dec 02, 2026",
    category: "Admissions",
    title: "Admissions Open for 2027–28",
    description: "Applications for Nursery to Grade 8 are now open. Limited seats per class — early applications encouraged.",
    pinned: true,
  },
  {
    id: "n2",
    date: "Dec 10, 2026",
    category: "Exams",
    title: "Annual Exam Schedule Published",
    description: "The term exam timetable and revision guides are available on the parent portal and school office.",
  },
  {
    id: "n3",
    date: "Dec 15, 2026",
    category: "Holiday",
    title: "Winter Break: Dec 24 – Jan 04",
    description: "School reopens on Jan 05. Wishing every family a warm and joyful holiday season.",
  },
  {
    id: "n4",
    date: "Dec 18, 2026",
    category: "Parents",
    title: "Parent-Teacher Meeting on Jan 10",
    description: "Meet your child's teachers, review progress and set goals for the new term together.",
  },
  {
    id: "n5",
    date: "Jan 06, 2027",
    category: "Sports",
    title: "Sports Day Trials Begin",
    description: "Trials for track, football and relay teams start next week. Sports kits required.",
  },
  {
    id: "n6",
    date: "Jan 12, 2027",
    category: "Trip",
    title: "Grade 4–6 Museum Field Trip",
    description: "Permission slips due Friday. Buses leave at 8:30 AM sharp from the main gate.",
  },
];

/* ---------------------------------- teachers ------------------------------- */

export const teachers: Teacher[] = [
  {
    name: "Sarah Ahmed",
    role: "Lead Teacher",
    subject: "Science",
    bio: "Turns every lesson into a little adventure of discovery.",
    image: img("photo-1494790108377-be9c29b29330", 600),
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Daniel Carter",
    role: "Head of Sports",
    subject: "Physical Education",
    bio: "Believes happy kids move more — and move more happily.",
    image: img("photo-1507003211169-0a1dd7228f2d", 600),
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Priya Nair",
    role: "Senior Teacher",
    subject: "Mathematics",
    bio: "Makes numbers feel like puzzles waiting to be solved.",
    image: img("photo-1438761681033-6461ffad8d80", 600),
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Michael Osei",
    role: "Music Director",
    subject: "Music",
    bio: "Leads our choir and the famous winter concert nights.",
    image: img("photo-1500648767791-00dcc994a43e", 600),
    color: "bg-orange-100 text-orange-700",
  },
];

/* -------------------------------- testimonials ----------------------------- */

export const testimonials: Testimonial[] = [
  {
    name: "Fatima Rahman",
    label: "Parent · Grade 2",
    quote: "My daughter runs to school every morning. The teachers know her so well — it honestly feels like a second family.",
    avatar: img("photo-1544005313-94ddf0286df2", 200),
    color: "bg-sky-100",
  },
  {
    name: "James Whitfield",
    label: "Parent · Grade 5",
    quote: "Clear communication, kind teachers and so many activities. Our son's confidence has grown enormously this year.",
    avatar: img("photo-1506794778202-cad84cf45f1d", 200),
    color: "bg-yellow-100",
  },
  {
    name: "Aisha K.",
    label: "Student · Grade 6",
    quote: "I love science club and art week! School is where all my best friends and favourite experiments are.",
    avatar: img("photo-1544717305-2782549b5136", 200),
    color: "bg-pink-100",
  },
];

/* ---------------------------------- gallery -------------------------------- */

export const gallery: GalleryItem[] = [
  { src: img("photo-1509062522246-3755977927d7"), alt: "Students raising hands in a bright classroom", category: "Classroom", tall: true },
  { src: img("photo-1580582932707-520aed937b7b"), alt: "Empty modern classroom ready for lessons", category: "Campus" },
  { src: img("photo-1461896836934-ffe607ba8211"), alt: "Children racing on sports day", category: "Sports", tall: true },
  { src: img("photo-1515488042361-ee00e0ddd4e4"), alt: "Kids painting together in art class", category: "Activities" },
  { src: img("photo-1541339907198-e08756dedf3f"), alt: "Beautiful school campus building", category: "Campus" },
  { src: img("photo-1503676260728-1c00da094a0b"), alt: "Learning materials and books on a desk", category: "Classroom" },
  { src: img("photo-1530103862676-de8c9debad1d"), alt: "Children celebrating at a school party", category: "Events" },
  { src: img("photo-1523050854058-8df90110c9f1"), alt: "Graduation celebration caps in the air", category: "Events", tall: true },
  { src: img("photo-1503454537195-1dcabb73ffb9"), alt: "Happy student playing outdoors", category: "Activities" },
];

export const stats = [
  { value: 500, suffix: "+", label: "Happy Students" },
  { value: 35, suffix: "+", label: "Amazing Teachers" },
  { value: 20, suffix: "+", label: "Clubs & Activities" },
  { value: 15, suffix: "+", label: "Years of Excellence" },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Activities", href: "/#activities" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];
