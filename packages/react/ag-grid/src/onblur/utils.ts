import { useMemoizedFn } from "ahooks";
import { FormInstance } from "antd";
import makeDeferred from "./deferred";
import { flushSync } from "react-dom";

// 异步队列
let taskPromise: Array<Promise<any>> = [];

/**
 * 失焦返回的所有Promise
 * @returns Promise<any>
 * @description wait 参数 对于表格计算完毕后数据回显会有用(计算结束并不代表回显完成)
 */
const globalBlurPromise = async () => {
  const tasks = await Promise.all(taskPromise);
  taskPromise = [];
  return tasks;
};

/**
 * 使用异步延迟器
 * @param fn () => Promise<any>
 * @returns run: () => Promise<any>
 */
export const useAsyncDelayer = (
  fn: (e: React.FocusEvent<HTMLInputElement, Element>) => Promise<any>,
) => {
  const run = useMemoizedFn((e) => {
    const task = fn?.(e);
    taskPromise.push(task);
    return task;
  });

  return { run };
};

const deferAsync = async (form?: FormInstance) => {
  const defer = makeDeferred<boolean>();
  let unregister: any;
  // 有需要等待promise, 且有task要执行，没有task的时候，callback不会触发
  if (form && !!taskPromise?.length) {
    // 等待form 更新
    const callback = () => {
      defer.resolve(true);
    };
    unregister = (form as any)
      .getInternalHooks("RC_FORM_INTERNAL_HOOKS")
      .registerWatch(callback);
  }
  await globalBlurPromise();
  if (!form) {
    // 强制react更新已提交的update
    flushSync(() => {});
  }
  defer.resolve(true);
  await defer.promise;
  return unregister?.();
};

export const useBlurSave = (
  fn: (...args: any) => any,
  form?: FormInstance<any>,
) => {
  const memoFn = useMemoizedFn(fn);
  const saveFn = useMemoizedFn(async (...args) => {
    await deferAsync(form);
    await memoFn(...args);
  });
  return saveFn;
};
