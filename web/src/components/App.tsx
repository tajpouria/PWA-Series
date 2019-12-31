import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";

import { Posts, Post } from "../typing/dynamicData";
import { Card } from "./Card";

import imgMedium from "../img/img-medium.png";
import imgLarge from "../img/img-large.png";
import imgSmall from "../img/img-small.png";

import IDB from "../utilities/idb";

export const App = (_prop: RouteComponentProps) => {
  const fetchImgLoaded = React.useRef<boolean>(false);
  const URL = JSON.parse(process.env.REACT_APP_APIS).posts;

  const [posts, setPosts] = React.useState<Posts>({});
  let InitialDB: IDB;

  (async () => {
    InitialDB = await IDB.init("initialDB");

    const objectStores = InitialDB.objectStores;

    console.log("objectStores", objectStores);

    // const User = await InitialDB.createObjectStore("user");

    // await MyDB.createObjectStore("2");
    // await MyDB.createObjectStore("3");
  })();

  React.useEffect(() => {
    // fetch(URL)
    //   .then(res => {
    //     fetchImgLoaded.current = true;

    //     return res.json();
    //   })
    //   .then((res: Posts) => {
    //     setPosts(res);
    //   });

    caches
      .match(URL)
      .then(res => {
        if (res && !fetchImgLoaded.current) return res.json();
      })
      .then((res: Posts) => {
        if (res) {
          setPosts(res);
        }
      });
  }, [URL]);

  return (
    <div className="app">
      <nav className="nav nav--primary">
        <Link to="/help" className="link">
          Help
        </Link>
      </nav>

      <figure className="app__img-container">
        <figcaption className="app__img-caption">IG</figcaption>
        <img
          srcSet={`${imgSmall} 192w, ${imgMedium} 265w, ${imgLarge} 384w`}
          sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 300px"
          src={imgMedium}
          alt="statics"
          className="app__img"
        />
      </figure>
      <button
        onClick={() => {
          InitialDB.delete();
        }}
      >
        DDDDDD
      </button>

      <div className="u-justify-center">
        {Object.values(posts).length ? (
          Object.values(posts).map((post: Post) => (
            <Card key={post.id}>{post}</Card>
          ))
        ) : (
          <small className="small small--primary">
            There is too quite here!
          </small>
        )}
      </div>
    </div>
  );
};
