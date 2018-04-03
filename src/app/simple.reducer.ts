import { Action } from '@ngrx/store';

export const CLEAR = 'CLEAR';

export const simpleReducer = (state: string = "Hello world", action: Action) => {
  console.log(action.type, state);

  switch(action.type) {
    case 'CLEAR':
      return "";
  }

  return state;
};
