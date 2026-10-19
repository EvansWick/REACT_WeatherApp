import React, { useState, useEffect } from "react";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { FaWind } from "react-icons/fa6";
import WeatherBlockContainer from "./WeatherBlockContainer";
import SelectContainer from "./SelectContainer";
import styles from "./CurrentWeather.module.sass";

const RELOAD_WEATHER_INTERVAL = 60000;

const WEATHER_UNITS = {
  WIND_SPEED: {
    MS: { name: "ms", value: "М/с" },
    KMH: { name: "kmh", value: "Км/год" },
  },
  TEMPERATURE: {
    FAHRENHEIT: { name: "fahrenheit", value: "°F" },
    CELSIUS: { name: "celsius", value: "°C" },
  },
};

const unitLibrary = new Map([
  ["ms", WEATHER_UNITS.WIND_SPEED.MS.value],
  ["kmh", WEATHER_UNITS.WIND_SPEED.KMH.value],
  ["celsius", WEATHER_UNITS.TEMPERATURE.CELSIUS.value],
  ["fahrenheit", WEATHER_UNITS.TEMPERATURE.FAHRENHEIT.value],
]);

const WEATHER_ICONS = {
  windSpeed: <FaWind />,
  temperature: <LiaTemperatureLowSolid />,
};

function CurrentWeather() {
  // start weather data
  const [units, setUnits] = useState({
    windSpeedUnit: { name: "ms", value: WEATHER_UNITS.WIND_SPEED.MS.value },
    temperatureUnit: {
      name: "celsius",
      value: WEATHER_UNITS.TEMPERATURE.CELSIUS.value,
    },
  });
  const [weatherData, setWeatherData] = useState({
    windSpeed: "20",
    temperature: "30",
  });

  const [loadStatus, setLoadStatus] = useState({
    isFetching: false,
    error: null,
  });

  const getWeatherResultsArray = () => {
    // При доданні параметрів крім температури і швидкості вітру, можна дописати функцію
    return [
      {
        key: weatherData.temperature,
        unit: units.temperatureUnit,
        type: "temperature",
      },
      {
        key: weatherData.windSpeed,
        unit: units.windSpeedUnit,
        type: "windSpeed",
      },
    ];
  };

  const loadWeather = () => {
    setLoadStatus((prevstatus) => {
      return { ...prevstatus, isFetching: true };
    });
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_direction_10m,wind_speed_10m&wind_speed_unit=${units.windSpeedUnit.name}&temperature_unit=${units.temperatureUnit.name}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(({ current: { wind_speed_10m, temperature_2m } }) => {
        // Встановлення стану погоди
        setWeatherData((prevWeather) => ({
          ...prevWeather,
          windSpeed: wind_speed_10m,
          temperature: temperature_2m,
        }));
      })
      .catch((e) => {
        setLoadStatus((prevstatus) => ({ ...prevstatus, error: e }));
      })
      .finally(() => {
        setLoadStatus((prevstatus) => ({ ...prevstatus, isFetching: false }));
      });
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(() => {
      console.log("reloaded weather");
      return loadWeather;
    }, RELOAD_WEATHER_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const setUnitsState = ({ target: { value, checked, name, type } }) => {
    const newVal = type === "checkbox" ? checked : value;

    setUnits((prevU) => ({
      ...prevU,
      [name]: { name: newVal, value: unitLibrary.get(newVal) },
    })); //
    loadWeather();
  };

  const { error, isFetching } = loadStatus;
  return (
    <div className={styles.container}>
      <WeatherBlockContainer>
        <SelectContainer
          title="Швидкість вітру"
          units={Object.values(WEATHER_UNITS.WIND_SPEED)}
          setUnitsState={setUnitsState}
          nameU={"windSpeedUnit"}
          defaultVal={units.windSpeedUnit.name}
        />
        <SelectContainer
          title="Температура"
          units={Object.values(WEATHER_UNITS.TEMPERATURE)}
          nameU={"temperatureUnit"}
          defaultVal={units.temperatureUnit.name}
          setUnitsState={setUnitsState}
        />
      </WeatherBlockContainer>
      <WeatherBlockContainer title="Поточна погода">
        {isFetching && (
          <span className={styles.loadingStyle}>Завантаження</span>
        )}
        {error && <span>Error: {error.message}</span>}
        {!error &&
          !isFetching &&
          getWeatherResultsArray().map((item) => {
            return (
              <div key={item.unit.name} className={styles.weatherBlockItem}>
                {WEATHER_ICONS[item.type]}
                <span className={styles.weatherValue}>{item.key}</span>
                {/* Клас для виокремлення одинииць виміру. Можна зробити температуру згідно одиниць і type */}
                <span className={styles.unitStyle}>{item.unit.value}</span>
              </div>
            );
          })}
      </WeatherBlockContainer>
    </div>
  );
}

export default CurrentWeather;
