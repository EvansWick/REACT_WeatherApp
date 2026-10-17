import React from "react";
import PropTypes from "prop-types";

import styles from "./WeatherBlockContainer.module.sass";

function WeatherBlockContainer(props) {
  const { title } = props;

  return (
    <div className={styles.block}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.childrenContainer}>{props.children}</div>
    </div>
  );
}

WeatherBlockContainer.propTypes = {
  title: PropTypes.string,
  isChildrenArrayObject: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default WeatherBlockContainer;
