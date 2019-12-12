class GoodsItem {
    constructor(title = 'Без имени', price = '') {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item">
                    <h3 class="title goods-title">${this.title}</h3>
                    <p>${this.price} ₽</p>
                </div>`;
    }
}

class CartItem {
    constructor(title, price) {

    }
    render() {
        return
    }
}

class Cart {
    constructor() {
        this.items = [];
    }
    addCartItem(item) { }
    deleteCartItem(item) { }
    changeItemQuantity(item) { }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [{
            title: 'Shirt',
            price: 150
        },
        {
            title: 'Socks',
            price: 150
        },
        {
            title: 'Jacket',
            price: 150
        },
        {
            title: 'Shoes',
            price: 150
        },
        ];
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    countSum() {
        let sum = 0;
        this.goods.forEach(element => {
            sum += element.price;
        });
        return sum;
    }
}

//Chat stuff
const messageBox = document.querySelector('.message-box');
class ChatMessage {
    constructor(text) {
        let today = new Date();
        this.text = text;
        if (today.getMinutes() < 10) {
            this.time = today.getHours() + ':0' + today.getMinutes();
        }
        else {
            this.time = today.getHours() + ':' + today.getMinutes();
        }
    }
    renderMessage() {
        return `<div class="new-sent-message"><span class="sent-message">${this.text}</span><span class="sent-time">${this.time}</span></div>`
    }
}

class Chat {
    constructor(element) {
        this.element = element;
        this.messages = [];
        this.messageBox = messageBox;
    }
    sendMessage(message) {
        message = new ChatMessage(message);
        this.element.innerHTML += message.renderMessage();
    }
}

const mainChatWindow = document.querySelector('.main-chat-window');
const chat = new Chat(mainChatWindow);
messageBox.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        chat.sendMessage(this.value);
        this.value = "";
    }
});


let cross = document.querySelector('.chat-cross');
let band = document.querySelector('.chat-band');
let chatWindow = document.querySelector('.chat-window');

function openChat() {
    chatWindow.style.display = 'flex';
    cross.style.alignSelf = 'flex-start';
    cross.style.display = 'block';
    band.style.display = 'none';
}
function closeChat() {
    chatWindow.style.display = 'none';
    cross.style.alignSelf = 'flex-end';
    cross.style.display = 'none';
    band.style.display = 'flex';
}
band.addEventListener("click", openChat);
cross.addEventListener("click", closeChat);

const list = new GoodsList();
list.fetchGoods();
list.render();
console.log(list.countSum());