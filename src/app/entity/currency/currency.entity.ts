
const codeSymbol = Symbol('code');

export class CurrencyEntity {
  public set code(value: string) {
    this[codeSymbol] = value.toUpperCase();
  }

  public get code(): string {
    return this[codeSymbol];
  }

  public get lcode(): string {
    return this[codeSymbol].toLowerCase();
  }

  constructor(public name: string, code: string) {
    this.code = code;
  }
}

export const BTC = new CurrencyEntity('Bitcoin', 'BTC');
export const ETH = new CurrencyEntity('Etherium', 'ETH');
export const XRP = new CurrencyEntity('Ripple', 'XRP');
export const EUR = new CurrencyEntity('Euro', 'EUR');
