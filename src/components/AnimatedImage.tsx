/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */


import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedImage = ({ src, alt, animation }: { src: string; alt: string; animation: any }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={animation}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="overflow-hidden rounded-lg"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
};

export default AnimatedImage