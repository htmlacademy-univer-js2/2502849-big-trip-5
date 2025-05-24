import dayjs from 'dayjs';
import {FORMAT_TIME, FORMAT_DAY, FORMAT_DATETIME} from './const';

const toDayjs = (date) => dayjs(date);
const format = (date, formatStr) => toDayjs(date).format(formatStr);
const isValidDate = (date) => date && toDayjs(date).isValid();

export const formatTime = (time) => format(time, FORMAT_TIME);
export const formatEventDate = (date) => format(date, FORMAT_DAY);
export const formatDateTime = (date) => format(date, FORMAT_DATETIME);
export const formatToISO = (date) => toDayjs(date).toISOString();

export const isFuturedPoint = (point) => toDayjs(point.date_from).isAfter(dayjs());
export const isPresentedPoint = (point) => toDayjs(point.date_from).isBefore(dayjs()) && toDayjs(point.date_to).isAfter(dayjs());
export const isPastedPoint = (point) => toDayjs(point.date_to).isBefore(dayjs());

export const calculateDuration = (startDate, endDate) => {
  const diffMinutes = toDayjs(endDate).diff(toDayjs(startDate), 'minute');
  const days = Math.floor(diffMinutes / 1440);
  const hours = Math.floor((diffMinutes % 1440) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const formatTimeRange = (startDate, endDate) => `${formatTime(startDate)} — ${formatTime(endDate)}`;

export const sortPointsByDay = (pointA, pointB) => {
  const diff = toDayjs(pointA.date_from).diff(toDayjs(pointB.date_from));
  return diff === 0 ? toDayjs(pointA.date_to).diff(toDayjs(pointB.date_to)) : diff;
};

export const sortPointsByTime = (pointA, pointB) => toDayjs(pointB.date_to).diff(toDayjs(pointB.date_from)) - toDayjs(pointA.date_to).diff(toDayjs(pointA.date_from));

export const sortPointsByPrice = (pointA, pointB) => pointB.base_price - pointA.base_price;

export const getValidDate = (dateString) => isValidDate(dateString) ? toDayjs(dateString).toDate() : null;

export const isEscapeKey = (evt) => evt.key === 'Escape';
