import { parse, formatISO, parseISO, format } from 'date-fns';
import es from 'date-fns/locale/es';

export function convertToISO(strDate) {
  const date = format(strDate, 'dd/MM/yyyy');
  const newDate = parse(date, 'dd/MM/yyyy', new Date());
  return formatISO(newDate);
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

export function displayDDMMYYYY(strDate) {
  const formattedDate = format(strDate, 'yyyy-MM-dd');
  return formattedDate;
}
