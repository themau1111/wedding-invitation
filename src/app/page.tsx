"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import LazyMotionWrapper from "@/components/LazyMotionWrapper";
import AnimatedImage from "@/components/AnimatedImage";
import { motion } from "framer-motion";
import Flowers from "@/components/Flowers";
import Swal from "sweetalert2";
import GoogleCalendar from "@/components/GoogleCalendar";
import MyHeader from "@/components/MyHeader";
import NextImage from "next/image";
import AutocompleteInput from "@/components/AutocompleteInput";
import React, { useRef } from "react";

type Attendee = {
  name: string;
  isConfirmed: boolean;
};

export default function WeddingInvitation() {
  const [name, setName] = useState<string>("");
  const [confirmationStatus, setConfirmationStatus] = useState<
    "confirmed" | "declined" | ""
  >(""); // Opciones definidas
  const [passes, setPasses] = useState<number>(0); // Número de pases asignados
  const [attendees, setAttendees] = useState<Attendee[]>([]); // Lista de acompañantes
  const [notes, setNotes] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [closeFlowers, setCloseFlowers] = useState<boolean>(false);
  const selectRef = useRef<any>(null);

  const bounceVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8 }, // Empieza abajo y más pequeño
    visible: {
      opacity: 1,
      y: [0, -50, 20, -30, 10, 0], // Movimiento vertical más pronunciado
      scale: [1, 1.4, 0.9, 1.2, 1], // Se agranda bastante y regresa
      transition: {
        duration: 1.5, // Duración total del efecto
        stiffness: 500, // Más rigidez para que el rebote sea rápido
        damping: 8, // Menos amortiguación para que siga rebotando un poco más
      },
    },
  };

  const shakeVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: [-10, 10, -10, 10, 0], // Movimiento de sacudida
      transition: { duration: 1 },
    },
  };

  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1 },
    },
  };

  // Variantes para las flores
  const flowersVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    hidden: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  // Variantes para el velo
  const veilVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: { duration: 2, ease: "easeInOut" } },
  };

  const messageVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    hidden: {
      opacity: 0,
      y: -50,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  const handleButtonClick = () => {
    togglePlayPause();
    setShowContent(true); // Muestra el contenido al quitar el velo
    setTimeout(() => {
      setCloseFlowers(true);
    }, 2000);
  };

  const togglePlayPause = () => {
    const audio = document.getElementById("wedding-music") as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 }, // Comienza invisible y desplazado hacia abajo
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }, // Aparece suavemente
  };

  useEffect(() => {
    // Detectar si es un dispositivo móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    setIsLoaded(true);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Manejar selección de un invitado
  const handleSelectGuest = async (guest: any) => {
    if (guest) {
      setName(guest.name);
      setPasses(guest.passes || 1);
      setConfirmationStatus(guest.confirmation_status || "");
      setNotes(guest.notes || "");
      setAttendees(
        Array.from({ length: guest.passes - 1 }, (_, index) => ({
          name: guest.attendees?.[index]?.name || "",
          isConfirmed: guest.attendees?.[index]?.isConfirmed || false,
        }))
      );
    } else {
      setNotes("");
      setAttendees([]);
      setConfirmationStatus("");
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validar que el campo `name` tenga un valor
    if (!name.trim()) {
      Swal.fire("Error", "El nombre del invitado es obligatorio", "error");
      return;
    }

    // Verificar si el invitado ya existe
    const { data: existingGuest, error: fetchError } = await supabase
      .from("guests")
      .select("*")
      .eq("name", name)
      .single();

    if (fetchError) {
      Swal.fire(
        "Error",
        "Error al buscar el invitado: " + fetchError.message,
        "error"
      );
      return;
    }

    if (!existingGuest) {
      Swal.fire(
        "Error",
        "El invitado no existe y no se puede crear uno nuevo",
        "error"
      );
      return;
    }

    // Preparar los asistentes adicionales
    const additionalGuests = attendees
      .filter((attendee) => attendee.name.trim() !== "") // Solo los pases con nombre
      .map((attendee) => ({
        name: attendee.name,
        isConfirmed: attendee.isConfirmed,
      }));

    const updatedGuest = {
      name,
      confirmation_status: confirmationStatus,
      notes,
      date_confirmation: new Date().toISOString(),
      attendees: additionalGuests,
    };

    // Inserción o actualización en la tabla
    const { error } = await supabase
      .from("guests")
      .update(updatedGuest)
      .eq("name", name);

    if (error) {
      alert("Error al enviar la confirmación: " + error.message);
    }

    if (error) {
      Swal.fire(
        "Error",
        "Error al actualizar el invitado: " + error.message,
        "error"
      );
      return;
    }

    const url = GoogleCalendar();

    // alert("¡Confirmación enviada con éxito!");
    Swal.fire({
      title: "¡Confirmación Enviada!",
      html: `
        <a href="${url}" target="_blank" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Agregar a Google Calendar</a>
      `,
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "Cerrar",
      customClass: {
        confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
      },
    });

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setConfirmationStatus("");
    setNotes("");
    setPasses(1);
    setAttendees([]);
    if (selectRef.current) {
      selectRef.current.clearValue(); // Limpia el componente Select
    }
  };

  if (!isMobile) {
    return (
      // Mostrar contenido para dispositivos no móviles
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        {/* Mostrar imagen principal */}
        <div className="flex justify-center mb-8">
          <NextImage
            src="/foto-7.jpg"
            alt="Foto principal"
            className="w-full max-w-md object-contain"
            width={500}
            height={500}
          />
        </div>

        {/* Mensaje */}
        <div className="text-center mb-8">
          <h2 className="text-5xl px-12 text-black font-bold mb-4">
            PARA PODER VER ESTA INVITACIÓN DIGITAL POR FAVOR ESCANEE EL
            SIGUIENTE CÓDIGO QR EN SU CELULAR.
          </h2>
        </div>

        {/* Código QR */}
        <div className="flex justify-center mb-10">
          <NextImage
            src="/frame.png" // Usando la imagen cargada
            alt="Código QR"
            className="w-64 h-64 object-contain"
            width={50}
            height={50}
          />
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return;
  }

  return (
    <>
      <div className="bg-gray-50 text-gray-900 ">
        {/* Botón para abrir el velo */}
        {!closeFlowers && (
          <>
            <motion.div
              className="fixed inset-0 flex justify-center items-center z-50"
              initial="visible"
              animate={showContent ? "hidden" : "visible"}
              variants={messageVariants}
            >
              <div
                style={{ position: "absolute", top: "10em" }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">
                  Descubre nuestra historia de amor
                </h1>
                <button
                  onClick={handleButtonClick}
                  className="px-6 py-3 text-lg font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-500 transition duration-300"
                >
                  Entrar
                </button>
              </div>
            </motion.div>

            {/* Flores */}

            <motion.div
              className="flowers-container"
              initial="visible"
              animate={showContent ? "hidden" : "visible"}
              variants={flowersVariants}
            >
              <Flowers isLoaded={isLoaded} />
            </motion.div>

            {/* Velo */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
              initial="visible"
              animate={showContent ? "hidden" : "visible"} // Controlado por showContent
              variants={veilVariants}
            />
          </>
        )}

        {/* Banner */}
        <LazyMotionWrapper>
          <MyHeader togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
        </LazyMotionWrapper>

        {/*Mensaje de invitacion*/}
        <LazyMotionWrapper>
          <div>
            <h2 className="text-4xl font-serif text-center mt-40 mb-6 tracking-wider">
              ¡Nos casamos!
            </h2>
            <p className="text-lg font-sans text-center tracking-normal mb-1">
              Y queremos que vivas este momento
            </p>
            <p className="text-lg font-sans text-center tracking-normal mb-16">
              tan especial junto a nosotros
            </p>
          </div>
        </LazyMotionWrapper>

        {/*Celebración*/}
        <div>
          <LazyMotionWrapper>
            <h2 className="text-4xl font-serif text-center mt-16 mb-6 tracking-wider">
              ¿Dónde & cuándo?
            </h2>
            <div className="flex justify-center rounded overflow-hidden mb-6">
              <NextImage
                src="/parroquia-1.jpg"
                alt="Foto 1"
                className="w-80 h-full object-contain"
                width={500}
                height={500}
              />
            </div>
          </LazyMotionWrapper>
          <LazyMotionWrapper>
            <p className="text-2xl font-serif text-center mb-4 tracking-wider">
              CEREMONIA
            </p>
            <p className="text-lg font-sans text-center mb-4 tracking-normal">
              26 JULIO 2025 | 4:30 PM
            </p>
            <p className="text-2xl font-serif text-center mb-4 tracking-wider">
              PARROQUIA NUEVA SANTA MARIA
            </p>
            <p className="text-lg font-sans text-center tracking-normal">
              Av. 8 de julio, Nueva Santa María, 45530
            </p>
            <p className="text-lg font-sans text-center tracking-normal">
              San Pedro Tlaquepaque, Jal.
            </p>

            {/* Botón de mapa */}
            <div className="flex justify-center items-center mb-6 mt-6">
              <a
                href="https://maps.app.goo.gl/Rnn9a9RNbAY5qZxBB"
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 p-3 bg-black text-white rounded hover:bg-blue-900 active:scale-95 text-center"
              >
                VER EN EL MAPA
              </a>
            </div>
          </LazyMotionWrapper>

          <LazyMotionWrapper>
            <div className="flex justify-center rounded overflow-hidden mt-10 mb-6">
              <NextImage
                src="/villa-maria-salon.jpg"
                alt="Foto 1"
                className="w-80 max-w-md object-cover"
                width={500}
                height={500}
              />
            </div>
            <p className="text-2xl font-serif text-center mt-10 mb-4 tracking-wider">
              RECEPCIÓN
            </p>
            <p className="text-lg font-sans text-center mb-4 tracking-wide">
              19:00 H
            </p>
            <p className="text-xl font-serif text-center mb-4 tracking-wider">
              VILLA MARIA
            </p>
            <p className="text-lg font-sans text-center tracking-normal">
              Cam. Al Rancho La Teja 148, Centro, 45600
            </p>
            <p className="text-lg font-sans text-center tracking-normal">
              Santa Anita, Jal.
            </p>
          </LazyMotionWrapper>
        </div>

        {/* Botón de mapa */}
        <LazyMotionWrapper>
          <div className="flex justify-center items-center mb-6 mt-6">
            <a
              href="https://maps.app.goo.gl/KWyUuFn89s5oFUks8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-64 p-3 bg-black text-white rounded hover:bg-blue-900 active:scale-95 text-center"
            >
              VER EN EL MAPA
            </a>
          </div>

          <div className="rounded overflow-hidden">
            <NextImage
              src="/foto-5.jpg"
              alt="Foto 2"
              className="w-full h-full object-contain"
              width={500}
              height={500}
            />
          </div>
        </LazyMotionWrapper>

        {/* Formulario de Confirmación */}
        <LazyMotionWrapper>
          <section className="container mx-auto p-8">
            <h2 className="text-4xl font-serif text-center mb-4 tracking-wider">
              CONFIRMA TU ASISTENCIA
            </h2>
            <p className="text-lg font-sans text-center mb-2 tracking-normal">
              Codigo de vestimenta:
            </p>
            <p className="text-md font-sans text-center mb-4 tracking-normal">
              SEMI-FORMAL
            </p>

            {/* Colores no permitidos */}
            <div className="my-8 text-center">
              <p className="text-lg font-sans mb-4 tracking-normal">
                Colores no permitidos:
              </p>
              <div className="flex justify-center gap-4">
                {/* Circulos de colores */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2">Tinto</p>
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: "#800020" }}
                    title="Tinto"
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2">Blanco</p>
                  <div
                    className="w-12 h-12 rounded-full border border-gray-300"
                    style={{ backgroundColor: "#FFFFFF" }}
                    title="Blanco"
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2">Rojo</p>
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: "#FF0000" }}
                    title="Rojo"
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2">Azul Marino</p>
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: "#001F54" }}
                    title="Azul Marino"
                  ></div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded shadow-md space-y-6 max-w-lg mx-auto"
            >
              {/* Nombre con Autocompletar */}
              <div className="relative">
                <AutocompleteInput
                  ref={selectRef}
                  handleSelectGuest={handleSelectGuest}
                />
              </div>

              {/* Radio Buttons */}
              <div>
                <label className="block mb-2 text-lg font-sans">
                  ¿Asistirás?
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center text-base font-sans">
                    <input
                      type="radio"
                      name="attendance"
                      value="confirmed"
                      checked={confirmationStatus === "confirmed"}
                      onChange={(e: any) =>
                        setConfirmationStatus(e.target.value)
                      }
                      className="mr-2"
                      required
                    />
                    Sí, asistiré
                  </label>
                  <label className="flex items-center text-base font-sans">
                    <input
                      type="radio"
                      name="attendance"
                      value="declined"
                      checked={confirmationStatus === "declined"}
                      onChange={(e: any) =>
                        setConfirmationStatus(e.target.value)
                      }
                      className="mr-2"
                      required
                    />
                    Lo siento, no podré asistir
                  </label>
                </div>
              </div>

              {/* Campos para pases */}
              <div>
                <label className="block mb-2 text-lg font-sans">
                  Confirma quiénes asistirán:
                </label>
                {Array.from({ length: passes - 1 }, (_, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={attendees[index]?.isConfirmed || false}
                      disabled={!attendees[index]?.name}
                      onChange={(e) =>
                        setAttendees((prev) =>
                          prev.map((attendee, i) =>
                            i === index
                              ? { ...attendee, isConfirmed: e.target.checked }
                              : attendee
                          )
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder={`Nombre del pase ${index + 2}`}
                      className="p-2 border rounded w-full text-base"
                      value={attendees[index]?.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAttendees((prev) =>
                          prev.map((attendee, i) =>
                            i === index
                              ? {
                                  ...attendee,
                                  name: value,
                                  isConfirmed:
                                    value.trim() === ""
                                      ? false
                                      : attendee.isConfirmed, // Reiniciar checkbox si el campo está vacío
                                }
                              : attendee
                          )
                        );
                      }}
                    />
                  </div>
                ))}
                <p className="text-sm text-red-700 text-center mt-6 mb-6">
                  Si no vas a utilizar algún pase, deja el espacio en blanco
                </p>
              </div>

              {/* Notas */}
              <div>
                <label className="block mb-2 text-lg font-sans">
                  Déjanos un bonito mensaje (opcional):
                </label>
                <textarea
                  placeholder="Escribe aquí..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-3 border rounded w-full text-base"
                  rows={3}
                ></textarea>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={passes <= 0}
                className={`w-full p-3 
                  ${
                    passes > 0
                      ? "bg-black text-white"
                      : "bg-gray-400 text-gray-700"
                  } 
                  rounded text-lg font-serif tracking-wider`}
              >
                CONFIRMAR ASISTENCIA
              </button>
            </form>
          </section>
        </LazyMotionWrapper>

        {/* Mesa de regalos */}
        <LazyMotionWrapper>
          <div className="shadow-md pb-8">
            <h2 className="text-4xl font-serif text-center mt-16 mb-6 tracking-wider">
              MESA DE REGALOS
            </h2>
            <p className="text-lg font-sans text-center mb-6 tracking-normal">
              El mejor regalo es tu presencia, pero si deseas hacernos llegar un
              bonito detalle lo recibiremos con mucho cariño.
            </p>
            <p className="text-lg font-sans text-center mb-6 tracking-normal">
              Tampoco es necesario hacerlo en línea, habrá mesa física en el
              evento.
            </p>
          </div>

          <div className=" p-8 pt-10 shadow-md text-center">
            <NextImage
              src="/liverpool.png"
              alt="Foto 1"
              className="w-full h-full object-contain"
              width={500}
              height={500}
            />
            <p className="text-gray-600 text-sm uppercase tracking-wide">
              No. de evento
            </p>
            <p className="text-2xl font-semibold text-gray-800 mb-6">
              51605354
            </p>
            <a
              href="https://mesaderegalos.liverpool.com.mx/milistaderegalos/51605354"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Ver mesa de regalos
            </a>
          </div>
        </LazyMotionWrapper>

        {/* Mesa de regalos palacio de hierro*/}
        <LazyMotionWrapper>
          <div className="p-8 pt-10 shadow-md text-center">
            <NextImage
              src="/el-palacio-de-hierro.svg"
              alt="Foto 1"
              className="w-full h-full object-contain"
              width={500}
              height={500}
            />
            <p className="text-gray-600 text-sm uppercase tracking-wide mt-4">
              No. de evento
            </p>
            <p className="text-2xl font-semibold text-gray-800 mb-6">393386</p>
            <a
              href="Te comparto mi mesa de regalos Celebra https://www.elpalaciodehierro.com/buscar?eventId=393386"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Ver mesa de regalos
            </a>
          </div>

          {/*HASHTAG*/}
          <div className="border-2 border-white p-4 max-w-md mx-auto bg-black">
            <div className="bg-black text-white py-8 px-4 border-2 border-white text-center max-w-md mx-auto">
              <h2 className="text-xl font-serif uppercase mb-6">
                Durante nuestra boda utiliza el hashtag
              </h2>
              <div className="border-2 border-white py-4 px-6 mb-6">
                <span className="text-lg font-serif tracking-wider">
                  #BODAMAU&KARY
                </span>
              </div>
              <p className="text-sm font-sans">
                Comparte tus fotografías y videos con nosotros en redes
                sociales.
              </p>
            </div>
          </div>
        </LazyMotionWrapper>

        {/* Sección de Fotos */}
        <section className="p-8 bg-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Galería de Fotos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedImage
              src="/foto-1.jpg"
              alt="Foto 1"
              animation={bounceVariants}
            />
            <AnimatedImage
              src="/foto-2.jpg"
              alt="Foto 2"
              animation={shakeVariants}
            />
            <AnimatedImage
              src="/foto-3.png"
              alt="Foto 3"
              animation={zoomInVariants}
            />
            <AnimatedImage
              src="/foto-4.png"
              alt="Foto 4"
              animation={bounceVariants}
            />
            <AnimatedImage
              src="/foto-5.jpg"
              alt="Foto 5"
              animation={shakeVariants}
            />
            <AnimatedImage
              src="/foto-6.jpg"
              alt="Foto 6"
              animation={zoomInVariants}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center p-4">
          <p>
            &copy; [2025] [Mauricio lozano & Karina Solis]. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
