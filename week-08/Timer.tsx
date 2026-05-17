import { useEffect, useRef, useState } from "react";

export interface TimerProps {
  initialSeconds: number;
}

export function Timer({ initialSeconds }: TimerProps) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    timerId.current = setTimeout(() => {
      setSeconds((currentSeconds) => currentSeconds - 1);
    }, 1000);

    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, [seconds]);

  if (seconds <= 0) {
    return <p>Время вышло</p>;
  }

  return <p>Осталось: {seconds} сек.</p>;
}
