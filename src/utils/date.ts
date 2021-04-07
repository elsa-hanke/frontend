import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import { parseISO } from 'date-fns'

export function dateBetween(
  date: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) {
  if (date) {
    if (
      (startDate && isBefore(parseISO(date), parseISO(startDate))) ||
      (endDate && isAfter(parseISO(date), parseISO(endDate)))
    ) {
      return false
    }
  }
  return true
}
