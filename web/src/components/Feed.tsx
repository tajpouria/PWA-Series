import * as React from "react";
import { IDBObject } from "idborm";

import { Input, Button } from "./Elements";
import { useFormTracker } from "../hooks/formTracker";
import { blankValidator } from "../utils/blankValidator";
import { APIs } from "../utils/apis";
import captureIcon from "../img/img-small.png";
import { dataURItoBlob } from "../utils/dataURItoBlob";

interface Props {
  syncPost: IDBObject;
  toggleShow: () => void;
}

const URL = APIs.newPost;

export const Feed = ({ syncPost: SyncPost, toggleShow }: Props) => {
  const { values, handleChange } = useFormTracker({ title: "", location: "" });

  const [fetchedValue, setFetchedValue] = React.useState(undefined);

  const videoRef = React.useRef() as React.RefObject<HTMLVideoElement>;

  const canvasRef = React.useRef() as React.RefObject<HTMLCanvasElement>;
  const image = React.useRef(undefined) as any;

  const [useCamera, setUseCamera] = React.useState(false);
  const [takePic, setTakePic] = React.useState(false);

  React.useEffect(() => {
    if ("getUserMedia" in navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        videoRef.current!.srcObject = stream;
        setUseCamera(true);
      });
    }
  }, []);

  return (
    <div className="feed">
      <form onSubmit={handleSubmit} className="feed__form">
        <canvas
          ref={canvasRef}
          style={{ display: takePic ? "block" : "none" }}
        />

        <div
          className="feed__camera-container"
          style={{ display: useCamera ? "flex" : "none" }}
        >
          <video className="feed__camera-video" ref={videoRef} autoPlay />
          <Button
            type="button"
            round
            className="feed__capture-button"
            onClick={handleCapture}
          >
            <img
              className="feed__capture-icon"
              src={captureIcon}
              alt="Capture icon"
            />
          </Button>
        </div>

        <Input
          type="file"
          style={{ display: !useCamera ? "block" : "none" }}
          onChange={handleImageChange}
        />

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

        <Button onClick={handleFetchLocation} type="button">
          FetchLocation
        </Button>

        <Button>Submit</Button>
      </form>
    </div>
  );

  function handleCapture() {
    setTakePic(true);
    setUseCamera(false);

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");

      context?.drawImage(
        video,
        0,
        0,
        canvas.width,
        video.videoHeight / (video.videoWidth / canvas.width)
      );

      // @ts-ignore
      video.srcObject.getVideoTracks().forEach(track => track.stop());

      image.current = dataURItoBlob(canvas.toDataURL());
    }
  }

  function handleFetchLocation(): void {
    const showCannotFetchLocationAlert = () =>
      alert("Cannot Fetch the location please set it manually!");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetch(
            `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?geoit=json`
          )
            .then(res => res.json())
            .then(res => setFetchedValue(res.city || "UNKNOWN"));
        },
        err => {
          console.log(err); // message: "Network location provider at 'https://www.googleapis.com/' : No response received."

          showCannotFetchLocationAlert();
        },
        { timeout: 7000 }
      );
    } else {
      showCannotFetchLocationAlert();
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pic = e.target.files && e.target.files[0];
    if (pic) {
      image.current = pic;
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    blankValidator({ ...values, image: image.current }, async () => {
      const post = {
        title: values.title,
        location: values.location,
        id: new Date().toISOString(),
        image: image.current
      };

      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const sw = await navigator.serviceWorker.ready;

        await SyncPost.put(post);

        sw.sync.register("sync-new-post");

        toggleShow();
      } else {
        const formData = new FormData();
        formData.append("id", post.id);
        formData.append("title", post.title);
        formData.append("location", post.location);
        formData.append("file", image.current as Blob, `${post.title}.png`);

        await fetch(URL, {
          method: "POST",
          body: formData
        });

        toggleShow();
      }
    });
  }
};
