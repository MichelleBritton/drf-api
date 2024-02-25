import React from 'react'
import styles from '../styles/Avatar.module.css';

// To make our code neater, we can destructure our props in place by moving our destructured variables into the function parameter brackets
const Avatar = ({ src, height = 45, text }) => {
  return <span>
    <img className={styles.Avatar} src={src} height={height} width={height} alt="avatar" />
    {text}
    </span>;
};

export default Avatar;