export const meaningSecond = (second) => {
  if (second === '*') {
    return '每秒钟执行';
  }
  if (second.includes('-')) {
    return `从${second}秒，每秒执行`;
  }
  if (second.includes('/')) {
    const arr = second.split('/');
    return `从${arr[0]}秒开始，每隔${arr[1]}秒执行`;
  }
  return `第${second}秒执行`;
};

export const meaningMinute = (minute) => {
  if (minute === '*') {
    return '每分钟';
  }
  if (minute.includes('-')) {
    return `从${minute}分，每分`;
  }
  if (minute.includes('/')) {
    const arr = minute.split('/');
    return `从${arr[0]}分开始，每隔${arr[1]}分`;
  }
  return `第${minute}分`;
};

export const meaningHour = (hour) => {
  if (hour === '*') {
    return '每小时';
  }
  if (hour.includes('-')) {
    return `从${hour}时，每小时`;
  }
  if (hour.includes('/')) {
    const arr = hour.split('/');
    return `从${arr[0]}时开始，每隔${arr[1]}小时`;
  }
  return `第${hour}时`;
};
export const meaningDay = (day) => {
  if (day === '*') {
    return '每日';
  }
  if (day === '?') {
    return '';
  }
  if (day.includes('-')) {
    return `从${day}日，每日`;
  }
  if (day.includes('/')) {
    const arr = day.split('/');
    return `从${arr[0]}日开始，每隔${arr[1]}日`;
  }
  return `第${day}日`;
};
export const meaningMonth = (month) => {
  if (month === '*') {
    return '每月';
  }
  if (month.includes('-')) {
    return `从${month}月，每月`;
  }
  if (month.includes('/')) {
    const arr = month.split('/');
    return `从${arr[0]}月开始，每隔${arr[1]}月`;
  }
  return `第${month}月`;
};

export const WEEK_ENUM = {
  SUN: '星期日',
  MON: '星期一',
  TUE: '星期二',
  WED: '星期三',
  THU: '星期四',
  FRI: '星期五',
  SAT: '星期六',
};
export const meaningWeek = (week) => {
  if (week === '*') {
    return '每周';
  }
  if (week === '?') {
    return '';
  }
  if (week.includes('-')) {
    const arr = week.split('-');
    const first = WEEK_ENUM[arr[0]];
    const last = WEEK_ENUM[arr[1]];

    return `从${first}-${last}，每天`;
  }
  if (week.includes('#')) {
    const arr = week.split('#');
    const last = WEEK_ENUM[arr[1]];
    return `从本月第${arr[0]}周的${last}`;
  }
  if (week.endsWith('L')) {
    const arr = week.split('L');
    const first = WEEK_ENUM[arr[0]];
    return `本月的最后一个${first}`;
  }
  return `的${week.split(',').map((key) => WEEK_ENUM[key])}`;
};
export const meaningYear = (year) => {
  if (year === '*') {
    return '每年';
  }
  if (year === '?') {
    return '';
  }
  if (year.includes('-')) {
    return `从${year}年，每年`;
  }
  if (year.includes('/')) {
    const arr = year.split('/');
    return `从${arr[0]}年开始，每隔${arr[1]}年在`;
  }
  return `第${year}年`;
};
export const meaning = (second, minute, hour, day, month, week, year) => {
  const secondMeaning = meaningSecond(second);
  const minuteMeaning = meaningMinute(minute);
  const hourMeaning = meaningHour(hour);
  const dayMeaning = meaningDay(day);
  const monthMeaning = meaningMonth(month);
  const weekMeaning = meaningWeek(week);
  const yearMeaning = meaningYear(year);
  return `${yearMeaning}${monthMeaning}${weekMeaning}${dayMeaning}${hourMeaning}${minuteMeaning}${secondMeaning}`;
};
