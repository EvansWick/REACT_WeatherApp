import React, { useState, useEffect } from "react";
import WeatherBlockContainer from "./WeatherBlockContainer";
import SelectContainer from "./SelectContainer";
import styles from "./CurrentWeather.module.sass";

const WEATHER_UNITS = {
  WIND_SPEED: {
    MS: { name: "ms", value: "m/s" },
    KH: { name: "kh", value: "k/h" },
  },
  TEMPERATURE: {
    FAHRENHEIT: { name: "fahrenheit", value: "oF" },
    CELSIUS: { name: "celsius", value: "oC" },
  },
};

const getWeathersUnitsArray = () => {
  const arr = Object.values(WEATHER_UNITS).map((unitGroup) => {
    return Object.values(unitGroup);
  });
  console.log(arr);
};

const selectUnitsNames = {
  temperature: "tempU",
  windSpeed: "windU",
};

function CurrentWeather() {
  // getWeathersUnitsArray();
  const [units, setUnits] = useState({
    windSpeedUnit: { name: "ms", value: "m/s" },
    temperatureUnit: { name: "celsius", value: "oC" },
  });
  const [weatherData, setWeatherData] = useState({
    windSpeed: "20",
    temperature: "30",
  });

  const [loadStatus, setLoadStatus] = useState({
    isFetching: false,
    error: null,
  });

  const loadWeather = () => {
    setLoadStatus((prevstatus) => {
      return { ...prevstatus, isFetching: true };
    });
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_direction_10m,wind_speed_10m",
    )
      .then((res) => {
        return res.json();
      })
      .then(
        ({ current: { wind_speed_10m, temperature_2m }, current_units }) => {
          // Встановлення стану погоди
          setWeatherData((prevWeather) => ({
            ...prevWeather,
            windSpeed: wind_speed_10m,
            temperature: temperature_2m,
          }));
          // Встановлення стану одиниць вимірювання погоди
          // setUnits((prevUnits) => ({
          //   ...prevUnits,
          //   windSpeedUnit: current_units.wind_speed_10m,
          //   temperatureUnit: current_units.temperature_2m,
          // }));
        },
      )
      .catch((e) => {
        setLoadStatus((prevstatus) => ({ ...prevstatus, error: e }));
      })
      .finally(() => {
        setLoadStatus((prevstatus) => ({ ...prevstatus, isFetching: false }));
      });
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const setUnitsState = ({ target: { value, checked, name, type } }) => {
    console.log(name);

    const newVal = type === "checkbox" ? checked : value;
    setUnits((prevU) => ({ ...prevU, [name]: newVal }));
    loadWeather();
  };

  const { error, isFetching } = loadStatus;
  return (
    <div className={styles.container}>
      <WeatherBlockContainer>
        <SelectContainer
          title="Wind speed unit"
          units={Object.values(WEATHER_UNITS.WIND_SPEED)[0]}
          setUnitsState={setUnitsState}
          nameU={"windSpeedUnit"}
        />
        <SelectContainer
          title="Temperature unit"
          units={Object.values(WEATHER_UNITS.TEMPERATURE)[1]}
          nameU={"temperatureUnit"}
          setUnitsState={setUnitsState}
        />
      </WeatherBlockContainer>
      <WeatherBlockContainer title="CurrentWeather">
        {isFetching && <span>Loading</span>}
        {error && <span>Error: {error.message}</span>}
        {!error &&
          !isFetching &&
          [
            { key: weatherData.temperature, unit: units.temperatureUnit },
            { key: weatherData.windSpeed, unit: units.windSpeedUnit },
          ].map((item) => {
            return (
              <div key={item.unit} className={styles.weatherBlockItem}>
                {item.key + " "} <span>{item.unit}</span>
              </div>
            );
          })}
      </WeatherBlockContainer>
    </div>
  );
}

export default CurrentWeather;
