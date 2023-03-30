import React, { useState } from 'react';
import './App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarView, ListView } from './components';
import { startOfDay } from 'date-fns';

enum ViewType {
  Calendar = 'Calendar',
  List = 'List',
}

function App() {
  const [selectedDate, setSelectedDate] = useState<any>(
    startOfDay(new Date()).valueOf()
  );
  const [viewType, setViewType] = useState<ViewType>(ViewType.List);

  return (
    <div className='flex'>
      <div className='p-5'>
        <Calendar
          minDate={startOfDay(new Date())}
          onChange={(x) => {
            setSelectedDate(x?.valueOf());
          }}
          value={new Date(selectedDate)}
        />
      </div>
      <div className='flex flex-col justify-center items-center	 w-full p-5'>
        <button
          className='button border-solid border-2 border-indigo-600 cursor-pointer rounded p-2 mb-2'
          onClick={() =>
            setViewType(
              viewType === ViewType.Calendar
                ? ViewType.List
                : ViewType.Calendar
            )
          }>
          Show{' '}
          {viewType === ViewType.Calendar
            ? ViewType.List
            : ViewType.Calendar}{' '}
          View
        </button>
        {viewType === ViewType.Calendar ? (
          <CalendarView date={new Date(selectedDate)} />
        ) : (
          <ListView selectedDate={new Date(selectedDate)} />
        )}
      </div>
    </div>
  );
}

export default App;
