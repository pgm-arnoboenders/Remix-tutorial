import {
  Form,
  NavLink,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  LinksFunction,
  json,
  redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";
import appStylesHref from "./app.css?url";
import { createEmptyEvent, getEvents } from "./data";
import { useEffect } from "react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: appStylesHref,
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("q");
  const events = await getEvents(search);
  return json({ events, search });
};

export const action = async () => {
  const event = await createEmptyEvent();
  return redirect(`/events/${event.id}/edit`);
};

export default function App() {
  const { events, search } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = search || "";
    }
  }, [search]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix events</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(event) => {
                const isFirstSearch = search === null;
                submit(event.currentTarget, { replace: !isFirstSearch });
              }}
            >
              <input
                aria-label="Search events"
                className={searching ? "loading" : ""}
                defaultValue={search || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div aria-hidden hidden={!searching} id="search-spinner" />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {events.length ? (
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`events/${event.id}`}
                    >
                      {event.title ? <>{event.title}</> : <i>No title</i>}{" "}
                      {event.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No events</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        ><Outlet /></div>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
