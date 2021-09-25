import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import classes from './CustomDurationPicker.module.css';

const CustomDurationPicker = (props) => {
  const { duration, changed } = props;
  const [durationHrs, setDurationHrs] = useState(1);
  const [durationMins, setDurationMins] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  // prettier-ignore
  /* eslint-disable */
  const hrs = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  // prettier-ignore
  /* eslint-disable */
  const mins = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"];
  // prettier-ignore
  /* eslint-disable */
  const secs = ["01", "02", "03", "04", "05","06","07","08","09","10","11", "12", "13", "14", "15","16","17","18","19","20","21", "22", "23", "24", "25","26","27","28","29","30","31", "32", "33", "34", "35","36","37","38","39","40","41", "42", "43", "44", "45","46","47","48","49","50","51", "52", "53", "54", "55","56","57","58","59"];

  const compInfo = [{ hh: '01', mm: '00', ss: '00' }];

  const handleChangeDuration = (event) => {
    setDurationHrs(event.target.value);
    compInfo[0].hh = event.target.value;
    changed({ hours: +event.target.value, minutes: +durationMins, seconds: +durationSecs });
  };
  const handleChangeDurationMins = (event) => {
    setDurationMins(event.target.value);
    compInfo[0].mm = event.target.value;
    changed({ hours: +durationHrs, minutes: +event.target.value, seconds: +durationSecs });
  };
  const handleChangeDurationSecs = (event) => {
    setDurationSecs(event.target.value);
    compInfo[0].ss = event.target.value;
    changed({ hours: +durationHrs, minutes: +durationMins, seconds: +event.target.value });
  };

  return (
    <div className={classes.pickerContainer}>
      <InputLabel id='demo-simple-select-label' className='mb-0'>
        Duration (hh:mm:ss)
      </InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={durationHrs}
        onChange={handleChangeDuration}
      >
        <MenuItem value={1}>01</MenuItem>
        {hrs.map((info) => (
          <MenuItem value={info}>{info}</MenuItem>
        ))}
      </Select>
      :
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={durationMins}
        onChange={handleChangeDurationMins}
      >
        <MenuItem value={0}>00</MenuItem>
        {mins.map((info) => (
          <MenuItem value={info}>{info}</MenuItem>
        ))}
      </Select>
      :
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={durationSecs}
        onChange={handleChangeDurationSecs}
      >
        <MenuItem value={0}>00</MenuItem>
        {secs.map((info) => (
          <MenuItem value={info}>{info}</MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CustomDurationPicker;

CustomDurationPicker.propTypes = {
  duration: PropTypes.instanceOf(Object).isRequired,
  changed: PropTypes.func.isRequired,
};
