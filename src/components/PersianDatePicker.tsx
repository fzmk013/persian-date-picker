import React, { useEffect } from "react";
import styled from "styled-components";
import { toPersianDigits } from "../utils/helpers";
import { SelectOptionComponent } from "./SelectOptionComponent";

const isPersianLeapYear = (year: string): boolean => {
  const persianYear = year
    ? +year.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    : 0;
  const leapYears = [1403, 1408];
  return leapYears.includes(persianYear);
};

const getDaysInPersianMonth = (month: string, year: string): number => {
  const monthIndex = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ].indexOf(month);

  if (monthIndex === -1) return 31;
  if (monthIndex <= 5) return 31;
  if (monthIndex <= 10) return 30;
  return isPersianLeapYear(year) ? 30 : 29;
};

export interface PersianDatePickerProps {
  mainLabel?: string;
  labels: {
    day: string;
    month: string;
    year: string;
  };
  order: ("day" | "month" | "year")[];
  value: {
    day: string;
    month: string;
    year: string;
  };
  onChange: (value: { day: string; month: string; year: string }) => void;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  mainLabel,
  labels,
  order,
  value,
  onChange,
}) => {
  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];

  const years = ["1400", "1401", "1402", "1403", "1404", "1405", "1406", "1407", "1408"].map(toPersianDigits);

  const getDaysArray = (month: string, year: string) => {
    const count = getDaysInPersianMonth(month, year);
    return Array.from({ length: count }, (_, i) => toPersianDigits(i + 1));
  };

  const optionsMap = {
    day: getDaysArray(value.month, value.year),
    month: months,
    year: years,
  };

  const disabledStates = {
    year: false,
    month: !value.year,
    day: !value.year || !value.month,
  };

  useEffect(() => {
    if (!value.year || !value.month || !value.day) return;

    const days = getDaysArray(value.month, value.year);
    const currentDay = value.day
      ? +value.day.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      : 0;
    if (currentDay > days.length) {
      onChange({ ...value, day: toPersianDigits("01") });
    }
  }, [value.month, value.year, value.day, onChange]);

  const handleSelect = (field: "day" | "month" | "year", val: string) => {
    const updated = { ...value, [field]: val };

    if (field === "year" && !val) {
      updated.month = "";
      updated.day = "";
    } else if (field === "month" && !val) {
      updated.day = "";
    }

    if ((field === "month" || field === "year") && val && updated.day) {
      const maxDay = getDaysInPersianMonth(
        field === "month" ? val : updated.month,
        field === "year" ? val : updated.year
      );
      const currentDay = updated.day
        ? +updated.day.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
        : 0;
      if (currentDay > maxDay) {
        updated.day = toPersianDigits("01");
      }
    }

    onChange(updated);
  };

  return (
    <div>
      {mainLabel && <Label>{mainLabel}</Label>}
      <Wrapper>
        {order.map((field) => (
          <div className="flex flex-col gap-2 items-start" key={field}>
            <FieldLabel>{labels[field]}</FieldLabel>
            <SelectOptionComponent
              options={optionsMap[field]}
              value={value[field]}
              onChange={(val) => handleSelect(field, val)}
              disabled={disabledStates[field]}
              placeholder="انتخاب"
            />
          </div>
        ))}
      </Wrapper>
    </div>
  );
};

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const FieldLabel = styled.span`
  color: #666;
  font-size: 14px;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    align-items: stretch;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;