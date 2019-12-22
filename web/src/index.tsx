import * as React from "react";
import { render } from "react-dom";

import "./styles.css";
import imgSmall from "./img/img-small.png";
import imgMedium from "./img/img-medium.png";
import imgLarge from "./img/img-large.png";

import * as serviceWorker from "./serviceWorker";

function App() {
  const fetchImg = React.useRef<HTMLImageElement>({ src: "" } as any);

  React.useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/2")
      .then(res => res.json())
      .then(res => {
        fetchImg.current.src = res.image;
      });
  });

  return (
    <div className="app">
      <figure className="app__img-container">
        <figcaption className="app__img-caption">Static image</figcaption>
        <img
          srcSet={`${imgSmall} 192w, ${imgMedium} 265w, ${imgLarge} 384w`}
          sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 300px"
          src={imgMedium}
          alt="statics"
          className="app__img"
        />
      </figure>
      <figure className="app__img-container">
        <figcaption className="app__img-caption">Fetched image</figcaption>
        <img alt="fetch" ref={fetchImg} className="app__img" />
      </figure>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);

<<<<<<< HEAD
serviceWorker.register();
=======
if ("serviceWorker" in navigator)
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js")
  );
>>>>>>> a6eb72d46dbc414a2fce2c5f985e4ab160394c7f
