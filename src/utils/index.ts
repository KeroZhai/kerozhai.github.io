import dayjs from 'dayjs'

export function formatDate(d: string | Date) {
  const date = dayjs(d)

  if (date.day() === dayjs().day())
    return date.format('HH:mm')
  else if (date.month() === dayjs().month())
    return date.format('D HH:mm')
  else if (date.year() === dayjs().year())
    return date.format('MMM D HH:mm')
  return date.format('MMM D, YYYY')
}
