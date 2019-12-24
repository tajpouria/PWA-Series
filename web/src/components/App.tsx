import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";

import imgMedium from "../img/img-medium.png";
import imgLarge from "../img/img-large.png";
import imgSmall from "../img/img-small.png";

export const App = (_prop: RouteComponentProps) => {
  const fetchImg = React.useRef<HTMLImageElement>({ src: "" } as any);
  const fetchImgLoaded = React.useRef<boolean>(false);
  const URL = JSON.parse(process.env.REACT_APP_APIS).rickandmortyapi;

  React.useEffect(() => {
    fetch(URL)
      .then(res => {
        fetchImgLoaded.current = true;
        return res.json();
      })
      .then(res => (fetchImg.current.src = res.image));

    caches.open(process.env.REACT_APP_DYNAMIC_CACHE).then(cache =>
      cache
        .match(URL)
        .then(res => {
          if (fetchImgLoaded.current && res) return res.json();
        })
        .then(res => {
          if (res) {
            fetchImg.current.src = res.image;
          }
        })
    );
  }, []);

  return (
    <div className="app">
      <nav className="nav nav--primary">
        <Link to="/help" className="link">
          Help
        </Link>
      </nav>
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
};
