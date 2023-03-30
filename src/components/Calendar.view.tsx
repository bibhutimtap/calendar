import { useEffect, useState } from 'react';
import { AddAppointment, WeekDays } from '.';
import { Days } from '../Config';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { useLocalStorage } from '../utils';

export const CalendarView = ({ date }: { date: Date }) => {
  const [appointmentDate, setAppointmentDate] = useState<number>();
  const [weeklyDateArr, setWeeklyDateArr] = useState<number[][]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { getLocalStorage } = useLocalStorage();
  const [showPopup, setShowPopup] = useState<Boolean>(false);

  const getDateDetails = () => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return { day, month, year };
  };

  const dateStringToMillies = () => {
    const { day, month, year } = getDateDetails();

    setSelectedDay(day);
    const firstOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    let currDate = 1;
    let _weeklyDateArr = [];
    let currWeekArr = Array(firstOfMonth.getDay()).fill(0);

    while (
      currWeekArr.length < 7 &&
      currDate <= endOfMonth.getDate()
    ) {
      currWeekArr.push(addDays(firstOfMonth, currDate - 1).valueOf());
      if (currWeekArr.length === 7) {
        _weeklyDateArr.push(currWeekArr);
        currWeekArr = [];
      }
      if (currDate === endOfMonth.getDate()) {
        _weeklyDateArr.push([
          ...currWeekArr,
          ...Array(7 - currWeekArr.length).fill(0),
        ]);
        currWeekArr = [];
      }
      currDate += 1;
    }
    setWeeklyDateArr(_weeklyDateArr);
  };

  useEffect(() => {
    dateStringToMillies();
  }, [date]);

  return (
    <div className='h-screen w-full'>
      <div className='grid grid-cols-7 h-12'>
        {Days.map((day, index) => (
          <div
            key={`${day}_${index}`}
            className='border border-inherit text-center'>
            {day}
          </div>
        ))}
      </div>
      {weeklyDateArr?.map((dateArr: number[], index) => (
        <div key={`week_${index}`} className='grid grid-cols-7 h-40'>
          <WeekDays
            dates={dateArr}
            selectedDay={selectedDay}
            appointmentDate={appointmentDate}
            setAppointmentDate={(date) => {
              setShowPopup(true);
              setAppointmentDate(date);
            }}
          />
        </div>
      ))}

      {showPopup && appointmentDate && (
        <AddAppointment
          from={startOfDay(new Date(appointmentDate)).valueOf()}
          to={endOfDay(new Date(appointmentDate)).valueOf()}
          getLatestAppointments={() => setShowPopup(false)}
          closePopup={() => setShowPopup(false)}
          calenderView={true}
        />
      )}
    </div>
  );
};
