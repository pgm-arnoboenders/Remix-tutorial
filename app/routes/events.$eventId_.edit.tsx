import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getEvent, updateEvent } from "../data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.eventId, "Missing eventId param");
  const event = await getEvent(params.eventId);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.eventId, "Missing eventId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateEvent(params.eventId, updates);
  return redirect(`/events/${params.eventId}`);
};

export default function EditEvent() {
  const { event } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={event.id} id="event-form" method="post">
      <p>
        <span>Title</span>
        <input
          aria-label="Title"
          defaultValue={event.title}
          name="title"
          placeholder="Title"
          type="text"
        />
      </p>
      <label>
        <span>description</span>
        <input
          aria-label="Description"
          defaultValue={event.description}
          name="description"
          placeholder="Description"
          type="text"
        />
      </label>

      <label>
        <span>Date</span>
        <input
          aria-label="Date"
          defaultValue={event.date}
          name="date"
          placeholder="Date"
          type="date"
        />
      </label>
      <label>
        <span>Location</span>
        <input
          aria-label="Location"
          defaultValue={event.location}
          name="location"
          placeholder="Location"
          type="text"
        />
      </label>
      <label>
        <span>Organizer</span>
        <input
          aria-label="Organizer"
          defaultValue={event.organizer}
          name="organizer"
          placeholder="Organizer"
          type="text"
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
