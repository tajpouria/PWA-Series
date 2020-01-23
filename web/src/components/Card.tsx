import * as React from "react";
import { IPost } from "../typing/dynamicData";

interface Props {
  children: IPost;
}

export const Card: React.FC<Props> = ({
  children: { image, location, title }
}) => {
  return (
    <figure className="card">
      <img src={image} alt={location} className="card__img" />
      <figcaption className="card__cap u-center-text">{title}</figcaption>
    </figure>
  );
};
