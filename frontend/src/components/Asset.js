import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

// Destructure the props our asset component may receive. This makes a multi-purpose component
// that can render any combination of the props that are passed to it.
const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {/* The logic here with the double && first checks if the prop exists, and if it does, then renders the element within 
      the boolean expression. If we don't pass a spinner prop, it's value will be undefined and so the spinner component won't be rendered */}
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;