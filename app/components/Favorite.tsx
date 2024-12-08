import { useFetcher } from "@remix-run/react";
import { FunctionComponent } from "react";
import { EventRecord } from "~/data";

export const Favorite: FunctionComponent<{
  event: Pick<EventRecord, "id" | "favorite">;
}> = ({ event }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : event.favorite;

  return (
    <fetcher.Form method="post" action={`/events/${event.id}/action/favorite`}>
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
