import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TrainingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [scheduledDays, setScheduledDays] = useState([]);
  const [completedDays, setCompletedDays] = useState([]);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);

  useEffect(() => {
    // Update current date daily
    const timer = setInterval(
      () => setCurrentDate(new Date()),
      1000 * 60 * 60 * 24,
    );
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const toggleDayStatus = (day) => {
    const dateString = `${selectedYear}-${selectedMonth + 1}-${day}`;
    if (scheduledDays.includes(dateString)) {
      setScheduledDays(scheduledDays.filter((d) => d !== dateString));
      setCompletedDays([...completedDays, dateString]);
    } else if (completedDays.includes(dateString)) {
      setCompletedDays(completedDays.filter((d) => d !== dateString));
    } else {
      setScheduledDays([...scheduledDays, dateString]);
    }
  };

  const getDayStatus = (day) => {
    const dateString = `${selectedYear}-${selectedMonth + 1}-${day}`;
    if (completedDays.includes(dateString)) return "done";
    if (scheduledDays.includes(dateString)) return "scheduled";
    if (
      day === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() &&
      selectedYear === currentDate.getFullYear()
    )
      return "current";
    return null;
  };

  const getDayClass = (status) => {
    switch (status) {
      case "done":
        return "bg-lime-300 text-gray-900";
      case "scheduled":
        return "bg-yellow-400 text-gray-900";
      case "current":
        return "border border-gray-400 border-dashed";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-[#191919] p-4 text-white border border-gray-300/30">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold">Calendar</h2>
        <div className="relative">
          <button
            className="flex items-center rounded-full border border-gray-300/30 px-3 py-1 text-sm text-white/60"
            onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
          >
            {MONTHS[selectedMonth]} {selectedYear}
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {isMonthSelectorOpen && (
            <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg bg-[#0e0e0e] py-2 shadow-xl ">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  className="block w-full px-4 py-1 text-left text-sm capitalize text-gray-300 hover:bg-gray-300/30 hover:text-white"
                  onClick={() => {
                    setSelectedMonth(index);
                    setIsMonthSelectorOpen(false);
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-full p-1 hover:bg-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextMonth}
          className="rounded-full p-1 hover:bg-gray-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const status = getDayStatus(day);
          return (
            <button
              key={day}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${getDayClass(status)} `}
              onClick={() => toggleDayStatus(day)}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-evenly text-xs">
        <div className="mr-4 flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full border border-dashed border-gray-400" />
          Current day
        </div>
        <div className="mr-4 flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-lime-300" />
          Done
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-yellow-400" />
          Scheduled
        </div>
      </div>
    </div>
  );
}
