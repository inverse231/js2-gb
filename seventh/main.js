let productCart = [];

Vue.component('search', {
    data: () => ({ searchLine: '' }),
    template: `<form class="search-form" v-on:submit.prevent="">
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
        ` <div class="goods-item">
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
Vue.component('cart', {
    data: () => {
        return {
            productCart: productCart,
        }
    },
    
    template: `<div class="cart-block">
        <div class="cart" >
          <div class="empty" v-if="productCart.length === 0">Ваша корзина пуста. Скорее приступайте к покупкам!</div>
          <div class="cart-item" v-else v-for="good in productCart" :key="good.product_name">
            <h3 class="good_title">{{ good.product_name }}</h3>
            <p class="good_price">{{ good.price }}</p>
            <button class="goods-dec" @click="decCount(good)">-</button>
            <span class="goods-count">{{ good.count }}</span>
            <button class="goods-inc" @click="incCount(good)">+</button>
          </div>
        </div>
      </div>`,
    methods: {
        decCount(good) {
            if (good.count === 1) {
                productCart.splice(productCart.indexOf(good), 1);
                if (productCart.length === 0) {
                    this.visibility = !this.visibility;
                }
            } else {
                good.count--;
            }
        }
        ,
        incCount(good) {
            good.count++;
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
        visibility: true
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
        makePOSTRequest(url, data) {
            console.log('makePOSTRequest data:');
            console.log(data);
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

                console.log(this.filteredGoods);
            } else {
                return this.filteredGoods = [... this.goods];
            }
        },
        addProduct(good) {
            this.makePOSTRequest('/cart', good);
            productCart.push(good);
            console.log(productCart);
        },
        // removeFromCart(good) {

        // }
    },
    mounted() {
        Promise.all([
            this.makeGETRequest(`/catalog`),
            this.makeGETRequest(`/cart`),
        ]).then(([catalogData, cartData]) => {
            this.goods = catalogData;
            this.cartGoods = [... cartData];
            this.filteredGoods = [...this.goods];
            this.cartGoods.forEach(element => {
                productCart.push(element);
            });
            // console.log("@", productCart);
        }).catch((e) => {
            console.error(e);
        });
    },
});
