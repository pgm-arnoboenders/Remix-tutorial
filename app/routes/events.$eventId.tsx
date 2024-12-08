import { Favorite } from "~/components/Favorite";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getEvent } from "../data";
import { sessionStorage } from "~/services/session.server";
// Type imports
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // check if user is logged in
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (!user) throw redirect("/login");

  invariant(params.eventId, "Missing eventId param");
  const event = await getEvent(params.eventId);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
};

export default function Event() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <div id="event">
      <div>
        <h1>
          {event.title ? <>{event.title}</> : <i>No Name</i>}{" "}
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
