/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

interface Guest {
  name: string;
  passes: number;
}

const AutocompleteInput = ({
  suggestions,
  onQueryChange,
  handleSelectGuest,
}: {
  suggestions: Guest[];
  onQueryChange: (query: string) => void;
  handleSelectGuest: any;
}) => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [name, setName] = useState<string>("");

  // Maneja los cambios en el campo de entrada
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onQueryChange(value); // Notifica al componente padre
    setName(value);
  };

  const selectNewGuest = (e: any) => {
    setSelectedGuest(e);
    handleSelectGuest(selectedGuest);
  };

  return (
    <div className="relative">
      <label className="block mb-2 text-lg font-sans">Nombre Completo</label>
      <Combobox value={selectedGuest} onChange={selectNewGuest}>
        <ComboboxInput
          className="p-3 border rounded w-full text-base"
          placeholder="Busca tu nombre"
          onChange={handleInputChange}
          displayValue={(guest: Guest) => (guest ? guest.name : "")}
        />
        <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg z-50">
          {suggestions.length > 0 &&
            name.length > 0 &&
            suggestions.map((guest, index) => (
              <ComboboxOption
                key={index}
                value={guest}
                className={({ selected }) =>
                  `cursor-pointer select-none relative py-2 px-4 ${
                    selected ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`
                }
              >
                {() => (
                  <span>
                    {guest.name} ({guest.passes} pases)
                  </span>
                )}
              </ComboboxOption>
            ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

export default AutocompleteInput;

// import React, { useState } from "react";
// import Select from "react-select";

// const AutocompleteInput = ({ options }: { options: any }) => {
//   const [selectedOption, setSelectedOption] = useState<any>(null);

//   console.log(options);

//   return (
//     <div className="relative">
//       <label className="block mb-2 text-lg font-sans">Nombre Completo</label>
//       <Select
//         options={options} // Pasa las opciones al componente
//         value={selectedOption} // Opción seleccionada
//         onChange={setSelectedOption} // Actualiza la selección
//         placeholder="Busca tu nombre"
//         className="text-base" // Estilo del contenedor
//         classNamePrefix="react-select" // Clases para estilizar con Tailwind
//         styles={{
//           control: (base) => ({
//             ...base,
//             padding: "0.25rem", // Estilo del input
//             borderColor: "#d1d5db", // Tailwind gray-300
//             borderRadius: "0.375rem", // Tailwind rounded-md
//             boxShadow: "none", // Quitar borde cuando está activo
//           }),
//           menu: (base) => ({
//             ...base,
//             zIndex: 100, // Asegurar que el menú esté visible
//           }),
//           option: (base, { isFocused }) => ({
//             ...base,
//             backgroundColor: isFocused ? "#f3f4f6" : "white", // Tailwind gray-100
//             color: "black",
//           }),
//         }}
//       />
//     </div>
//   );
// };

// export default AutocompleteInput;
