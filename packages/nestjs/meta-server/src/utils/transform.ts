import moment from 'moment';

export const dateFormat =
  (format = 'YYYY-MM-DD HH:mm:ss') =>
  ({ value }: { value: moment.Moment }) =>
    value ? moment(value).format(format) : '-';
