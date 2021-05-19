import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import parse from 'date-fns/parse';
import './Analysis.scss';

const AnalysisCalendar = (props) => {
  const { attendance } = props;
  const [value, setValue] = useState(new Date());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    console.log(attendance, 'atten');

    const newAttendance = attendance.map((e) => {
      e.date = parse(e.time_of_attendance, 'dd MMM yyyy', new Date());
      return e;
    });

    setDates(newAttendance);
  }, [attendance]);

  const isSameDay = (a, b) => {
    return differenceInCalendarDays(a, b) === 0;
  };

  const onChange = (nextValue) => {
    setValue(nextValue);
  };
  // eslint-disable-next-line
  const tileClassName = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (dates.find((dDate) => isSameDay(dDate.date, date) && dDate.value === 'P')) {
        return 'Analysis__present';
      }
      if (dates.find((dDate) => isSameDay(dDate.date, date) && dDate.value === 'A')) {
        return 'Analysis__absent';
      }
      if (dates.find((dDate) => isSameDay(dDate.date, date) && dDate.value === 'L')) {
        return 'Analysis__leave';
      }
    }
  };

  return <Calendar onChange={onChange} value={value} tileClassName={tileClassName} />;
};

export default AnalysisCalendar;

AnalysisCalendar.propTypes = {
  attendance: PropTypes.instanceOf(Array).isRequired,
};
