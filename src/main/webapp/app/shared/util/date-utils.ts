import moment from 'moment';

import { APP_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { IChrono } from './chrono.model';
import { EventRecurrence } from '../model/enumerations/event-recurrence.model';
import { translate } from 'react-jhipster';
import { ProcessEventRecurrence } from '../model/enumerations/process-event-recurrence.model';
import { AuditEventRecurrence } from '../model/enumerations/audit-event-recurrence.model';

export const convertDateTimeFromServer = date => (date ? moment(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? moment(date, APP_LOCAL_DATETIME_FORMAT_Z).toDate() : null);

export const convertDateFromServer = date => (date ? moment(date).format(APP_LOCAL_DATE_FORMAT) : null);

export const convertDateToServer = date => (date ? moment(date, APP_LOCAL_DATE_FORMAT).toDate() : null);

export const displayDefaultDateTime = () => moment().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

export const displayDefaultDate = () => moment().startOf('day').format(APP_DATE_FORMAT);

export const createDateFromString = (dateString): Date => {
  try {
    if (dateString) return new Date(dateString);
  } catch (error) {
    // show error
  }
  return null;
};

export const getMilliSecondsBetweenToDate = (startDate: Date, endDate: Date): number => endDate.getTime() - startDate.getTime();

export const addToDate = (initDate: Date, data: IChrono): Date => {
  if (data.nbYears) initDate.setFullYear(initDate.getFullYear() + data.nbYears);
  if (data.nbMonths) initDate.setMonth(initDate.getMonth() + data.nbMonths);
  // adding days
  if (data.nbDays) initDate.setTime(initDate.getTime() + data.nbDays * 24 * 60 * 60 * 1000);
  // adding hours
  if (data.nbHours) initDate.setTime(initDate.getTime() + data.nbHours * 60 * 60 * 1000);
  // adding minuites
  if (data.nbMinutes) initDate.setTime(initDate.getTime() + data.nbMinutes * 60 * 1000);
  // adding seconds
  if (data.nbSeconds) initDate.setTime(initDate.getTime() + data.nbSeconds * 1000);
  return initDate;
};

export const removeToDate = (initDate: Date, data: IChrono): Date => {
  if (data.nbYears) initDate.setFullYear(initDate.getFullYear() - data.nbYears);
  if (data.nbMonths) initDate.setMonth(initDate.getMonth() - data.nbMonths);
  // remove days
  if (data.nbDays) initDate.setTime(initDate.getTime() - data.nbDays * 24 * 60 * 60 * 1000);
  // remove hours
  if (data.nbHours) initDate.setTime(initDate.getTime() - data.nbHours * 60 * 60 * 1000);
  // remove minuites
  if (data.nbMinutes) initDate.setTime(initDate.getTime() - data.nbMinutes * 60 * 1000);
  // remove seconds
  if (data.nbSeconds) initDate.setTime(initDate.getTime() - data.nbSeconds * 1000);
  return initDate;
};

export const formateDate = (date: Date, pattern: string) => moment(date).format(pattern);

export const getDayPosOfMonthFormDate = (date: Date) => {
  let dayPos = 0;
  if (date) {
    const dateTime = new Date(date.getFullYear(), date.getMonth(), 1);
    while (dateTime.getMonth() === date.getMonth()) {
      if (dateTime.getDay() === date.getDay()) dayPos = dayPos + 1;
      if (dateTime.getDate() === date.getDate()) break;
      // incrementation
      dateTime.setDate(dateTime.getDate() + 1);
    }
  }
  return dayPos !== 0 ? dayPos : 1;
};

export const getEventOccurenceLabel = (date?: Date, occurance?: EventRecurrence | ProcessEventRecurrence | AuditEventRecurrence) => {
  const dateTime = date || new Date();
  const oc = occurance || EventRecurrence.ALLAWAYS;
  if (oc.toString() === EventRecurrence.EVERY_WEEK_ON_DAY.toString()) {
    const dayName = `${translate('_calendar.day.' + dateTime.getDay())}`;
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.EVERY_WEEK_ON_DAY.toString(), { dayName })}`;
  }

  if (oc.toString() === EventRecurrence.EVERY_YEAR_ON_DATE.toString()) {
    const dateName = `${dateTime.getDate()} ${translate('_calendar.month.' + dateTime.getMonth())}`;
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.EVERY_YEAR_ON_DATE.toString(), { date: dateName })}`;
  }

  if (oc.toString() === EventRecurrence.EVERY_MONTH_OF_DAY_POSITION.toString()) {
    const dayPosition = getDayPosOfMonthFormDate(dateTime) || 1;
    const dayName = `${translate('_calendar.day.' + dateTime.getDay())}`;
    const dayPosName = `${translate('_calendar.day.pos.' + dayPosition, { day: dayName })}`;
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.EVERY_MONTH_OF_DAY_POSITION.toString(), {
      dayPos: dayPosName,
    })}`;
  }

  if (oc.toString() === EventRecurrence.EVERY_MONTH.toString()) {
    const dteName = `${formateDate(dateTime, 'DD')} ${translate('_global.label.to')} ${formateDate(dateTime, 'HH')}H:${formateDate(
      dateTime,
      'mm'
    )}`;
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.EVERY_MONTH.toString(), { date: dteName })}`;
  }

  if (oc.toString() === EventRecurrence.ONCE.toString()) {
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.ONCE.toString())}`;
  }

  if (oc.toString() === EventRecurrence.ALLAWAYS.toString() || oc.toString() === EventRecurrence.WEEK.toString()) {
    return `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.ALLAWAYS.toString())}`;
  }

  return '';
};

export const getEventOccurenceStrDateValue = (date?: Date, occurance?: EventRecurrence | ProcessEventRecurrence | AuditEventRecurrence) => {
  const dateTime = date || new Date();
  if (occurance && (occurance.toString() === EventRecurrence.ALLAWAYS || occurance.toString() === EventRecurrence.WEEK)) {
    const output = `${translate('microgatewayApp.EventRecurrence.' + ProcessEventRecurrence.ALLAWAYS.toString())}`;
    // output = `${output} ${translate('_global.label.to')} ${formateDate(dateTime, 'HH')}H:${formateDate(dateTime, 'mm')}`;
    return output;
  }

  return `${translate('_calendar.day.short.' + dateTime.getDay())} ${formateDate(
    dateTime,
    `DD/MM/YYYY` // ${translate('_global.label.to')} HH:mm`
  )}`;
};
