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
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const body = JSON.parse(xhr.responseText);
                    resolve(body);
                } else {
                    reject(xhr.responseText);
                }
            }
        };
        xhr.onerror = function (error) {
            reject(err);
        };
        xhr.open('GET', url);
        xhr.send();
    })
}


class GoodsItem {
    constructor(product_name = 'Без имени', price = 100, id_product) {
        this.product_name = product_name;
        this.price = price;
        this.id_product = id_product;
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
                 <button class="goods-dec">-</button>
                <span class="goods-count">${this.count}</span>
                <button class="goods-inc">+</button>
                </div>`;
    }
}

class Cart {
    constructor() {
        this.items = [];
        this.idItems = [];
        this.element = document.querySelector('.cart');
    }

    addCartItem(name, price) {
        let newItem = new CartItem(name, price);
        this.items += newItem;
        newItem.count++;
        this.element.innerHTML += newItem.render();
        /*   this.products = id;
           let buttonAdd = document.querySelectorAll('.goods-button');
           let title = document.querySelectorAll('.goods-title');
           let price = document.querySelectorAll('.goods-price');
           buttonAdd.forEach(function (item, i) {
               item.addEventListener('click', function () {
                   if (cart.idItems.includes(this.products[i], 0)) {
                       let count = document.querySelectorAll('.goods-count');
                       let currentCount = parseInt(count[i].textContent);
                       count[i].innerHTML = ++currentCount;

                   } else {
                       let itemName = title[i];
                       let itemPrice = price[i];
                       cart.addCartItem(itemName.textContent, itemPrice.textContent);
                       cart.idItems.push(pr[i]);
                   }
               });
           });*/
    }
    incCartItem(item) {
        let count;
        this.items.forEach(arrItem => {
            if(arrItem === item) {
                count = arrItem.count++;
            }
        });
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
        this.products = [];
    }
    fetchGoods() {
        return makeGETRequest(`${API_URL}/catalogData.json`).then((goods) => {
            this.goods = goods;
        });
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price, good.id_product);
            listHtml += goodItem.render();
            this.products.push(good.id_product);
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
        add(this.products);
    }
    countSum() {
        let sum = 0;
        this.goods.forEach(element => {
            sum += element.price;
        });
        return sum;
    }
    getProducts() {
        return this.products;
    }
}

function add(pr) {
    let buttonAdd = document.querySelectorAll('.goods-button');
    let title = document.querySelectorAll('.goods-title');
    let price = document.querySelectorAll('.goods-price');
    let idArr = [];
    buttonAdd.forEach(function (item, i) {
        item.addEventListener('click', function () {
            if (idArr.includes(pr[i], 0)) {
                let count = document.querySelectorAll('.goods-count');
                let currentCount = parseInt(count[i].textContent);
                count[i].innerHTML = ++currentCount;
            } else {
                let itemName = title[i];
                let itemPrice = price[i];
                cart.addCartItem(itemName.textContent, itemPrice.textContent);
                idArr.push(pr[i]);
            }
        });
    });
}
const list = new GoodsList();
const cart = new Cart();



// function countIncr() {
//     let currentCount = 1;
//     return function() {
//         return currentCount++;
//     };
// }
// let getCount = countIncr();
// console.log(getCount());
// count[i].innerHTML = countIncr()();
// buttonInc.forEach(function (button, i) {
//     button.addEventListener('click', function () {
//         console.log(count[i].textContent);
//         count[i].innerHTML += 1;
//     });
// });
list.fetchGoods().then(() => {
    list.render();
});



//тяжелые попытки добавить элемент в корзину

