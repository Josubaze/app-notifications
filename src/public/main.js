const socket = io();

socket.on('loadProducts', (data) => {
    console.log(data);
})