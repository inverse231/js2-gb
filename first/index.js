const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 150 },
    { title: 'Jacket', price: 150 },
    { title: 'Shoes', price: 150 },
];

const renderGoodsItem = (title="item", price="150", img="img/item.png") => {
    return `<div class="goods-item">
                <img src="${img}" width="100">
                <h3>${title}</h3>
                <p>${price}</p>
                <button class="buy-button">Добавить</button>
            </div>`
};

const renderGoodsList = (list) => {
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
    for (let i=0;i<list.length;i++){
        document.querySelector('.goods-list').innerHTML += goodsList[i];
    }
};

renderGoodsList(goods);

console.log(renderGoodsItem());
