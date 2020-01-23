import * as React from "react";
import { IDB } from "idborm";
import { Link, RouteComponentProps } from "@reach/router";

import { IPost } from "../typing/dynamicData";
import { Card } from "./Card";

import imgMedium from "../img/img-medium.png";
import imgLarge from "../img/img-large.png";
import imgSmall from "../img/img-small.png";

const PostDB = IDB.init("PostDB", 1, {
  name: "Post",
  options: { keyPath: "id" }
});

const { Post } = PostDB.objectStores;

export const App = (_prop: RouteComponentProps) => {
  const URL = JSON.parse(process.env.REACT_APP_APIS).posts;

  const [posts, setPosts] = React.useState<IPost[]>([]);

  React.useEffect(() => {
    fetch(URL)
      .then(async res => {
        const posts = await res.json();

        setPosts(Object.values(posts));
      })
      .catch(async err => {
        const posts = await Post.values();
        setPosts(posts);
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

      <div className="u-justify-center">
        {posts.length ? (
          posts.map((post: IPost) => <Card key={post.id}>{post}</Card>)
        ) : (
          <small className="small small--primary">
            There is too quite here!
          </small>
        )}
      </div>
    </div>
  );
};
