const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data: () => {
        return {
            itemCart: {amount: 0, countItems: 0, products: []}
        }
    }
    ,
    template: `<div class="cart-block">
        <div class="cart" >
          <div class="empty" v-if="itemCart.products.length === 0">Ваша корзина пуста. Скорее приступайте к покупкам!</div>
          <div class="cart-item" v-else v-for="good in itemCart.products">
            <h3 class="good_title">{{ good.product_name }}</h3>
            <p class="good_price">{{ good.price }}</p>
            <button class="goods-dec" @click="decCount(good)">-</button>
            <span class="goods-count">{{ good.count }}</span>
            <button class="goods-inc" @click="incCount(good)">+</button>
          </div>
        </div>
      </div>`,
    methods: {
        addProduct(good) {
            let findProduct = this.itemCart.products.find(item => item.id_product === good.id_product);
            if (!findProduct) {
                this.itemCart.products.push(Object.assign({}, good, {count: 1}));
                good.count = 1;
                this.$emit('show-cart');
            } else {
                findProduct.count++;
            }
        }
        ,
        decCount(good) {
            if (good.count === 1) {
                this.itemCart.products.splice(this.itemCart.products.indexOf(good), 1);
                if (this.itemCart.products.length === 0) {
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

Vue.component('search', {
    data: () => ({searchLine: ''}),
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
      <button class="goods-button" @click="$root.$refs.cart.addProduct(good)">Купить</button>
  </div>`
    ,
});
Vue.component('goods-list', {
    props: ['goods'],
    data: () => {
        return {filteredItems: ''}
    },
    computed: {
        isGoodsEmpty() {
            return this.goods.length === 0;
        }
    },
    template:
`<div class="goods-list" v-if="!isGoodsEmpty">
      <goods-item v-for="good in goods" :good="good" :key="good.id_product"></goods-item>
    </div>
    <div class="not-found-items" v-else>
      <h2>Нет данных</h2>
    </div>`
    ,
});

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
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
    },
    async mounted() {
        try {
            this.goods = await this.makeGETRequest(`${API_URL}/catalogData.json`);
            this.filteredGoods = [...this.goods];
        } catch (e) {
            console.error(e);
        }
    },
});
