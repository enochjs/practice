import { merge } from 'lodash';

type IQueryFilterParams = Record<string, (value) => Record<string, any>>;

export const queryFilter = (params?: IQueryFilterParams) => {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args) => any>,
  ) {
    const method = descriptor.value!;
    descriptor.value = function (...args) {
      const _args = args.map((arg) => {
        if (toString.call(arg) === '[object Object]') {
          let _arg = { ...arg };
          Object.keys(arg).forEach((key) => {
            if (
              _arg[key] === '' ||
              _arg[key] === undefined ||
              _arg[key] === null
            ) {
              delete _arg[key];
              return;
            }
            if (params && params[key]) {
              const value = _arg[key];
              delete _arg[key];
              _arg = merge(_arg, params[key](value));
            }
          });
          return _arg;
        }
      });
      return method.apply(this, _args);
    };
  };
};
