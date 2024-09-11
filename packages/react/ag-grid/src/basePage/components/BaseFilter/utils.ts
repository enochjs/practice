import { get } from 'lodash';

type OmitArgs = any;
type OmitValue<T extends string[]> = Record<T[number], any>;

type IOptionItem = {
  label: string;
  value: string;
  children?: IOptionItem[];
};

export const camelizeName = (name: string) => name.replace(/^\S/, (s) => s.toLowerCase());

export function omitFilterCondition<T extends string[]>(
  args: any,
  keys: [...T],
): [OmitArgs, OmitValue<T>] {
  const _keys = keys.map(camelizeName);
  // todo
  const omitObj: Record<string, any> = {};
  const newArgs = {
    ...args,
    filterQuery: {
      filters: args?.filterQuery?.filters?.map((item: any) => ({
        ...item,
        conditions: item.conditions?.filter((c: any) => {
          if (_keys.includes(camelizeName(c.fieldName))) {
            omitObj[camelizeName(c.fieldName)] = c.value;
            return false;
          }
          return true;
        }),
      })),
    },
  };

  return [newArgs, omitObj as any];
}

export const formatter = (
  data: any[] = [],
  configs: { labelKey?: string | ((item: any) => string); valueKey?: string; childrenKey?: string },
): IOptionItem[] => {
  const { labelKey = 'label', valueKey = 'value', childrenKey } = configs;

  return data?.map((i) => {
    let label = '';
    if (typeof labelKey === 'function') {
      label = labelKey(i);
    } else {
      label = i[labelKey];
    }
    return {
      label,
      value: i[valueKey],
      children: childrenKey ? formatter(i[childrenKey], configs) : undefined,
    };
  });
};

export const handleLanguageForField = (props: any, language: any) => {
  if (Reflect.has(props, 'translations')) {
    const nextLabel = get(props, `translations.${language}`) || props.label;

    return nextLabel;
  }

  return props.label;
};
