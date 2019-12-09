class ChatMessage {
    constructor(text, time) {
        this.text = text;
        this.time = time;
    }
    renderMessage() {
        return `<div><span class="sent-message">${this.text}</span><span class="sent-time">${this.time}</span></div>`
    }
}

class Chat {
    constructor(element) {
        this.element = element;
    }
    sendMessage() {
        sentMessage = new ChatMessage("test", "2001");
        this.element.innerHTML += sentMessage.render;
    }
}

const chat = document.querySelector('.main-chat-window');
test = new Chat(chat);
test.sendMessage();