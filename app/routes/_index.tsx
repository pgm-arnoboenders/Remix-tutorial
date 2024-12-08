import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user") || null; // Retrieve the user from the session
  return json({ user });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <p id="index-page">
      Welcome to your new Remix app,{" "}
      <strong>{user ? user.name : "Guest"}</strong>! 🎉
      <br />
      Check out <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
