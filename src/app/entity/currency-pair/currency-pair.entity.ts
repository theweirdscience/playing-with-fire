import { CurrencyEntity } from '../currency/currency.entity';

export class CurrencyPairEntity {
  constructor(public primary: CurrencyEntity, public secondary: CurrencyEntity) {}

  /**
   * Pair code in upper case;
   * @returns {string}
   */
  public get code(): string {
    return `${this.primary.code}${this.secondary.code}`;
  }

  /**
   * Pair code in lower case
   * @returns {string}
   */
  public get lcode(): string {
    return `${this.primary.lcode}${this.secondary.lcode}`;
  }

}
