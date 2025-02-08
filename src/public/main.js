const socket = io();

socket.on('loadProducts', (data) => {
    console.log(data);
})

const userId = "679e70871a1ac5180c72e8fc"; // ID del usuario de prueba

socket.emit("getUserNotifications", userId); // Solicita las notificaciones al servidor

socket.on("userNotifications", (notifications) => {
    console.log("Notificaciones recibidas:", notifications);
});
