import * as React from "react";
import { IDBObject } from "idborm";

import { Input, Button } from "./Elements";
import { useFormTracker } from "../hooks/formTracker";
import { blankValidator } from "../utils/blankValidator";
import { APIs } from "../utils/apis";

interface Props {
  syncPost: IDBObject;
  toggleShow: () => void;
}

const URL = APIs.newPost;

export const Feed = ({ syncPost: SyncPost, toggleShow }: Props) => {
  const { values, handleChange } = useFormTracker({ title: "", location: "" });

  return (
    <div className="feed">
      <form onSubmit={handleSubmit} className="feed__form">
        <label htmlFor="title" className="input__label">
          Title
          <Input
            name="title"
            id="title"
            placeholder="title"
            value={values.title}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="location" className="input__label">
          Location
          <Input
            name="location"
            id="location"
            placeholder="location"
            value={values.location}
            onChange={handleChange}
          />
        </label>

        <Button>Submit</Button>
      </form>
    </div>
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    blankValidator(values, async () => {
      const post = {
        title: values.title,
        location: values.location,
        id: new Date().toISOString(),
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVMHXF8oCnqdFF4uD2VDBgMElgoXNO2B0RErG4p69gUQx9vEbuEQ&s"
      };

      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const sw = await navigator.serviceWorker.ready;

        await SyncPost.put(post);

        sw.sync.register("sync-new-post");

        toggleShow();
      } else {
        await fetch(URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(post)
        });

        toggleShow();
      }
    });
  }
};
