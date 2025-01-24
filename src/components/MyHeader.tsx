import { useEffect, useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import FlipClock from "./FlipClock";
import NextImage from "next/image";

const MyHeader = ({
  togglePlayPause,
  isPlaying,
}: {
  togglePlayPause: () => void;
  isPlaying: boolean;
}) => {
  const [backgroundHeight, setBackgroundHeight] = useState(0);

  useEffect(() => {
    // Cargar la imagen y calcular su tamaño dinámico
    const img = new Image();
    img.src = "/foto-7.jpg";
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const containerWidth = window.innerWidth;
      const calculatedHeight = containerWidth / aspectRatio; // Altura proporcional
      setBackgroundHeight(calculatedHeight);
    };

    // Actualizar tamaño al redimensionar ventana
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      const calculatedHeight = containerWidth / (img.width / img.height);
      setBackgroundHeight(calculatedHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className="relative text-white"
      style={{
        height: `${backgroundHeight}px`, // La altura dinámica basada en el fondo
        backgroundImage: "url(/foto-7.jpg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundColor: "#fff",
        marginBottom: "14em",
      }}
    >
      {/* Botón de audio */}
      <div className="absolute top-4 right-4 text-white rounded-lg flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          className="text-black font-bold py-2 px-4 rounded bg-opacity-30 bg-black shadow-lg transition flex items-center gap-2 z-20000"
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6 text-white" />
          ) : (
            <PlayIcon className="h-6 w-6 text-white" />
          )}
        </button>
        <audio id="wedding-music" src="/music/mi-sol.mp3" loop></audio>
      </div>

      {/* Contenido */}
      <div
        className="absolute inset-0 flex flex-col justify-end items-center text-center mt-36 mb-36"
        style={{
          height: `${backgroundHeight}px`, // Asegurar que el contenido se alinee con el fondo
        }}
      >
        {/* Imagen Mau y Kary */}
        <NextImage
          src="/mauykary.png"
          alt="Foto Mau y Kary"
          className="w-full max-h-[30%] object-contain"
          layout="responsive"
          objectFit="contain"
          width={500}
          height={500}
        />

        {/* Reloj */}
        <div className="w-full bg-white text-black py-4">
          <FlipClock />
        </div>
      </div>
    </header>
  );
};

export default MyHeader;
