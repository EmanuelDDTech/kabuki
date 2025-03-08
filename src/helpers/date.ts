import { parse, formatISO, parseISO, format } from 'date-fns';
import es from 'date-fns/locale/es';

export function convertToISO(strDate) {
  const isoDate = parseISO(strDate);
  // const date = format(isoDate, 'dd/MM/yyyy');
  // const newDate = parse(date, 'dd/MM/yyyy', new Date());
  return formatISO(isoDate);
}

export function displayDate(date) {
  const newDate = parseISO(date);
  const formattedDate = format(newDate, 'PPPP', { locale: es });
  return formattedDate;
}

export function converToDDMMYYYY(isoDate) {
  const newDate = parseISO(isoDate);
  const formattedDate = format(newDate, 'dd/MM/yyyy');
  return formattedDate;
}

export function displayYYYYMMDD(strDate) {
  const formattedDate = format(strDate, 'yyyy-MM-dd');
  return formattedDate;
}

export function convertToYYYYMMDD(isoDate) {
  const newDate = parseISO(isoDate);
  const formattedDate = format(newDate, 'yyyy-MM-dd');
  return formattedDate;
}
