import React from "react";
import styles from "./SelectContainer.module.sass";
import PropTypes from "prop-types";

function SelectContainer(props) {
  const { title, units, setUnitsState } = props;

  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <select
        onChange={setUnitsState}
        className={styles.select}
        name={title}
        id=""
      >
        {units.map((item) => {
          return (
            <option key={item} className={styles.option} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}

SelectContainer.propTypes = {
  title: PropTypes.string,
  setUnitsState: PropTypes.func,
  units: PropTypes.array,
};

export default SelectContainer;
