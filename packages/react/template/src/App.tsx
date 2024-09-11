import { useMemoizedFn } from "ahooks";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  const getLastValue = useMemoizedFn(() => {
    // const
    console.log("=====", isPrinting);
  });

  function handleBeforePrint() {
    setIsPrinting(true);
    flushSync(() => {});
    console.log("=====123", isPrinting);
    getLastValue();
    // setTimeout(() => {
    //   // Promise.resolve().then(() => {
    //   //   console.log("=====123", isPrinting);
    //   // });
    // }, 3000);
  }

  function handleAfterPrint(e) {
    console.log("======e", e);
    setIsPrinting(false);
  }

  useEffect(() => {
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    window.matchMedia("print").addListener((mql) => {
      //// constt....
      console.log("======123", mql);
      if (!mql.matches) {
        window.dispatchEvent(new Event("afterprint"));
      }
    });
    // if (window.matchMedia(" (min-width: 600px) ").matches) {
    //   console.log("The viewport is at least 600 pixels wide");
    // } else {
    //   console.log("The viewport is less than 600 pixels wide");
    // }
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? "yes" : "no"}</h1>
      <button
        onClick={() => {
          // handleBeforePrint();
          console.log("=======", new Date().getTime());
          window.print();
          console.log("=======end", new Date().getTime());
        }}
      >
        Print
      </button>
    </>
  );
}
