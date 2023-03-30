import { format } from 'date-fns';

export interface Appointment {
  title: string;
  fromTime: number;
  toTime: number;
}

export const TimeSlots = ({
  index,
  selectedSlot,
  appointments,
}: {
  index: number;
  selectedSlot: number;
  appointments: Appointment[];
}) => {
  return (
    <div>
      <div className='-mt-6 mr-3 w-fit'>
        {index > 12 ? index - 12 : index}
        {index > 11 ? 'PM' : 'AM'}
      </div>
      <div
        className={`flex p-2 ml-12 border-solid border-b-2 border-x-2 ${
          !index && 'border-t-2'
        } border-indigo-600 cursor-pointer ${
          selectedSlot === index ? 'bg-zinc-300' : ''
        }`}>
        <div
          className={`p-2 flex flex-row gap-1`}
          style={{ minHeight: '30px' }}>
          {appointments?.map((appointment, index) => (
            <div
              className='bg-indigo-400	rounded px-5'
              key={appointment.title + index}>
              <div>{appointment.title} </div>
              <div>
                {format(new Date(appointment.fromTime), 'h:mm aa')} -{' '}
                {format(new Date(appointment.toTime), 'h:mm aa')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
