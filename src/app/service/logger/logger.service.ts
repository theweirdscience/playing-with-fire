import { Injectable } from '@angular/core';

/**
 * Logger Service
 */
@Injectable()
export class Logger {

  /**
   * log as info
   *
   * @param msg
   */
  info(msg: any) {
    console.log(msg);
  }

  /**
   * log as warning
   *
   * @param msg
   */
  warn(msg: any) {
    console.warn(msg);
  }

  /**
   * log as error
   *
   * @param msg
   */
  error(msg: any) {
    console.error(msg);
  }

}
