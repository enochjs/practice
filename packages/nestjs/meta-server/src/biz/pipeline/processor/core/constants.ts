// 流水线处理器名称
export const PIPELINE_PROCESSOR_NAME = 'pipeline';
// 分割符
export const SEPARATION = '__';

// 定义流水线处理器枚举
export enum PIPELINE_PROCESSOR_ENUM {
  // 处理流水线创建事件
  PROCESS_PIPELINE_CREATE = 'PROCESS_PIPELINE_CREATE',
  // 处理流水线stage创建事件
  PROCESS_STAGE_CREATE = 'PROCESS_STAGE_CREATE',
  // 处理流水线job创建事件
  PROCESS_JOB_CREATE = 'PROCESS_JOB_CREATE',
  // 转发job产生的event 如: success, failed
  PROCESS_JOB_FORWARD_EVENT = 'PROCESS_JOB_ADD_EVENT',
  // 处理流水线job状态变更事件
  PROCESS_JOB_STATE_CHANGE = 'PROCESS_JOB_STATE_CHANGE',
}

export enum PIPELINE_LISTENER_NAME_ENUM {
  // 流水线相关事件监听器
  PIPELINE = 'PIPELINE',
  // 构建相关事件监听器
  PIPELINE_BUILD = 'PIPELINE_BUILD',
  // merge request相关事件监听器
  PIPELINE_MERGE_REQUEST = 'PIPELINE_MERGE_REQUEST',
  // DD 审批相关事件
  PIPELINE_DD_APPROVE = 'PIPELINE_DD_APPROVE',
  // 发布 相关事件监听器
  PIPELINE_DEPLOY = 'PIPELINE_DEPLOY',
}

// pipeline task 执行
export enum PIPELINE_TASK_STATUS_ENUM {
  // 创建成功
  CREATE = 1,
  // 进行中
  IN_PROGRESS = 5,
  // 超时
  TIMEOUT = 97,
  // 失败
  FAILED = 99,
  // 成功
  SUCCESS = 100,
}

export enum PIPELINE_BASE_STATUS_ENUM {
  // 创建
  CREATE = 1,
  // 进行中
  IN_PROGRESS = 5,
  // 超时
  TIMEOUT = 97,
  // 取消
  CANCELED = 98,
  // 失败
  FAILED = 99,
  // 成功
  SUCCESS = 100,
}

export enum GIT_MR_STATUS_ENUM {
  OPENED = 'opened',
  // 已关闭
  CLOSED = 'closed',
  // 锁定
  LOCKED = 'locked',
  // check_status
  CHECK_STATUS = 'check_status',
  // merge
  MERGED = 'merged',
  // not need merge
  NO_NEED_MERGE = 'no_need_merge',
  // auto merge
  AUTO_MERGE = 'auto_merge',
}
