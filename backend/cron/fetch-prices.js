const io = require('socket.io-client');

const socket = io('wss://api.haremaltin.com', {
    transports: ['websocket'],
    rejectUnauthorized: false
});

let timeoutId;
let result = null;

// 10 saniye timeout
timeoutId = setTimeout(() => {
    socket.disconnect();
    process.exit(1);
}, 10000);

socket.on('connect', () => {
});

socket.on('price_changed', (data) => {
    if (data.data) {
        clearTimeout(timeoutId);
        result = {
            success: true,
            data: data.data
        };
        socket.disconnect();
        console.log(JSON.stringify(result));
        process.exit(0);
    }
});

socket.on('connect_error', (error) => {
    clearTimeout(timeoutId);
    socket.disconnect();
    process.exit(1);
});