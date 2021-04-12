import { HttpException, HttpStatus } from '@nestjs/common';
import { Sex } from '../../enums/sex';
import { Job } from '../../enums/job';

export const calculateBMI = (weightDto: string, heightDto: string): string => {

    const weight = parseFloat(weightDto.replace(',', '.'));
    const height = parseFloat(heightDto.replace(',', '.')) / 100;
    return (weight / Math.pow(height, 2)).toFixed(2);
};

export const calculateBMR = (weightDto: string, heightDto: string, sexDto: Sex, birthDateDto: string): string => {

    const age = new Date().getFullYear() - new Date(parseInt(birthDateDto.split('-')[2], 10), parseInt(birthDateDto.split('-')[1], 10), parseInt(birthDateDto.split('-')[0], 10)).getFullYear();

    return sexDto === Sex.Female
    ? ((9.99 * parseFloat(weightDto)) + (6.25 * parseFloat(heightDto)) - (4.92 * age) - 161).toFixed(2)
    : ((9.99 * parseFloat(weightDto)) + (6.25 * parseFloat(heightDto)) - (4.92 * age) + 5).toFixed(2);
};

export const calculateCPM = (bmr: string, job: Job, activity: number): string => {

    switch (true) {
      case (job === Job.Sitting && activity === 0): return (parseFloat(bmr) * 1.2).toFixed(2);
      case (job === Job.Sitting && activity === 1): return (parseFloat(bmr) * 1.35).toFixed(2);
      case (job === Job.Sitting && activity === 2): return (parseFloat(bmr) * 1.55).toFixed(2);
      case (job === Job.Physical && activity === 3): return (parseFloat(bmr) * 1.75).toFixed(2);
      case (job === Job.Physical && activity === 4): return (parseFloat(bmr) * 2.05).toFixed(2);
      default:
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
};

export const adultAlgorithm = (bmi: number, sex: Sex): number => {
    switch (true) {
      case (bmi < 16.00 && sex === Sex.Female ): return 1;
      case (bmi < 16.00 && sex === Sex.Male ): return 2;

      case (bmi >= 16.00 && bmi <= 16.99 && sex === Sex.Female): return 3;
      case (bmi >= 16.00 && bmi <= 16.99 && sex === Sex.Male): return 4;

      case (bmi >= 17.00 && bmi <= 18.49 && sex === Sex.Female): return 5;
      case (bmi >= 17.00 && bmi <= 18.49 && sex === Sex.Male): return 6;

      case (bmi >= 18.50 && bmi <= 24.99 && sex === Sex.Female): return 7;
      case (bmi >= 18.50 && bmi <= 24.99 && sex === Sex.Male): return 8;

      case (bmi >= 25.00 && bmi <= 29.99 && sex === Sex.Female): return 9;
      case (bmi >= 25.00 && bmi <= 29.99 && sex === Sex.Male): return 10;

      case (bmi >= 30.00 && bmi <= 34.99 && sex === Sex.Female): return 11;
      case (bmi >= 30.00 && bmi <= 34.99 && sex === Sex.Male): return 12;

      case (bmi >= 35.00 && bmi <= 39.99 && sex === Sex.Female): return 13;
      case (bmi >= 35.00 && bmi <= 39.99 && sex === Sex.Male): return 14;

      case (bmi >= 40.00 && sex === Sex.Female): return 15;
      case (bmi >= 40.00 && sex === Sex.Male): return 16;
      default:
        throw new HttpException('Wrong BMI', HttpStatus.BAD_REQUEST);
    }

    // < 16,0 – wygłodzenie
    // 16,0–16,99 – wychudzenie
    // 17,0–18,49 – niedowagę
    // 18,5–24,99 – wartość prawidłową
    // 25,0–29,99 – nadwagę
    // 30,0–34,99 – I stopień otyłości
    // 35,0–39,99 – II stopień otyłości (otyłość kliniczna)
    // ≥ 40,0 – III stopień otyłości (otyłość skrajna)
};

export const boyAlgorithm = (bmi: number, sex: Sex, age: number): number => {
    const plus2SD = [ 19.30, 19.80, 20.50, 21.40, 22.50, 24.00, 25.50, 26.70, 27.90, 28.50, 28.80, 28.90, 29.10, 29.20, 29.70, 30.10 ];
    const otylosc = [ 19.20, 19.70, 20.40, 21.30, 22.40, 23.90, 25.40, 26.60, 27.80, 28.40, 28.70, 28.80, 29.00, 29.10, 29.60, 30.00 ];
    const c95 = [ 18.50, 18.70, 19.10, 19.90, 20.80, 21.70, 22.80, 23.90, 24.60, 25.30, 25.80, 26.20, 26.60, 27.00, 27.50, 28.20 ];
    const c85 = [ 17.20, 17.30, 17.50, 17.80, 18.30, 19.00, 19.70, 20.50, 21.10, 21.80, 22.30, 23.00, 23.50, 24.00, 24.60, 25.10 ];
    const plus1SD = [ 17.10, 17.20, 17.40, 17.70, 18.20, 18.90, 19.60, 20.40, 21.00, 21.70, 22.20, 22.90, 23.40, 23.90, 24.50, 25.00 ];
    const nadwaga = [ 17.00, 17.10, 17.30, 17.60, 18.10, 18.80, 19.50, 20.30, 20.90, 21.60, 22.00, 22.80, 23.30, 23.80, 24.40, 24.90 ];
    const c50 = [ 15.70, 15.50, 15.50, 15.70, 15.90, 16.20, 16.50, 17.00, 17.40, 18.00, 18.60, 19.20, 19.80, 20.50, 21.10, 21.80 ];
    const minus1SD = [ 14.60, 14.40, 14.20, 14.20, 14.30, 14.50, 14.70, 14.90, 15.50, 15.90, 16.30, 16.90, 17.40, 18.00, 18.60, 19.20 ];
    const niedowaga = [ 14.10, 14.00, 13.90, 13.80, 13.90, 14.00, 14.20, 14.50, 14.80, 15.20, 15.60, 16.20, 16.80, 17.30, 18.00, 18.50 ];
    const minus2SD = [ 13.80, 13.40, 13.20, 13.10, 13.10, 13.20, 13.30, 13.50, 14.00, 14.30, 14.70, 15.10, 15.70, 16.20, 16.80, 17.20 ];

    const tempAge = age - 3;

    switch (true) {
        case (bmi < minus2SD[tempAge] && sex === Sex.Female): return 1;
        case (bmi < minus2SD[tempAge] && sex === Sex.Male): return 2;

        case (bmi >= minus2SD[tempAge] && bmi < niedowaga[tempAge] && sex === Sex.Female): return 3;
        case (bmi >= minus2SD[tempAge] && bmi < niedowaga[tempAge] && sex === Sex.Male): return 4;

        case (bmi >= niedowaga[tempAge] && bmi < minus1SD[tempAge] && sex === Sex.Female): return 5;
        case (bmi >= niedowaga[tempAge] && bmi < minus1SD[tempAge] && sex === Sex.Male): return 6;

        case (bmi >= minus1SD[tempAge] && bmi < c50[tempAge] && sex === Sex.Female): return 7;
        case (bmi >= minus1SD[tempAge] && bmi < c50[tempAge] && sex === Sex.Male): return 8;

        case (bmi >= c50[tempAge] && bmi < nadwaga[tempAge] && sex === Sex.Female): return 9;
        case (bmi >= c50[tempAge] && bmi < nadwaga[tempAge] && sex === Sex.Male): return 10;

        case (bmi >= nadwaga[tempAge] && bmi < plus1SD[tempAge] && sex === Sex.Female): return 11;
        case (bmi >= nadwaga[tempAge] && bmi < plus1SD[tempAge] && sex === Sex.Male): return 12;

        case (bmi >= plus1SD[tempAge] && bmi < c85[tempAge] && sex === Sex.Female): return 13;
        case (bmi >= plus1SD[tempAge] && bmi < c85[tempAge] && sex === Sex.Male): return 14;

        case (bmi >= c85[tempAge] && bmi < c95[tempAge] && sex === Sex.Female): return 15;
        case (bmi > c85[tempAge] && bmi < c95[tempAge] && sex === Sex.Male): return 16;

        case (bmi >= c95[tempAge] && bmi < otylosc[tempAge] && sex === Sex.Female): return 17;
        case (bmi >= c95[tempAge] && bmi < otylosc[tempAge] && sex === Sex.Male): return 18;

        case (bmi >= otylosc[tempAge] && bmi < plus2SD[tempAge] && sex === Sex.Female): return 19;
        case (bmi >= otylosc[tempAge] && bmi < plus2SD[tempAge] && sex === Sex.Male): return 20;

        case (bmi >= plus2SD[tempAge] && sex === Sex.Female): return 21;
        case (bmi >= plus2SD[tempAge] && sex === Sex.Male): return 22;

        default:
          throw new HttpException('Wrong BMI', HttpStatus.BAD_REQUEST);
      }
};

export const girlAlgorithm = (bmi: number, sex: Sex, age: number): number => {
    const otylosc = [ 19.70, 20.20, 20.90, 21.70, 22.60, 23.90, 25.10, 26.40, 27.50, 28.40, 29.00, 29.30, 29.50, 29.60, 29.80, 30.00 ];
    const plus2SD = [ 19.10, 19.60, 20.20, 21.00, 21.70, 22.70, 23.80, 25.00, 26.20, 27.00, 27.50, 28.00, 28.20, 28.30, 28.50, 28.70 ];
    const c95 = [ 18.30, 18.50, 19.00, 19.50, 20.20, 21.00, 22.00, 22.90, 23.80, 24.50, 25.10, 25.70, 26.00, 26.20, 26.50, 26.80 ];
    const nadwaga = [ 17.50, 17.60, 18.00, 18.30, 18.80, 19.50, 20.30, 21.10, 21.90, 22.50, 23.20, 23.70, 24.10, 24.40, 24.60, 24.80 ];
    const c85 = [ 17.20, 17.30, 17.40, 17.60, 18.10, 18.60, 19.40, 20.10, 20.80, 21.50, 22.10, 22.70, 23.10, 23.40, 23.70, 23.90 ];
    const plus1SD = [ 17.10, 17.20, 17.40, 17.50, 18.00, 18.50, 19.30, 20.00, 20.70, 21.40, 22.00, 22.60, 23.00, 23.30, 23.60, 23.80 ];
    const c50 = [ 15.50, 15.40, 15.40, 15.50, 15.60, 16.00, 16.30, 16.80, 17.40, 18.00, 18.50, 19.20, 19.70, 20.20, 20.40, 20.70 ];
    const minus1SD = [ 14.40, 14.30, 14.10, 14.00, 14.10, 14.30, 14.50, 14.90, 15.40, 15.90, 16.40, 16.90, 17.40, 17.80, 18.20, 18.50 ];
    const niedowaga = [ 14.30, 14.20, 14.00, 13.90, 14.00, 14.20, 14.40, 14.80, 15.30, 15.80, 16.30, 16.80, 17.30, 17.70, 18.10, 18.40 ];
    const minus2SD = [ 13.50, 13.20, 13.00, 12.80, 12.80, 12.90, 13.00, 13.30, 13.70, 14.20, 14.60, 15.20, 15.70, 16.20, 16.50, 16.80 ];

    const tempAge = age - 3;

    switch (true) {
        case (bmi < minus2SD[tempAge] && sex === Sex.Female): return 1;
        case (bmi < minus2SD[tempAge] && sex === Sex.Male): return 2;

        case (bmi >= minus2SD[tempAge] && bmi < niedowaga[tempAge] && sex === Sex.Female): return 3;
        case (bmi >= minus2SD[tempAge] && bmi < niedowaga[tempAge] && sex === Sex.Male): return 4;

        case (bmi >= niedowaga[tempAge] && bmi < minus1SD[tempAge] && sex === Sex.Female): return 5;
        case (bmi >= niedowaga[tempAge] && bmi < minus1SD[tempAge] && sex === Sex.Male): return 6;

        case (bmi >= minus1SD[tempAge] && bmi < c50[tempAge] && sex === Sex.Female): return 7;
        case (bmi >= minus1SD[tempAge] && bmi < c50[tempAge] && sex === Sex.Male): return 8;

        case (bmi >= c50[tempAge] && bmi < plus1SD[tempAge] && sex === Sex.Female): return 9;
        case (bmi >= c50[tempAge] && bmi < plus1SD[tempAge] && sex === Sex.Male): return 10;

        case (bmi >= plus1SD[tempAge] && bmi < c85[tempAge] && sex === Sex.Female): return 11;
        case (bmi >= plus1SD[tempAge] && bmi < c85[tempAge] && sex === Sex.Male): return 12;

        case (bmi >= c85[tempAge] && bmi < nadwaga[tempAge] && sex === Sex.Female): return 13;
        case (bmi >= c85[tempAge] && bmi < nadwaga[tempAge] && sex === Sex.Male): return 14;

        case (bmi >= nadwaga[tempAge] && bmi < c95[tempAge] && sex === Sex.Female): return 15;
        case (bmi >= nadwaga[tempAge] && bmi < c95[tempAge] && sex === Sex.Male): return 16;

        case (bmi >= c95[tempAge] && bmi < plus2SD[tempAge] && sex === Sex.Female): return 17;
        case (bmi > c95[tempAge] && bmi < plus2SD[tempAge] && sex === Sex.Male): return 18;

        case (bmi >= plus2SD[tempAge] && bmi < otylosc[tempAge] && sex === Sex.Female): return 19;
        case (bmi >= plus2SD[tempAge] && bmi < otylosc[tempAge] && sex === Sex.Male): return 20;

        case (bmi >= otylosc[tempAge] && sex === Sex.Female): return 21;
        case (bmi >= otylosc[tempAge] && sex === Sex.Male): return 22;

        default:
          throw new HttpException('Wrong BMI', HttpStatus.BAD_REQUEST);
      }
};