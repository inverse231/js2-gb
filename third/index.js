const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
function makeGETRequest(url) {
    return new Promise((resolve,reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const body = JSON.parse(xhr.responseText);
                resolve(body);
            } else if(xhr.readyState === 4 && xhr.status !== 200){
              reject(() => {
                  console.error(xhr.status);
              });
            }
        };
        xhr.open('GET', url);
        xhr.send();
    })
}


class GoodsItem {
    constructor(product_name = 'Без имени', price = 100) {
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="goods-item">
                    <h3 class="title goods-title">${this.product_name}</h3>
                    <p class="goods-price">${this.price} ₽</p>
                    <button class="goods-button">Купить</button>
                </div>`;
    }
}

class CartItem {
    constructor(product_name="name", price="100", count=0) {
        this.product_name = product_name;
        this.price = price;
        this.count = count;
    }
    render() {
        return `<div class="goods-item">
                    <h3 class="product_name goods-product_name">${this.product_name}</h3>
                    <p class="goods-price">${this.price}</p>
                    <span class="goods-count">${this.count}</span>
                    <button class="goods-inc">+</button>
                    <button class="goods-dec">-</button>
                </div>`;
    }
}

class Cart {
    constructor() {
        this.items = [];
        this.element = document.querySelector('.cart');
    }
    addCartItem(name, price) {
        let newItem = new CartItem(name, price);
        this.items += newItem;
        newItem.count++;
        this.element.innerHTML += newItem.render();
    }
    incCartItem(item) {
        let count;
        this.items.forEach(arrItem => {
            if(arrItem === item) {
                count = arrItem.count++;
            }
        })
        return count;
    }
    decCartItem(item) {
        this.items.forEach(arrItem => {
            if (arrItem === item) {
                if (arrItem.count !== 0) {
                    arrItem.count--;
                } else {
                    this.deleteCartItem(arrItem);
                }
            }
        })
    }
    deleteCartItem(item) {
        this.items -= item;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    async fetchGoods() {
        let a = await makeGETRequest(`${API_URL}/catalogData.json`);
        return new Promise((resolve, reject) => {
            resolve(a);
            reject("err => console.error(err)");
        })
            .then(res => {
                this.goods = res;
                this.render();
            })
            .catch(err => console.error(err))
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price);
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

const cart = new Cart();
const list = new GoodsList();
list.fetchGoods()
    .then(() => console.log(list.countSum()))
    .catch((err) => console.error(err));


//тяжелые попытки добавить элемент в корзину
setTimeout(function () {
    let buttonAdd = document.querySelectorAll('.goods-button');
    let buttonInc = document.querySelectorAll('.goods-inc');
    let buttonDec = document.querySelectorAll('.goods-dec');
    console.log(buttonDec);
    let title = document.querySelectorAll('.goods-title');
    let price = document.querySelectorAll('.goods-price');
    let count = document.querySelectorAll('.goods-count');
    buttonAdd.forEach(function(item, i) {
        item.addEventListener('click', function () {
            let itemName = title[i];
            let itemPrice = price[i];
            cart.addCartItem(itemName.textContent, itemPrice.textContent);
        });
    buttonInc.forEach(function (item, i) {
       item.addEventListener('click', function () {
           count[i].innerHTML += 1;
       });
    });
})

}, 1000);


