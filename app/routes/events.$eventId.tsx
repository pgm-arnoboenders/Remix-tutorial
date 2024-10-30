import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getEvent, updateEvent } from "../data";
import invariant from "tiny-invariant";

// Type imports
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import type { FunctionComponent } from "react";
import type { EventRecord } from "../data";

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
  return updateEvent(String(params.eventId), {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Event() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <div id="event">
      <div>
        <h1>
          {event.title ? (
            <>
              {event.title}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite event={event} />
        </h1>

        {event.description ? <p>{event.description}</p> : null}
        {event.date ? <p>Date: {event.date}</p> : null}
        {event.location ? <p>Location: {event.location}</p> : null}
        {event.organizer ? <p>Organizer: {event.organizer}</p> : null}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  event: Pick<EventRecord, "favorite">;
}> = ({ event }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : event.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
