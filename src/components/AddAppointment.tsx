import { format, startOfDay } from 'date-fns';
import React, { useState } from 'react';
import { useLocalStorage } from '../utils';
import { DropDown } from './Drop.down';

export interface DropDownMenu {
  key: string;
  value: number;
}

export function AddAppointment({
  from,
  to,
  getLatestAppointments,
  closePopup,
  calenderView,
}: {
  from: number;
  to: number;
  getLatestAppointments: () => void;
  closePopup: (e: any) => void;
  calenderView?: boolean;
}) {
  const [title, setTitle] = useState<string>('');
  const [fromTime, setFromTime] = useState<number>(from);
  const [toTime, setToTime] = useState<number>(to);
  const { setLocalStorage, getLocalStorage } = useLocalStorage();

  const getTimeIntervals = (from: number) => {
    return Array(calenderView ? 48 : 13)
      .fill({})
      .map((_, index) => {
        const time =
          from + (calenderView ? 30 : 5) * index * 60 * 1000;
        return { key: format(new Date(time), 'h:mm a'), value: time };
      });
  };

  const validateForm = () => {
    if (!title) {
      return alert('Please add some title to the appointment');
    } else if (fromTime > toTime) {
      return alert(
        'Appointment start time cant not be greater than end time'
      );
    }
    const selectedDate = startOfDay(new Date(from)).valueOf();
    const existingApp = getLocalStorage(selectedDate);
    setLocalStorage(selectedDate, [
      ...(existingApp ? existingApp : []),
      { title, fromTime, toTime },
    ]);
    getLatestAppointments();
  };

  const timeSlotList = getTimeIntervals(from);

  return (
    <div
      className={`left-2/4 absolute bg-slate-50 flex min-h-mid items-center justify-center py-12 px-4 sm:px-6 lg:px-8${
        calenderView && ' absolute top-1/4'
      }`}>
      <div className='w-full max-w-md space-y-8'>
        <div>
          {calenderView && (
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              {format(new Date(from), 'do MMM yyyy')}
            </h2>
          )}
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Add New Appointment
          </h2>
        </div>
        <div className='mt-8 space-y-6'>
          <div>
            <label>Add Title</label>
            <input
              name='title'
              type='text'
              required
              className='relative block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Add title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='flex justify-between'>
            <DropDown
              label='From'
              menuItems={timeSlotList}
              selectedHour={fromTime}
              onSelect={(value: number) => setFromTime(value)}
            />
            <DropDown
              label='To'
              menuItems={timeSlotList.filter(
                (slot) => slot.value > fromTime
              )}
              selectedHour={toTime}
              onSelect={(value: number) => setToTime(value)}
            />
          </div>

          <div className='flex gap-4'>
            <button
              className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={validateForm}>
              Add Appointment
            </button>
            <button
              className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
