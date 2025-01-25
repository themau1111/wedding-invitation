/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NextImage from "next/image";

const AnimatedImage = ({
  src,
  alt,
  animation,
}: {
  src: string;
  alt: string;
  animation: any;
}) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={animation}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="overflow-hidden rounded-lg"
    >
      <NextImage
        width={500}
        height={500}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

export default AnimatedImage;
