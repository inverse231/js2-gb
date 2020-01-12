let productCart = [];

Vue.component('search', {
    data: () => ({ searchLine: '' }),
    template: 
    `<form class="search-form" v-on:submit.prevent="">
        <input type="text" class="search-input" v-model="searchLine">
        <button class="search-button" @click="filterGoods">Искать</button>
    </form>`,
    methods: {
        filterGoods() {
            this.$emit('filter-goods', this.searchLine);
        }
    },
});

Vue.component('goods-item', {
    props: ['good'],
    template:
    `<div class="goods-item">
      <h3 class="good_title">{{ good.product_name }}</h3>
      <p class="good_price">{{ good.price }}</p>
      <button class="goods-button" @click="addProduct(good)">Купить</button>
    </div>`
    ,
    methods: {
        addProduct(good) {
            let findProduct = productCart.find(item => item.product_name === good.product_name);
            if (!findProduct) {
                productCart.push(Object.assign({}, good, { count: 1 }));
                good.count = 1;
                this.$emit('show-cart');
            } else {
                findProduct.count++;
            }
            this.$emit('add-product', good);
        }
    }
});
Vue.component('goods-list', {
    props: ['goods'],
    data: () => {
        return { filteredItems: '' }
    },
    computed: {
        isGoodsEmpty() {
            return this.goods.length === 0;
        }
    },
    template:
        `<div class="goods-list" v-if="!isGoodsEmpty">
      <goods-item v-for="good in goods" :good="good" :key="good.id_product" @add-product="addProduct"></goods-item>
    </div>
    <div class="not-found-items" v-else>
      <h2>Нет данных</h2>
    </div>`
    ,
    methods: {
        addProduct(good) {
            this.$emit("add-product", good);
        }
    }
});
Vue.component('cart-item', {
    props:['good'],
    template: 
    `<div class="cart-item">
        <h3 class="good_title">{{ good.product_name }}</h3>
        <p class="good_price">{{ good.price }}</p>
        <button class="goods-dec" @click="decCount(good)">-</button>
        <span class="goods-count">{{ good.count }}</span>
        <button class="goods-inc" @click="incCount(good)">+</button>
    </div>`,
    methods: {
        decCount(good) {
            if (good.count === 1) {
                productCart.splice(productCart.indexOf(good), 1);
                if (productCart.length === 0) {
                    this.visibility = !this.visibility;
                }
                this.$emit('delete-item', good);
            } else {
                good.count--;
                this.$emit("dec-count", good);
            }
        },
        incCount(good) {
            good.count++;
            this.$emit("inc-count", good);
        },
    }
});
Vue.component('cart', {
    data: () => {
        return {
            productCart: productCart,
        }
    },
    template: 
    `<div class="cart-block">
        <div class="cart">
          <div class="empty" v-if="productCart.length === 0">Ваша корзина пуста. Скорее приступайте к покупкам!</div>
          <cart-item v-else v-for="(good, index) in productCart" :good="good" :key="good.id_product" @inc-count="incCount(good)" @dec-count="decCount(good)" @delete-item="deleteItem(index)"></cart-item>
        </div>
      </div>`,
    methods: {
        incCount(good) {
            this.$emit('inc-count', good);
        },
        decCount(good) {
            this.$emit('dec-count', good);
        },
        deleteItem(index) {
            this.$emit('delete-from-cart', index);
        },
    }
});
const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        cartGoods: [],
        productCart: [],
        itemsFiltered: [],
        visibility: false
    },
    methods: {
        showCart() {
            this.visibility = !this.visibility;
        },
        showCartHandler() {
            if (!this.visibility)
                this.showCart();
        },
        makeGETRequest(url) {
            return new Promise((resolve, reject) => {
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
                            resolve(body)
                        } else {
                            reject(xhr.responseText);
                        }
                    }
                };
                xhr.onerror = function (err) {
                    reject(err);
                };

                xhr.open('GET', url);
                xhr.send();
            });
        },
        makeDELETERequest(url) {
            return new Promise((resolve, reject) => {
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
                            resolve(body)
                        } else {
                            reject(xhr.responseText);
                        }
                    }
                };
                xhr.onerror = function (err) {
                    reject(err);
                };

                xhr.open('DELETE', url);
                xhr.send();
            });
        },
        makePOSTRequest(url, data) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        resolve(xhr.responseText);
                    }
                };
                //xhr.onerror=(err)=>{reject(err)};

                xhr.open('POST', url);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.send(JSON.stringify(data));
            });
        },
        filters(searchLine) {
            this.searchLine = searchLine;
            if (this.searchLine.length !== 0) {
                this.filteredGoods = [...this.goods];
                this.filteredGoods = this.filteredGoods.filter(good => {
                    return good.product_name.toLowerCase().includes(this.searchLine);
                });
            } else {
                return this.filteredGoods = [... this.goods];
            }
        },
        addProduct(good) {
            this.makePOSTRequest('/cart', good);
        },
        incCount(good) {
            this.makePOSTRequest('/incCount', good);
            console.log("inc");
        },
        decCount(good) {
            this.makePOSTRequest('/decCount', good);
            console.log("dec");
        },
        deleteFromCart(index) {
            this.makeDELETERequest(`cart/${index}`);
        }
    },
    mounted() {
        Promise.all([
            this.makeGETRequest(`/catalog`),
            this.makeGETRequest(`/cart`),
        ]).then(([catalogData, cartData]) => {
            this.goods = catalogData;
            this.cartGoods = [...cartData];
            this.filteredGoods = [...this.goods];
            this.cartGoods.forEach(element => {
                productCart.push(element);
            });
        }).catch((e) => {
            console.error(e);
        });
    },
});
