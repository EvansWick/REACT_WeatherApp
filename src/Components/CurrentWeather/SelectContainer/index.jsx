import styles from "./SelectContainer.module.sass";
import PropTypes from "prop-types";

function SelectContainer(props) {
  const { title, units, setUnitsState, nameU, defaultVal } = props;

  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <select
        defaultValue={defaultVal}
        onChange={setUnitsState}
        className={styles.select}
        name={nameU}
        id=""
      >
        {units.map((item) => {
          return (
            <option key={item.name} className={styles.option} value={item.name}>
              {item.value}
            </option>
          );
        })}
      </select>
    </div>
  );
}

SelectContainer.propTypes = {
  title: PropTypes.string,
  setUnitsState: PropTypes.func.isRequired,
  units: PropTypes.array.isRequired,
  nameU: PropTypes.string.isRequired,
  defaultVal: PropTypes.string.isRequired,
};

export default SelectContainer;
