/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NextImage from "next/image";

const AnimatedImage = ({
  src,
  alt,
  animation,
  zoom = 1, // Prop opcional con valor por defecto 1 (sin escala)
  height = 500,
}: {
  src: string;
  alt: string;
  animation: any;
  zoom?: number; // Opcional
  height?: number;
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
        height={height}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          transform: `scale(${zoom})`, // Escala solo la imagen, sin afectar el contenedor
          transformOrigin: "center center", // Mantiene el zoom centrado
        }}
      />
    </motion.div>
  );
};

export default AnimatedImage;
