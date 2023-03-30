import { useEffect, useState } from 'react';
import { AddAppointment, Appointment, WeekDays } from '.';
import { Days } from '../Config';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { useLocalStorage } from '../utils';

export interface RecommendSlot {
  from: number;
  to: number;
}

export const CalendarView = ({ date }: { date: Date }) => {
  const [appointmentDate, setAppointmentDate] = useState<number>();
  const [weeklyDateArr, setWeeklyDateArr] = useState<number[][]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { getLocalStorage } = useLocalStorage();
  const [showPopup, setShowPopup] = useState<Boolean>(false);
  const [recommendSlot, setRecommendSlot] = useState<
    RecommendSlot | null | undefined
  >();

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

  const getRecomendations = () => {
    const slots = appointmentDate && getLocalStorage(appointmentDate);
    const recSlots = slots
      ?.sort(
        (a: Appointment, b: Appointment) => a.fromTime - b.fromTime
      )
      ?.reduce(
        (
          res: RecommendSlot,
          appointment: Appointment,
          currIndex: number,
          array: Appointment[]
        ) => {
          if (res && Object.keys(res).length) {
            return res;
          } else if (
            currIndex + 1 !== array.length &&
            array[currIndex + 1].fromTime - appointment.toTime >=
              1800000
          ) {
            return {
              from: appointment.toTime,
              to:
                appointment.toTime - array[currIndex + 1].fromTime >
                3600000
                  ? appointment.toTime + 3600000
                  : array[currIndex + 1].fromTime,
            };
          } else if (
            !res &&
            appointmentDate &&
            currIndex === array.length - 1 &&
            appointment.toTime + 1800000 <
              addDays(new Date(appointmentDate), 1).valueOf()
          ) {
            return {
              from: appointment.toTime,
              to:
                appointment.toTime + 3600000 <
                addDays(new Date(appointmentDate), 1).valueOf()
                  ? appointment.toTime + 3600000
                  : appointment.toTime + 1800000,
            };
          }
        },
        {}
      );
    setRecommendSlot(recSlots);
  };

  useEffect(() => {
    getRecomendations();
  }, [appointmentDate]);

  useEffect(() => {
    dateStringToMillies();
  }, [date]);

  useEffect(() => {
    getRecomendations();
  });

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
          recommendSlot={recommendSlot}
          calenderView={true}
        />
      )}
    </div>
  );
};
