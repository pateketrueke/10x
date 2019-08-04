import tk from 'timekeeper';
import { deepEqual } from 'assert';
import Solvente from '../src/lib';

const cases = [
  ['2 cm / 35mm', ['0.57 cm']],
  ['2 cm of 3 inch', ['0.79 in']],
  ['365 days / 2years', ['0.5 days']],
  ['2TB + 25GB', ['2.024 TB']],
  ['3GB / 1MB', ['3,072 GB']],
  ['2 + 1 inch + 1cm', ['3.39 in']],
  ['$15,000 MXN / 14 days of **work** 😅😇👋🏿👨‍👨‍👧‍👧', ['1,071.43 MXN']],
  ['160 pounds as kg', ['72.57 kg']],
  ['3 weeks as days', ['21 days']],
  ['1 2 3 / 4 5', ['8.75']],
  ['1 2 3 4 5', ['15']],
  ['1 2 3 - 4 5', ['-3']],
  ['3in / 2 cm', ['3.81 in']],
  ['1+2-3+4/2+7/-.12', ['-56.33']],
  ['(1+2) - (3 + 4/2) + (7/-.12)', ['-60.33']],
  ['(1 + 2) - (3 + (4 / 2)) + (7 / -.12)', ['-60.33']],
  ['30 + 20%', ['36']],
  ['100_000', ['100,000']],
  ['1ft - .3ft', ['0.7 ft']],
  ['2 cm in 3 in', ['0.79 in']],
  ['10 inches in cm', ['25.4 cm']],
  ['450 km in miles', ['279.62 mi']],
  ['3 days in 4 years', ['0.0082 year']],
  ['2+3 as cm', ['5 cm']],
  ['2+3, as cm', ['5 cm']],
  ['12 from 1987', ['0.6%']],
  ['Jun 10 - Apr 15 2019', ['310d']],
  ['6:00:00 pm - 3:15:05 am', ['14h 44m 55s']],
  ['1987-06-10T06:00:00.000Z', ['Wed Jun 10 1987 06:00:00']],
  ['-1 week as 1990', ['Fri Feb 23 1990 00:00:00']],
  ['Jun 10 at 6:00 pm', ['Sun Jun 10 2012 18:00:00']],
  ['1 month from today', ['Sun Apr 01 2012 10:30:00']],
  ['3:35 am + 9 hours 20 minutes', ['Fri Mar 02 2012 12:55:00']],
  ['now as 10 of Jun from 1987', ['Wed Jun 10 1987 11:38:49']],
  ['Jun 10, 1987 - 1 week', ['Wed Jun 03 1987 00:00:00']],
  ['Jun 10 of 1987', ['Wed Jun 10 1987 00:00:00']],
  ['Jun 10 1987', ['Wed Jun 10 1987 00:00:00']],
  ['Jun 10', [`Sun Jun 10 2012 00:00:00`]],
  ['Jun 1', [`Fri Jun 01 2012 00:00:00`]],
];

const calc = new Solvente();
const time = new Date(1330688329321);

tk.freeze(time);

describe('Sandbox', () => {
  cases.forEach(test => {
    if (test) it(test[0], () => {
      const x = calc.resolve(test[0]);

      if (x.error) throw x.error;

      deepEqual(x.results.map(x => x.format), test[1]);
    });
  });
});
