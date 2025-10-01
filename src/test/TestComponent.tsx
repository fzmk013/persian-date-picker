import { useState } from 'react';
import { PersianDatePicker } from '../components/PersianDatePicker';

export const TestComponent = () => {
  const [date, setDate] = useState({
    day: '',
    month: '', 
    year: ''
  });

  return (
    <div dir='rtl'>
    <PersianDatePicker
      mainLabel="تاریخ تولد"
      labels={{
        day: "روز",
        month: "ماه",
        year: "سال"
      }}
      order={['year', 'month', 'day']}
      value={date}
      onChange={setDate}
      />
      </div>
  );
};