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
    addCartItem(item) {}
    deleteCartItem(item) {}
    changeItemQuantity(item) {}
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

class Chat {

}

class ChatMessage {
    constructor(text, time) {
        this.text = text;
        this.time = time;
    }
    sendMessage(){
        return '<div><span class="sent-message"></span></div>'
    }
}



const list = new GoodsList();
list.fetchGoods();
list.render();
console.log(list.countSum());