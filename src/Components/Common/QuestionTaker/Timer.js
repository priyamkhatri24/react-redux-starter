import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useInterval } from '../../../Utilities';
import 'react-circular-progressbar/dist/styles.css';
import './Timer.scss';

const Timer = (props) => {
  const { startTime, endTime, isFinished } = props;
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [value, setValue] = useState(100);
  const [duration, setDuration] = useState(0);
  const [progressbarDuration, setprogressBarDuration] = useState(0);

  useEffect(() => {
    const durationTime = endTime - startTime;
    setDuration(durationTime);
    setprogressBarDuration(durationTime);
    setHours(Math.floor(durationTime / 3600));
    setMinutes(Math.floor((durationTime % 3600) / 60));
    setSeconds(Math.floor(durationTime % 60));
  }, [endTime, startTime]);

  useInterval(() => {
    if (seconds > 0) {
      setSeconds(seconds - 1);
    }

    if (seconds === 0) {
      if (minutes === 0) {
        if (hours === 0) {
          isFinished();
        } else {
          setMinutes(59);
          setHours(hours - 1);
        }
      } else {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }
  }, 1000);

  useInterval(() => {
    if (progressbarDuration === 0) return;
    const progress = Math.floor((progressbarDuration / duration) * 100);
    setValue(progress);
    setprogressBarDuration(progressbarDuration - 1);
  }, 1000);

  return (
    <>
      <CircularProgressbar
        value={value}
        styles={buildStyles({
          pathColor: 'var(--primary-blue)',
        })}
        className='Timer__circular'
      />
      <span className='Timer__time my-auto ml-2'>
        {hours < 10 ? `0${hours}` : hours}: {minutes < 10 ? `0${minutes}` : minutes} :
        {seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </>
  );
};

export default Timer;
