import { Sex } from 'modules/enums/Sex';
import { adultAlgorithm, boyAlgorithm, girlAlgorithm } from './algorithms';

export const suitBMItoRange = (bmiIndicator: string, sex: Sex, birthDate: string): number => {

  const age = new Date().getFullYear() - new Date(parseInt(birthDate.split('-')[2], 10), parseInt(birthDate.split('-')[1], 10), parseInt(birthDate.split('-')[0], 10)).getFullYear();
  const bmi = parseFloat(bmiIndicator);

  if (age > 18) {
    return adultAlgorithm(bmi, sex);
  } else {
    return sex === Sex.Male ? boyAlgorithm(bmi, sex, age) : girlAlgorithm(bmi, sex, age);
  }
};
