import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { sessionStorage } from "~/services/session.server";

export default function Logout() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div>
      <h1>Are you sure you want to log out?</h1>
      <form method="post" className="flex justify-center align-center">
        <button type="submit">Yes</button>
        <button type="button" onClick={goBack}>No</button>
      </form>
    </div>
  );
}
export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}
