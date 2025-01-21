const GoogleCalendar = () => {
  const title = encodeURIComponent("Boda de Mauricio y Karina");
  const details = encodeURIComponent(
    `Te invitamos a nuestra boda. 🥂💍

      recuerda que los colores no permitidos son:
      tinto, azul marino, rojo y blanco.
  
        CEREMONIA:
        26 de Julio de 2025 a las 4:30 PM
        Parroquia Nueva Santa María
        Av. 8 de julio, Nueva Santa María, 45530
        San Pedro Tlaquepaque, Jal.
        https://maps.app.goo.gl/Rnn9a9RNbAY5qZxBB
        
        RECEPCIÓN:
        19:30 H
        Villa María
        Cam. Al Rancho La Teja 148, Centro, 45600
        Santa Anita, Jal.
        https://maps.app.goo.gl/KWyUuFn89s5oFUks8

        Mesas de regalos

        Liverpool:
        https://mesaderegalos.liverpool.com.mx/milistaderegalos/51605354

        Fabricas de francia
        https://www.elpalaciodehierro.com/buscar?eventId=393386
        
        ¡Será un día muy especial y queremos que lo vivas con nosotros!`
  );
  const location = encodeURIComponent("Parroquia Nueva Santa María");

  // Fechas en formato UTC: YYYYMMDDTHHmmssZ
  const ceremonyStart = "20250726T163000Z"; // 4:30 PM UTC
  const ceremonyEnd = "20250726T173000Z"; // 5:30 PM UTC
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${ceremonyStart}/${ceremonyEnd}`
  return url;
};

export default GoogleCalendar;
