import handleDate from '../client/js/date-handler';
import validateDate from '../client/js/date-handler';

describe('Date Handler', () => {
  beforeAll(() => {
    // Mock today's date
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2020-11-1'));
  });

  describe('Date validation', () => {
    test('should have `handleDate` defined', () => {
      expect(handleDate).toBeDefined();
    });

    test('should return expected error response if no date passed', () => {
      const resp = handleDate();
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: false,
          errorMsg: 'Please enter a valid date',
        })
      );
    });

    test('should return expected error response if invalid date format', () => {
      const resp = validateDate('0001020');
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: false,
          errorMsg: 'Please enter a valid date',
        })
      );
    });

    test('should return expected error response if date is invalid', () => {
      const resp = validateDate('0000-10-20');
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: false,
          errorMsg: 'Please enter a valid future date',
        })
      );
    });

    test('should return expected error response if date is in past', () => {
      const resp = validateDate('2020-10-20');
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: false,
          errorMsg: 'Please enter a valid future date',
        })
      );
    });

    test('should return expected response if valid future date is passed', () => {
      let d = '2021-01-25';
      const resp = validateDate(d);
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: true,
          dateObj: new Date(`${d}T00:00:00`),
        })
      );
    });

    test("should return expected response if today's date is passed", () => {
      let d = '2020-11-01';
      const resp = validateDate(d);
      expect(resp).toStrictEqual(
        expect.objectContaining({
          isValid: true,
          dateObj: new Date(`${d}T00:00:00`),
        })
      );
    });
  });

  describe('Date formatting', () => {
    test('should return correct countdown for future date', () => {
      const dateObj = handleDate('2020-11-04');
      expect(dateObj.countdownDays).toEqual(3);
    });

    test("should return countdown of 0 for todays's date", () => {
      const dateObj = handleDate('2020-11-01');
      expect(dateObj.countdownDays).toEqual(0);
    });

    test('should return correctly formatted date', () => {
      const dateObj = handleDate('2020-11-10');
      expect(dateObj.formattedDate).toBe('Tuesday, Nov 10, 2020');
    });
  });
});
