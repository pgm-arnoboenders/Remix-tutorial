import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteEvent } from "../data";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.eventId, "Missing eventId param");
  await deleteEvent(params.eventId);
  return redirect("/");
};
