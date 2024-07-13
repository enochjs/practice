interface IDeferred<T> {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: Promise<T>;
}

function makeDeferred<T>() {
  const deferred = {} as IDeferred<T>;
  const promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  deferred.promise = promise;
  return deferred;
}

export default makeDeferred;
