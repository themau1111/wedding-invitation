import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const LazyMotionWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default LazyMotionWrapper;
