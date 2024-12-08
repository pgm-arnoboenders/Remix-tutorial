import { useLoaderData } from "@remix-run/react";
import { User } from "~/users";

export default function Index() {
  const user = useLoaderData<User>();

  return (
    <p id="index-page">
      Welcome to your new Remix app, {user && user.name }! 🎉
      <br />
      Check out <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
