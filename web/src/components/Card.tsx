import * as React from "react";
import { Post } from "../typing/dynamicData";

interface Props {
  children: Post;
}

export const Card: React.FC<Props> = ({
  children: { image, location, title }
}) => {
  return (
    <figure className="card">
      <img src={image} alt={location} className="card__img" />
      <figcaption className="card__img">{title}</figcaption>
    </figure>
  );
};
