import { format, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { Appointment } from '.';
import { useLocalStorage } from '../utils';

export const WeekDays = ({
  dates,
  selectedDay,
  appointmentDate,
  setAppointmentDate,
}: {
  dates: number[];
  selectedDay: number;
  appointmentDate: number | undefined;
  setAppointmentDate: (date: number) => void;
}) => {
  const { getLocalStorage } = useLocalStorage();

  return (
    <>
      {dates?.map((day: number, index: number) => (
        <div
          onClick={() =>
            day > 0 &&
            day >= startOfDay(new Date()).valueOf() &&
            setAppointmentDate(day)
          }
          key={`day_${index}`}
          className={`border border-inherit text-center flex flex-col	gap-1 ${
            appointmentDate === day && 'bg-slate-200'
          }`}>
          <div
            className={`${
              selectedDay === new Date(day).getDate()
                ? 'mx-16 rounded-full bg-sky-500/100'
                : ''
            }`}>
            {day > 0 && new Date(day).getDate()}
          </div>
          {getLocalStorage(day).map((appointment: Appointment) => (
            <div
              className='bg-indigo-400	rounded'
              key={appointment.title + appointment.fromTime}>
              <div>{appointment.title} </div>
              <div>
                {format(new Date(appointment.fromTime), 'h:mm aa')} -{' '}
                {format(new Date(appointment.toTime), 'h:mm aa')}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
