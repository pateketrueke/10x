import Solvente from '../src/lib';
import { deepEqual } from 'assert';

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
  ['in cm 2+3', ['5 cm']],
  ['in cm, 2+3', ['5 cm']],
  ['3 days in 4 years', ['0.0082 year']],
  ['2+3 as cm', ['5 cm']],
  ['2+3, as cm', ['5 cm']],
  ['12 from 1987', ['0.6%']],
  ['Jun 10 - Apr 15 2019', ['56d']],
  ['-1 week as 1990', ['Thu Jul 26 1990 00:00:00']],
  ['Jun 10 at 6:00 pm', ['Mon Jun 10 2019 18:00:00']],
  ['1 month from today', ['Sun Sep 01 2019 10:30:00']],
  ['3:35 am + 9 hours 20 minutes', ['Fri Aug 02 2019 12:55:00']],
  ['now as 10 of Jun from 1987', ['Wed Jun 10 1987 ' + new Date().toString().split(' ')[4]]],
  ['Jun 10, 1987 - 1 week', ['Wed Jun 03 1987 00:00:00']],
  ['Jun 10 of 1987', ['Wed Jun 10 1987 00:00:00']],
  ['Jun 10 1987', ['Wed Jun 10 1987 00:00:00']],
  ['Jun 10', ['Mon Jun 10 2019 00:00:00']],
  ['Jun 1', ['Sat Jun 01 2019 00:00:00']],
];

const calc = new Solvente();

describe('Sandbox', () => {
  cases.forEach(test => {
    it(test[0], () => {
      deepEqual(calc.resolve(test[0]).results.map(x => x.format), test[1]);
    });
  });
});
