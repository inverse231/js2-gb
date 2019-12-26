const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    itemsFiltered: [],
    searchLine: '',
    visibility: false,
    itemCart: {amount: 0, countItems: 0, products: []}
  },
  computed: {
    listItems() {
      if (!this.searchLine) {
        return this.itemsFiltered;
    }
      return this.filteredGoods;
    },
  },
  methods: {
    filters() {
      this.filteredGoods = [...this.goods];
      this.filteredGoods = this.filteredGoods.filter(good => {
        return good.product_name.toLowerCase().includes(this.searchLine);
      });
    },
    showCart() {
        this.visibility = !this.visibility;
    },
    addProduct (good) {
      let findProduct = this.itemCart.products.find(item => item.id_product === good.id_product);
      if (!findProduct) {
        this.itemCart.products.push(Object.assign ({}, good, {count: 1}));
        good.count = 1;
        this.visibility = true;
      } else {
        findProduct.count++;
      }
    },
    decCount (good) {
      if (good.count === 1) {
        this.itemCart.products.splice(this.itemCart.products.indexOf(good), 1);
        if(this.itemCart.products.length === 0) {
          this.visibility = !this.visibility;
        }
      } else{
        good.count--;
      }
    },
    incCount (good) {
      good.count++;
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
      }
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
