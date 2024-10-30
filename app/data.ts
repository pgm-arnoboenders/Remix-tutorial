////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type EventMutation = {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  organizer?: string;
  favorite?: boolean;
};

export type EventRecord = EventMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeEvents = {
  records: {} as Record<string, EventRecord>,

  async getAll(): Promise<EventRecord[]> {
    return Object.keys(fakeEvents.records)
      .map((key) => fakeEvents.records[key])
      .sort(sortBy("-date", "title"));
  },

  async get(id: string): Promise<EventRecord | null> {
    return fakeEvents.records[id] || null;
  },

  async create(values: EventMutation): Promise<EventRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newEvent = { id, createdAt, ...values };
    fakeEvents.records[id] = newEvent;
    return newEvent;
  },

  async set(id: string, values: EventMutation): Promise<EventRecord> {
    const event = await fakeEvents.get(id);
    invariant(event, `Event with id ${id} not found`);
    const updatedEvent = { ...event, ...values };
    fakeEvents.records[id] = updatedEvent;
    return updatedEvent;
  },

  destroy(id: string): null {
    delete fakeEvents.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getEvents(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulating async operation
  let events = await fakeEvents.getAll();
  if (query) {
    events = matchSorter(events, query, {
      keys: ["title", "description", "location", "organizer"],
    });
  }
  return events.sort(sortBy("-date", "title"));
}

export async function createEmptyEvent() {
  const event = await fakeEvents.create({});
  return event;
}

export async function getEvent(id: string) {
  return fakeEvents.get(id);
}

export async function updateEvent(id: string, updates: EventMutation) {
  const event = await fakeEvents.get(id);
  if (!event) {
    throw new Error(`No event found for ${id}`);
  }
  await fakeEvents.set(id, { ...event, ...updates });
  return event;
}

export async function deleteEvent(id: string) {
  fakeEvents.destroy(id);
}

////////////////////////////////////////////////////////////////////////////////
// Sample event data, similar to fake contacts

[
  {
    title: "React Conference 2024",
    description: "A conference for React enthusiasts and professionals.",
    date: "2024-12-01",
    location: "San Francisco, CA",
    organizer: "React Team",
  },
  {
    title: "JavaScript World Summit",
    description: "Global summit for all things JavaScript.",
    date: "2024-11-15",
    location: "Berlin, Germany",
    organizer: "JS Foundation",
  },
  {
    title: "WebDev Conference",
    description: "Web development trends and innovations.",
    date: "2024-10-22",
    location: "New York, NY",
    organizer: "WebDev Inc.",
    participants: [
      { first: "Charlie", last: "Johnson", email: "charlie@example.com" },
      { first: "Dana", last: "White", email: "dana@example.com" },
    ],
  },
  {
    title: "CSS Design Awards",
    description: "Celebrating the best in CSS design.",
    date: "2024-09-10",
    location: "London, UK",
    organizer: "CSS Awards",
  },
  {
    title: "Node.js Interactive",
    description: "Interactive sessions and workshops on Node.js.",
    date: "2024-08-05",
    location: "Austin, TX",
    organizer: "Node.js Foundation",
  },
  {
    title: "Vue.js Summit",
    description: "Summit for Vue.js developers and enthusiasts.",
    date: "2024-07-20",
    location: "Paris, France",
    organizer: "Vue.js Community",
  },
  {
    title: "Angular Connect",
    description: "Connecting Angular developers worldwide.",
    date: "2024-06-15",
    location: "Amsterdam, Netherlands",
    organizer: "Angular Team",
  },
  {
    title: "Tech Leadership Conference",
    description: "Conference for tech leaders and managers.",
    date: "2024-05-10",
    location: "Toronto, Canada",
    organizer: "Tech Leaders",
  },
  {
    title: "AI & Machine Learning Summit",
    description: "Summit on AI and machine learning advancements.",
    date: "2024-04-25",
    location: "Tokyo, Japan",
    organizer: "AI Society",
  },
  {
    title: "Blockchain Expo",
    description: "Expo showcasing blockchain technology.",
    date: "2024-03-30",
    location: "Dubai, UAE",
    organizer: "Blockchain Association",
  },
].forEach((event) => {
  fakeEvents.create({
    ...event,
    id: `${event.title.toLowerCase().replace(/\s+/g, "-")}`,
  });
});
