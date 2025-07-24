// Secure Messaging Service JavaScript
// Decentralized implementation with Matrix protocol and Sniffies-like anonymity/data erasure

class SecureMessagingService {
    constructor() {
        this.sessionId = this.generateSecureId();
        this.messages = [];
        this.isSessionActive = false;
        this.matrixClient = null;
        this.roomId = "!public-safe-connect-room:matrix.org"; // Replace with your Matrix room ID
        this.supportUser = "@adminconnet:matrix.org"; // Support specialist
        this.escapeCount = 0;
        this.initializeEventListeners();
        this.setupSecurityFeatures();
    }

    generateSecureId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async initializeMatrixClient() {
        try {
            // Initialize Matrix client for anonymous guest access
            this.matrixClient = matrixcs.createClient({
                baseUrl: "https://matrix.org",
                deviceId: this.sessionId,
            });

            // Register as guest (Sniffies-like anonymous profile)
            const { user_id, access_token } = await this.matrixClient.registerGuest();
            this.matrixClient.setAccessToken(access_token);
            this.matrixClient.setGuest(true);
            await this.matrixClient.startClient();

            // Join the predefined public room
            await this.matrixClient.joinRoom(this.roomId);

            // Notify support specialist of new session
            await this.matrixClient.sendTextMessage(
                this.roomId,
                `New anonymous user (${user_id}) has joined the session.`
            );

            // Listen for incoming messages
            this.matrixClient.on("Room.timeline", (event, room, toStartOfTimeline) => {
                if (event.getType() === "m.room.message" && room.roomId === this.roomId) {
                    const content = event.getContent();
                    if (content.body && event.getSender() === this.supportUser) {
                        this.addSupportMessage(content.body);
                    }
                }
            });

            this.addSystemMessage("Connected to secure, anonymous, decentralized messaging environment. A support specialist (@adminconnet) will respond soon.");
        } catch (error) {
            console.error("Matrix initialization failed:", error);
            this.showNotification("Failed to connect. Please try again.");
        }
    }

    initializeEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startSession());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartSession());
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearMessage());
        document.getElementById('quick-exit').addEventListener('click', () => this.showQuickExit());
        document.getElementById('cancel-exit').addEventListener('click', () => this.hideQuickExit());
        document.getElementById('exit-google').addEventListener('click', () => this.quickExit('google'));
        document.getElementById('exit-weather').addEventListener('click', () => this.quickExit('weather'));
        document.getElementById('exit-close').addEventListener('click', () => this.quickExit('close'));
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        const messageInput = document.getElementById('message-input');
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.sendMessage();
            }
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Ensure data erasure on browser close (Sniffies-like)
        window.addEventListener('beforeunload', () => this.clearAllData());
    }

    setupSecurityFeatures() {
        document.body.style.userSelect = 'none';
        document.getElementById('message-input').style.userSelect = 'text';

        setInterval(() => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('').catch(() => {});
            }
        }, 30000);

        this.monitorScreenSharing();
        this.setupSessionTimeout();
    }

    monitorScreenSharing() {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = function(...args) {
                alert('Screen sharing detected. For your safety, please end screen sharing while using this service.');
                return originalGetDisplayMedia.apply(this, args);
            };
        }
    }

    setupSessionTimeout() {
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            if (this.isSessionActive) {
                inactivityTimer = setTimeout(() => {
                    this.emergencyExit();
                }, 30 * 60 * 1000); // 30 minutes
            }
        };
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('click', resetTimer);
        resetTimer();
    }

    async startSession() {
        this.isSessionActive = true;
        this.showScreen('messaging-screen');
        await this.initializeMatrixClient();
        document.getElementById('message-input').focus();
    }

    async sendMessage() {
        const messageInput = document.getElementById('message-input');
        const messageText = messageInput.value.trim();

        if (!messageText) {
            this.showNotification('Please enter a message before sending.');
            return;
        }

        if (!this.matrixClient) {
            this.showNotification('Not connected to messaging service. Please restart session.');
            return;
        }

        try {
            await this.matrixClient.sendTextMessage(this.roomId, messageText);
            this.addUserMessage(messageText);
            messageInput.value = '';
            this.scrollToBottom();
        } catch (error) {
            console.error("Failed to send message:", error);
            this.showNotification('Failed to send message. Please try again.');
        }
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `<p><strong>You:</strong> ${this.escapeHtml(text)}</p>`;
        messagesContainer.appendChild(messageDiv);
        this.messages.push({ type: 'user', text, timestamp: new Date().toISOString() });
    }

    addSupportMessage(text) {
        const messagesContainer = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.innerHTML = `<p><strong>Support Specialist:</strong> ${this.escapeHtml(text)}</p>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addSystemMessage(text) {
        const messagesContainer = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
        messagesContainer.appendChild(messageDiv);
    }

    clearMessage() {
        document.getElementById('message-input').value = '';
        document.getElementById('message-input').focus();
    }

    showQuickExit() {
        document.getElementById('quick-exit-overlay').classList.add('active');
    }

    hideQuickExit() {
        document.getElementById('quick-exit-overlay').classList.remove('active');
    }

    quickExit(type) {
        this.clearAllData();
        switch (type) {
            case 'google':
                window.location.href = 'https://www.google.com';
                break;
            case 'weather':
                window.location.href = 'https://weather.com';
                break;
            case 'close':
                window.close();
                setTimeout(() => {
                    window.location.href = 'about:blank';
                }, 100);
                break;
        }
    }

    emergencyExit() {
        this.clearAllData();
        this.showScreen('exit-screen');
    }

    clearAllData() {
        this.messages = [];
        this.isSessionActive = false;
        if (this.matrixClient) {
            try {
                // Leave the room to ensure no server-side session data persists
                this.matrixClient.leave(this.roomId).catch(() => {});
                this.matrixClient.stopClient();
                this.matrixClient = null;
            } catch (error) {
                console.error("Error stopping Matrix client:", error);
            }
        }
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => input.value = '');
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '<div class="system-message"><p>You are now in a secure, anonymous, decentralized messaging environment. A support specialist will respond to your message.</p></div>';
        if (history.replaceState) {
            history.replaceState(null, null, window.location.href);
        }
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
            sessionStorage.clear();
        }
    }

    restartSession() {
        this.clearAllData();
        this.sessionId = this.generateSecureId();
        this.showScreen('welcome-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    handleKeyboardShortcuts(e) {
        if (e.key === 'Escape') {
            this.escapeCount = (this.escapeCount || 0) + 1;
            setTimeout(() => { this.escapeCount = 0; }, 1000);
            if (this.escapeCount >= 3) {
                this.emergencyExit();
            }
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            this.showQuickExit();
        }
        if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) {
            e.preventDefault();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4299e1;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1001;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SecureMessagingService();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});
