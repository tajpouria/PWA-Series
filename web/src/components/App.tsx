import * as React from "react";
import { IDB } from "idborm";
import { Link, RouteComponentProps } from "@reach/router";

import { IPost } from "../typing/dynamicData";
import { Card } from "./Card";
import { Button } from "./Elements";
import { ModalContainer } from "./Modal";
import { Feed } from "./Feed";
import { APIs } from "../utils/apis";

import imgMedium from "../img/img-medium.png";
import imgLarge from "../img/img-large.png";
import imgSmall from "../img/img-small.png";

const PostDB = IDB.init("PostDB", 2, [
  {
    name: "Post",
    options: { keyPath: "id" }
  },
  {
    name: "SyncPost",
    options: { keyPath: "id" }
  }
]);

const { Post, SyncPost } = PostDB.objectStores;

const URL = APIs.posts;

export const App = (_prop: RouteComponentProps) => {
  const [posts, setPosts] = React.useState<IPost[]>([]);

  const [ShouldShowAddPost, setShouldShowAddPost] = React.useState(false);

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

      <div className="app__post-container">
        {posts.length ? (
          posts.map((post: IPost) => <Card key={post.id}>{post}</Card>)
        ) : (
          <small className="small small--primary">
            There is too quite here!
          </small>
        )}
      </div>
      <Button
        primary
        round
        className="app__new-post-btn"
        onClick={toggleAddPost}
      >
        +
      </Button>
      <ModalContainer show={ShouldShowAddPost}>
        <Feed syncPost={SyncPost} toggleShow={toggleAddPost} />
        <Button onClick={toggleAddPost}>back</Button>
      </ModalContainer>
    </div>
  );

  function toggleAddPost() {
    setShouldShowAddPost(st => !st);
  }
};
