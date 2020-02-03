const monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getMondayOfCurrentWeek = (d) => {
  let day = d.getDay();
  let month = d.getMonth();
  let startingDay = d.getDate() + (day == 0?-6:1)-day;

  if (startingDay < 0) {
    month--;

    if (month === -1) {
      month = 11;
    }

    startingDay = monthsDays[month] + startingDay;
  }

  return new Date(d.getFullYear(), month, startingDay);
}

const getSundayOfCurrentWeek = (d) => {
  let day = d.getDay();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?1:8)-day );
}

const getFirstDayOfCurrentMonth = (d) => {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const getLastDayOfCurrentMonth = (d) => {
  let month = d.getMonth();
  return new Date(d.getFullYear(), month, monthsDays[month]);
}

export { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth, getMondayOfCurrentWeek, getSundayOfCurrentWeek };
