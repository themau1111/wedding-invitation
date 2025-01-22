"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type Attendee = {
  name: string;
  isConfirmed: boolean;
};

type Guest = {
  id: string;
  name: string;
  email: string;
  passes: number;
  attendees: Attendee[];
  confirmation_status?: string;
  date_confirmation?: string;
  notes?: string;
};

export default function Admin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Guest>({
    id: "",
    name: "",
    email: "",
    passes: 0,
    attendees: [],
    confirmation_status: "Pendiente",
    notes: "",
  });
  const [attendees, setAttendees] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("Session Data:", data);
      if (!data.session) {
        router.push("/login"); // Redirigir si no hay sesión
      }
    };

    checkUser();
    fetchGuests();
  }, []);

  useEffect(() => {
    const fetchGuest = async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("id", editingGuest?.id) // Usamos el ID del invitado directamente
        .single();

      if (error) {
        console.error("Error al cargar el invitado:", error.message);
        return;
      }

      setEditingGuest(data); // Guardamos el registro completo
      setAttendees(
        data.attendees?.map((att: any) => att.name).join(", ") || "" // Convertimos el array a texto
      );
    };

    if (editingGuest && editingGuest.id) fetchGuest(); // Llamar solo si `editingGuest` tiene un `id`
  }, [editingGuest?.id]);

  const fetchGuests = async (): Promise<void> => {
    const { data, error } = await supabase.from("guests").select("*");
    if (!error) {
      setGuests(data as any);
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    await supabase.from("guests").delete().eq("id", id);
    fetchGuests();
  };

  const handleSave = async () => {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Error de sesión:", sessionError || "No hay sesión activa");
      alert("No puedes guardar datos sin iniciar sesión.");
      return;
    }

    console.log("Sesión activa:", session);

    // Convertir texto plano en un array de objetos
    const attendeesArray = attendees
      .split(",")
      .map((name) => ({ name: name.trim() }))
      .filter((attendee) => attendee.name !== "");

    let result;
    if (editingGuest) {
      result = await supabase
        .from("guests")
        .update({ ...editingGuest, attendees: attendeesArray })
        .eq("id", editingGuest.id); // Asegúrate de usar "id" como identificador único
    } else {
      result = await supabase
        .from("guests")
        .insert({ ...newGuest, attendees: attendeesArray });
    }

    if (result.error) {
      console.error("Error al guardar el invitado:", result.error.message);
      alert(`Error: ${result.error.message}`);
      return;
    }

    alert("¡Confirmación enviada con éxito!");
    setEditingGuest(null); // Reseteamos editingGuest
    setNewGuest({
      id: "",
      name: "",
      email: "",
      passes: 0,
      attendees: [],
      confirmation_status: "Pendiente",
      notes: "",
    });
    setAttendees("");
    fetchGuests();
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Administrar Invitados</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="space-y-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 p-2 text-gray-900">
                  Nombre
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Email
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Pases
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Confirmación
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Fecha de confirmación
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Acompañantes
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Notas
                </th>
                <th className="border border-gray-300 p-2 text-gray-900">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest: any) => (
                <tr key={guest.id} className="bg-gray-800">
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.name}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.email}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.passes}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.confirmation_status || "Pendiente"}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.date_confirmation}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.attendees?.map((attendee: any, index: any) => (
                      <div key={index}>
                        {attendee.name || `Asistente ${index + 1}`} -{" "}
                        {attendee.confirmed ? "Confirmado" : "Pendiente"}
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2 text-white">
                    {guest.notes || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingGuest(guest)}
                        className="p-2 bg-yellow-400 text-black rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="p-2 bg-red-500 text-black rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold text-gray-900">
              {editingGuest ? "Editar Invitado" : "Agregar Nuevo Invitado"}
            </h2>
            <input
              type="text"
              placeholder="Nombre"
              value={editingGuest?.name ?? newGuest.name ?? ""}
              onChange={(e) =>
                editingGuest
                  ? setEditingGuest({ ...editingGuest, name: e.target.value })
                  : setNewGuest({ ...newGuest, name: e.target.value })
              }
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={editingGuest?.email ?? newGuest.email ?? ''}
              onChange={(e) =>
                editingGuest
                  ? setEditingGuest({ ...editingGuest, email: e.target.value })
                  : setNewGuest({ ...newGuest, email: e.target.value })
              }
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Pases"
              value={
                editingGuest
                  ? editingGuest.passes === 0
                    ? ""
                    : editingGuest.passes
                  : newGuest.passes === 0
                  ? ""
                  : newGuest.passes
              }
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                if (editingGuest) {
                  setEditingGuest({ ...editingGuest, passes: value });
                } else {
                  setNewGuest({ ...newGuest, passes: value });
                }
              }}
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />

            {/* Confirmación */}
            <select
              value={
                editingGuest
                  ? editingGuest.confirmation_status || "Pendiente"
                  : newGuest.confirmation_status || "Pendiente"
              }
              onChange={(e) =>
                editingGuest
                  ? setEditingGuest({
                      ...editingGuest,
                      confirmation_status: e.target.value,
                    })
                  : setNewGuest({
                      ...newGuest,
                      confirmation_status: e.target.value,
                    })
              }
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Rechazado">Rechazado</option>
            </select>

            {/* Acompañantes */}
            <textarea
              placeholder="Acompañantes (separados por comas)"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />

            {/* Notas */}
            <textarea
              placeholder="Notas"
              value={
                editingGuest ? editingGuest.notes || "" : newGuest.notes || ""
              }
              onChange={(e) =>
                editingGuest
                  ? setEditingGuest({ ...editingGuest, notes: e.target.value })
                  : setNewGuest({ ...newGuest, notes: e.target.value })
              }
              className="p-2 w-full border rounded mt-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600 transition duration-200"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
