/* Safe Connect CSS - Vibrant Sniffies-inspired dark theme */

/* Reset default styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0d1117 0%, #1a202c 100%);
    color: #e2e8f0;
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow-x: hidden;
}

/* Subtle map-like background effect (Sniffies-inspired) */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 183, 235, 0.1) 10%, transparent 70%);
    z-index: -1;
    opacity: 0.5;
}

/* Container */
.container {
    max-width: 600px;
    width: 90%;
    margin: 2rem auto;
    padding: 2rem;
    background: #1a202c;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    border: 1px solid #00b7eb;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.container:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 183, 235, 0.3);
}

/* Header */
header {
    text-align: center;
    margin-bottom: 2rem;
}

h1 {
    font-size: 2.5rem;
    color: #00b7eb;
    text-shadow: 0 0 10px rgba(0, 183, 235, 0.7);
}

.subtitle {
    font-size: 1.3rem;
    color: #a0aec0;
    font-style: italic;
}

/* Screen styles */
.screen {
    display: none;
}

.screen.active {
    display: block;
}

/* Welcome Screen */
.info-box {
    background: linear-gradient(45deg, #2d3748, #1a202c);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 1px solid #00b7eb;
    box-shadow: 0 4px 8px rgba(0, 183, 235, 0.2);
}

.safety-features {
    list-style: none;
    margin: 1rem 0;
}

.safety-features li {
    margin: 0.75rem 0;
    color: #68d391;
    font-weight: 500;
    display: flex;
    align-items: center;
}

.safety-features li::before {
    content: '✓';
    margin-right: 0.5rem;
    color: #38a169;
}

.warning {
    color: #f56565;
    font-weight: 600;
    background: #3c1e1e;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #f56565;
}

/* Messaging Screen */
.message-area {
    background: #161b22;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #00b7eb;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.chat-header span {
    font-weight: 600;
    color: #00b7eb;
}

.exit-btn {
    background: linear-gradient(45deg, #f56565, #ff004f);
    color: white;
    border: none;
    border-radius: 50%;
    width: 52px;
    height: 52px;
    font-size: 1.8rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(245, 101, 101, 0.6);
    transition: transform 0.2s, box-shadow 0.2s;
}

.exit-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 16px rgba(245, 101, 101, 0.8);
}

.messages-container {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #1a202c;
    border: 1px solid #00b7eb;
    border-radius: 10px;
}

.system-message, .user-message {
    margin: 0.75rem 0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    opacity: 0;
    animation: slideIn 0.4s ease forwards;
}

.system-message p {
    color: #a0aec0;
    background: #2d3748;
    padding: 0.5rem;
    border-radius: 6px;
}

.user-message p {
    color: #e2e8f0;
    background: linear-gradient(45deg, #00b7eb, #00d4ff);
    padding: 0.5rem;
    border-radius: 6px;
}

.input-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

#message-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #00b7eb;
    border-radius: 10px;
    resize: none;
    font-size: 1rem;
    background: #161b22;
    color: #e2e8f0;
    transition: border-color 0.2s, box-shadow 0.2s;
}

#message-input:focus {
    border-color: #00d4ff;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
    outline: none;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Buttons */
.primary-btn, .secondary-btn, .exit-option {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.primary-btn {
    background: linear-gradient(45deg, #00b7eb, #00d4ff);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 183, 235, 0.6);
}

.primary-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 183, 235, 0.8);
}

.secondary-btn {
    background: #4a5568;
    color: #e2e8f0;
}

.secondary-btn:hover {
    background: #718096;
    transform: scale(1.05);
}

.exit-option {
    background: #4a5568;
    color: #e2e8f0;
    width: 100%;
}

.exit-option:hover {
    background: #718096;
    transform: scale(1.05);
}

/* Exit Screen */
.exit-info {
    text-align: center;
}

.resources {
    margin: 1.5rem 0;
    background: #161b22;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #00b7eb;
}

.resources ul {
    list-style: none;
    text-align: left;
}

.resources li {
    margin: 0.75rem 0;
    color: #e2e8f0;
}

/* Quick Exit Overlay */
.overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.overlay.active {
    display: flex;
}

.overlay-content {
    background: #1a202c;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    border: 1px solid #00b7eb;
    box-shadow: 0 8px 16px rgba(0, 183, 235, 0.4);
}

/* Animation for messages */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}

@media (max-width: 600px) {
    .container {
        width: 95%;
        margin: 1rem auto;
        padding: 1.5rem;
    }

    h1 {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1.1rem;
    }

    .messages-container {
        max-height: 200px;
    }

    .exit-btn {
        width: 44px;
        height: 44px;
        font-size: 1.5rem;
    }
}

@media (prefers-contrast: high) {
    body {
        background: #000000;
        color: #ffffff;
    }

    .container, .info-box, .message-area, .overlay-content {
        background: #1a1a1a;
        border: 1px solid #ffffff;
    }

    .primary-btn {
        background: #00aaff;
    }

    .secondary-btn, .exit-option {
        background: #666666;
        color: #ffffff;
    }

    .exit-btn {
        background: #ff3333;
    }

    .system-message p, .user-message p {
        background: #444444;
        color: #ffffff;
    }
}
