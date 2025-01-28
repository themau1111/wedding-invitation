/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from "@/app/lib/supabase";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { debounce } from "lodash";

type Attendee = {
  name: string;
  isConfirmed: boolean;
};

type Guest = {
  name: string;
  passes: number;
  email?: string;
  confirmation_status?: string; // confirmed | declined
  notes?: string;
  attendees?: Attendee[];
};

const AutocompleteInput = ({
  handleSelectGuest,
  ref,
}: {
  handleSelectGuest: (guest: Guest) => void;
  ref: any;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  // Opciones en formato compatible con React-Select
  const getOptions = () => {
    if (inputValue.length > 0) {
      return suggestions.map((guest) => ({
        value: guest.name,
        label: `${guest.name} (${guest.passes} pases)`,
        data: guest, // Incluimos el objeto completo para usarlo en la selección
      }));
    } else return [];
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      console.log(selectedOption.data);
      handleSelectGuest(selectedOption.data); // Pasamos el invitado seleccionado
    }
  };

  useEffect(() => {
    const fetchSuggestions = debounce(async () => {
      if (inputValue.length > 0) {
        setLoading(true);
        const { data, error } = await supabase
          .from("guests")
          .select("name, passes, confirmation_status, notes, attendees")
          .ilike("name", `%${inputValue}%`);

        if (error) {
          console.error("Error al cargar las sugerencias");
        } else {
          setSuggestions((data as any) || []);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);

    fetchSuggestions();
    return () => fetchSuggestions.cancel();
  }, [inputValue]);

  return (
    <div className="relative">
      <label className="block mb-2 text-lg font-sans">Nombre Completo</label>
      <Select
        ref={ref}
        options={getOptions()}
        onChange={handleChange} // Maneja la selección
        onInputChange={handleInputChange} // Notifica al componente padre
        placeholder="Busca tu nombre"
        isClearable // Permite limpiar la selección
        noOptionsMessage={() =>
          loading
            ? "Cargando..."
            : inputValue.length > 0
            ? "No hay resultados"
            : "Escribe para buscar"
        }
        className="text-base"
        classNamePrefix="react-select" // Para personalizar estilos con Tailwind
        styles={{
          control: (base) => ({
            ...base,
            padding: "0.25rem",
            borderColor: "#d1d5db", // Tailwind gray-300
            borderRadius: "0.375rem", // Tailwind rounded-md
            boxShadow: "none", // Quitar el borde activo
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100, // Asegurar que el menú esté visible
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? "#f3f4f6" : "white", // Tailwind gray-100
            color: "black",
          }),
        }}
      />
    </div>
  );
};

export default AutocompleteInput;
