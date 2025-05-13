import dayjs from 'dayjs';
import {FORMAT_TIME, FORMAT_DAY, FORMAT_DATETIME} from './const';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const formatTime = (time) => dayjs(time).format(FORMAT_TIME);

const formatEventDate = (date) => dayjs(date).format(FORMAT_DAY);

const formatDateTime = (date) => dayjs(date).format(FORMAT_DATETIME);

const calculateDuration = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffInMinutes = end.diff(start, 'minute');

  const days = Math.floor(diffInMinutes / (60 * 24));
  const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
  const minutes = diffInMinutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

const formatTimeRange = (startDate, endDate) => `${formatTime(startDate)} — ${formatTime(endDate)}`;

const isEscapeKey = (evt) => evt.key === 'Escape';

function isFuturedPoint(point) {
  return dayjs().isBefore(point.date_from);
}

function isPresentedPoint(point) {
  return dayjs().isAfter(point.date_from) && dayjs().isBefore(point.date_to);
}

function isPastedPoint(point) {
  return dayjs().isAfter(point.date_to);
}

const sortPointsByDay = (pointA, pointB) => {
  const dateA = dayjs(pointA.date_from);
  const dateB = dayjs(pointB.date_from);

  if (dateA.isSame(dateB)) {
    return dayjs(pointA.date_to).diff(dayjs(pointB.date_to));
  }

  return dateA.diff(dateB);
};
const sortPointsByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.date_to).diff(dayjs(pointA.date_from));
  const durationB = dayjs(pointB.date_to).diff(dayjs(pointB.date_from));
  return durationB - durationA;
};

const sortPointsByPrice = (pointA, pointB) => pointB.base_price - pointA.base_price;

const getValidDate = (dateString) =>
  dateString && dayjs(dateString).isValid() ? dayjs(dateString).toDate() : null;

const formatToISO = (date) => dayjs(date).toISOString();

export {getRandomArrayElement, formatEventDate, calculateDuration, formatTimeRange, formatDateTime, isEscapeKey, isFuturedPoint, isPresentedPoint, isPastedPoint, sortPointsByDay, sortPointsByTime, sortPointsByPrice, getValidDate, formatToISO};
