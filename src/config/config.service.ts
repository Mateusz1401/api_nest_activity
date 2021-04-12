import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || 'devel'}.env`));
  }

  get(key: string): any {
    const value = this.envConfig[key];
    const number = Number(value);
    return number ? number : value;
  }
}
