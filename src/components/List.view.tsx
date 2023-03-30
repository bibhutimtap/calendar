import { addHours } from 'date-fns';
import { useEffect, useState } from 'react';
import { AddAppointment, Appointment, TimeSlots } from '.';
import { useLocalStorage } from '../utils';

export const ListView = ({
  selectedDate,
}: {
  selectedDate: Date;
}) => {
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(-1);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { getLocalStorage } = useLocalStorage();

  useEffect(() => {
    setSlots(
      Array(24)
        .fill(0)
        .map(
          (_, index) =>
            selectedDate.valueOf() + index * 60 * 60 * 1000
        )
    );
    getLatestAppointments();
  }, [selectedDate]);

  const getLatestAppointments = () => {
    const _appointments = getLocalStorage(selectedDate.valueOf());
    setAppointments(_appointments);
  };

  useEffect(() => {
    setShowPopup(false);
  }, [appointments]);

  return (
    <div className='mt-5 w-full'>
      <div>
        {slots?.map((slot, index) => {
          const from = slot;
          const to =
            index === slots.length - 1
              ? addHours(new Date(slot), 1).valueOf()
              : slots[index + 1];
          return (
            <div
              key={slot}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlot(index);
                setShowPopup(true);
              }}>
              <TimeSlots
                selectedSlot={selectedSlot}
                index={index}
                key={slot}
                appointments={appointments?.filter(
                  (appointment) =>
                    appointment.toTime >= from &&
                    appointment.fromTime <= to
                )}
              />
              {showPopup && selectedSlot === index && (
                <AddAppointment
                  from={slot}
                  to={
                    index === slots.length - 1
                      ? addHours(new Date(slot), 1).valueOf()
                      : slots[index + 1]
                  }
                  getLatestAppointments={getLatestAppointments}
                  closePopup={(e) => {
                    e.stopPropagation();
                    setShowPopup(false);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
