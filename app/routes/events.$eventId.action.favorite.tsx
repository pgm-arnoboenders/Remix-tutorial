import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updateEvent } from "~/data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.eventId, "Missing eventId param");
  const formData = await request.formData();
  return updateEvent(String(params.eventId), {
    favorite: formData.get("favorite") === "true",
  });
};
