import { motion } from "framer-motion";

interface FlipClockDigitProps {
  value: number;
  prevValue: number;
}

const flipVariants = {
  initial: { rotateX: 0 },
  flipOut: {
    rotateX: -90,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  flipIn: {
    rotateX: 0,
    transition: { duration: 0.5, ease: "easeInOut", delay: 0.25 },
  },
};

export const FlipClockDigit: React.FC<FlipClockDigitProps> = ({
  value,
  prevValue,
}) => {
  return (
    <div className="relative w-12 h-16 bg-gray-900 rounded-md overflow-hidden text-white">
      {/* Parte superior (saliente) */}
      <motion.div
        key={`out-${prevValue}`}
        initial="initial"
        animate="flipOut"
        exit={{ opacity: 0 }}
        variants={flipVariants}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center origin-bottom z-10"
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className="text-3xl font-bold">{prevValue}</span>
      </motion.div>

      {/* Parte inferior (entrante) */}
      <motion.div
        key={`in-${value}`}
        initial={{ rotateX: 90 }}
        animate="flipIn"
        variants={flipVariants}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center origin-top z-0"
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className="text-3xl font-bold">{value}</span>
      </motion.div>
    </div>
  );
};

export default FlipClockDigit;
