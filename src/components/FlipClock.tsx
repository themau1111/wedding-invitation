import React, { useEffect, useState } from "react";
import { FlipClockDigit } from "./FlipClockDigit";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const FlipClock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-07-26T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };

        setPrevTimeLeft(timeLeft); // Actualizamos el estado anterior
        setTimeLeft(newTimeLeft); // Actualizamos el estado actual
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div style={{perspective: '1000px'}} className="flex justify-center items-center space-x-4 mb-8">
      <div className="flex flex-col items-center">
        <FlipClockDigit value={timeLeft.days} prevValue={prevTimeLeft.days} />
        <span className="text-sm uppercase text-black mt-2">Días</span>
      </div>
      <div className="flex flex-col items-center">
        <FlipClockDigit value={timeLeft.hours} prevValue={prevTimeLeft.hours} />
        <span className="text-sm uppercase text-black mt-2">Horas</span>
      </div>
      <div className="flex flex-col items-center">
        <FlipClockDigit value={timeLeft.minutes} prevValue={prevTimeLeft.minutes} />
        <span className="text-sm uppercase text-black mt-2">Minutos</span>
      </div>
      <div className="flex flex-col items-center">
        <FlipClockDigit value={timeLeft.seconds} prevValue={prevTimeLeft.seconds} />
        <span className="text-sm uppercase text-black mt-2">Segundos</span>
      </div>
    </div>
  );
};


export default FlipClock;
