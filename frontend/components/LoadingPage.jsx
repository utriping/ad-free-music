import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
export default function LoadingPage() {
  const [imgNumber, setImgNumber] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImgNumber((prev) => (prev + 1) % 3);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [imgNumber]);
  return (
    <>
      <div className="middle-right">Random Text</div>
      <div className="middle-center">
        <img src={`/src/assets/img${imgNumber}.jpg`} alt="" />
      </div>
      <div className="middle-left">Random Text</div>
      <div className="bottom-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum neque
        soluta doloribus suscipit! Eveniet sint, asperiores non sunt.
      </div>
    </>
  );
}
