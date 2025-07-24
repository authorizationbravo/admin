// server.js (Simplified for core concept)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const matrixcs = require('matrix-js-sdk'); // Import Matrix SDK for the server

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// --- Matrix Bot Configuration (on your server) ---
const MATRIX_HOME_SERVER_URL = "https://matrix.org"; // Or your own homeserver
const BOT_USER_ID = "@safeconnect_bot:matrix.org"; // Your dedicated bot account
const BOT_PASSWORD = "YOUR_BOT_PASSWORD"; // IMPORTANT: Use environment variables in production!
const ADVOCATE_USER_ID = "@adminconnet:matrix.org"; // Your advocate's Matrix ID

let matrixBotClient = null;
let advocateDmRoomId = null; // To store the DM room ID with the advocate

// Map to store WebSocket connections and their associated Matrix session details
const activeVictimSessions = new Map(); // sessionId -> { ws, matrixDmRoomId, advocateMatrixId }

// --- Initialize Matrix Bot ---
async function initializeMatrixBot() {
    matrixBotClient = matrixcs.createClient({
        baseUrl: MATRIX_HOME_SERVER_URL,
        userId: BOT_USER_ID,
        accessToken: null // Will get after login
    });

    try {
        // Login the bot account
        const loginResponse = await matrixBotClient.login('m.login.password', {
            user: BOT_USER_ID,
            password: BOT_PASSWORD
        });
        matrixBotClient.setAccessToken(loginResponse.access_token);
        matrixBotClient.setDeviceId(loginResponse.device_id);

        await matrixBotClient.startClient();
        console.log(`Matrix bot "${BOT_USER_ID}" logged in and started.`);

        // Find or create the direct message room with the advocate
        const rooms = matrixBotClient.getRooms();
        for (const room of rooms) {
            if (room.getMembers().some(m => m.userId === ADVOCATE_USER_ID) && room.isDirect) {
                advocateDmRoomId = room.roomId;
                console.log(`Found existing DM with advocate: ${advocateDmRoomId}`);
                break;
            }
        }

        if (!advocateDmRoomId) {
            // Create a new DM room if one doesn't exist
            const dmRoom = await matrixBotClient.createRoom({
                visibility: "private",
                preset: "trusted_private_chat",
                is_direct: true,
                invite: [ADVOCATE_USER_ID]
            });
            advocateDmRoomId = dmRoom.room_id;
            console.log(`Created new DM with advocate: ${advocateDmRoomId}`);
            await matrixBotClient.sendTextMessage(advocateDmRoomId, `Hello! I am the Safe Connect Bot. Anonymous users will connect through me. Say 'hi' to start.`);
        }

        // Listen for messages from the advocate in the DM room
        matrixBotClient.on("Room.timeline", (event, room, toStartOfTimeline) => {
            if (event.getType() === "m.room.message" && room.roomId === advocateDmRoomId && event.getSender() === ADVOCATE_USER_ID) {
                const content = event.getContent();
                const text = content.body;
                console.log(`Received message from advocate: ${text}`);

                // FOR MVP: If you have only ONE active victim at a time:
                // Relay this message to the active victim.
                if (activeVictimSessions.size > 0) {
                    const firstVictimSession = activeVictimSessions.values().next().value;
                    if (firstVictimSession.ws.readyState === WebSocket.OPEN) {
                        firstVictimSession.ws.send(JSON.stringify({ type: 'chat', sender: 'Advocate', text: text }));
                    }
                }
                // FOR MORE ROBUST: Advocate would send "reply to [victim_id]: message"
                // And your bot would parse that to send to the correct victim WebSocket.
            }
        });

    } catch (error) {
        console.error("Matrix bot initialization failed:", error);
        // Implement robust error handling (e.g., retry, alert admin)
    }
}
initializeMatrixBot(); // Call this to start the bot

// --- WebSocket Server Logic ---
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
    if (!matrixBotClient || !advocateDmRoomId) {
        ws.send(JSON.stringify({ type: 'error', message: 'Chat service not ready. Please try again later.' }));
        ws.close();
        return;
    }

    const sessionId = Math.random().toString(36).substring(2, 15);
    activeVictimSessions.set(sessionId, { ws: ws }); // Store ws and any other session data

    console.log(`New victim connected with session ID: ${sessionId}`);
    ws.send(JSON.stringify({ type: 'session_id', id: sessionId }));
    ws.send(JSON.stringify({ type: 'chat', sender: 'System', text: 'Connected to support. How can we help you anonymously?' }));

    // Notify advocate via Matrix that a new victim has connected
    matrixBotClient.sendTextMessage(advocateDmRoomId, `New anonymous victim connected (Session ID: ${sessionId}).`)
        .catch(err => console.error('Failed to notify advocate:', err));

    ws.on('message', message => {
        const msg = JSON.parse(message);
        if (msg.type === 'chat' && msg.text) {
            console.log(`Received message from victim ${sessionId}: ${msg.text}`);

            // Send victim's message to the advocate via Matrix
            matrixBotClient.sendTextMessage(advocateDmRoomId, `Victim (${sessionId}): ${msg.text}`)
                .catch(err => console.error('Failed to relay message to advocate:', err));

            // Optional: send back to sender for immediate display (as "You")
            ws.send(JSON.stringify({ type: 'chat', sender: 'You', text: msg.text }));
        }
    });

    ws.on('close', () => {
        console.log(`Victim disconnected: ${sessionId}`);
        activeVictimSessions.delete(sessionId);
        // Optionally notify advocate that victim disconnected
        matrixBotClient.sendTextMessage(advocateDmRoomId, `Victim (${sessionId}) disconnected.`)
            .catch(err => console.error('Failed to notify advocate of disconnect:', err));
    });

    ws.on('error', error => {
        console.error(`WebSocket error for victim ${sessionId}:`, error);
        activeVictimSessions.delete(sessionId);
    });
});

// ... (ping/pong, port setup, quick exit handling for advocate side if needed) ...

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
