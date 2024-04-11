export enum USER_STATUS_ENUM {
  ENABLE = 1,
  DISABLE = 2,
}

export const USER_STATUS_ENUM_LIST = [
  { value: USER_STATUS_ENUM.ENABLE, text: '启用' },
  { value: USER_STATUS_ENUM.DISABLE, text: '禁用' },
];

export enum USER_ROLE_ENUM {
  FED = 1,
  BED = 2,
  UED = 3,
  PD = 4,
  PM = 5,
  QA = 6,
  OTHER = 99,
}

export const USER_ROLE_ENUM_LIST = [
  { value: USER_ROLE_ENUM.FED, text: '前端' },
  { value: USER_ROLE_ENUM.BED, text: '后端' },
  { value: USER_ROLE_ENUM.QA, text: '测试' },
  { value: USER_ROLE_ENUM.UED, text: 'UED' },
  { value: USER_ROLE_ENUM.PD, text: '产品' },
  { value: USER_ROLE_ENUM.PM, text: '项目经理' },
  { value: USER_ROLE_ENUM.OTHER, text: '其他' },
];
