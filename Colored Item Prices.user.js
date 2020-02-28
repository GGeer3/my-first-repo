// ==UserScript==
// @name Colored Item Prices
// @version 0.1
// @description Calculates price differences of plushie and flower sets based on code input and outputs the differences and changes the color
// @author Tazman777
// @namespace Tazman777.Torn
// @require http://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js
// @match http://www.torn.com/imarket.php*
// @match https://www.torn.com/imarket.php*
// ==/UserScript==

// List item sets
const mySets = ([
//Plushie ID  , Price
        ['186', '400'],//     Sheep
        ['215', '450'],//     Kitten
        ['187', '500'],//     Teddy Bear
        ['261', '9250'],//    Wolverine
        ['618', '9900'],//    Stingray
        ['258', '16900'],//   Jaguar
        ['266', '41900'],//   Nessie
        ['268', '44500'],//   Red Fox
        ['269', '46000'],//   Monkey
        ['273', '49000'],//   Chamois
        ['274', '66999'],//   Panda
        ['281', '70000'],//   Lion
        ['384', '90750'], //  Camel
//Flower ID   , Price
        ['260', '2100'],//    Dhalia
        ['263', '9200'],//   Crocus
        ['617', '10000'],//    Banana Orchid
        ['264', '20000'],//   Orchid
        ['272', '38500'],//   Edelweiss
        ['271', '41000'],//   Cebio Flower
        ['267', '49150'],//   Heather
        ['277', '63500'],//   Cherry Blossom
        ['282', '67000'],//   African Violet
        ['385', '73900'],//   Tribulus
        ['276', '71500']//    Peony
]);


function itemsLoaded(items) {

    var minprices = document.querySelectorAll('.minprice');
    var searchnames = document.querySelectorAll('.searchname');
    console.log(minprices);
    for(var searchname of searchnames){
        searchname.style.display = 'none';
    }

    for(var minprice of minprices){
        minprice.style.display = 'inline-block';
        minprice.style.backgroundColor="";
        var children = minprice.childNodes;
        for(var child of children){
            if(child.nodeType == 1){
                child.style.display = 'none';
            }
        }
    }

    $.each(mySets, function(i, mySet) {
        var sum = 0;
//       console.log(items);

        $.each(items, function(j, item) {
            for (let i of mySets) {
                if (i[0] === item.itemID) {
                    if (parseInt(item.price) < parseInt(i[1])) {
                        minprices[items.indexOf(item)].style.backgroundColor="#64d464";
                        minprices[items.indexOf(item)].innerText = parseInt(item.price) - parseInt(i[1]);
                    }
                    else {
                        minprices[items.indexOf(item)].style.backgroundColor="#ff5310bf";
                        minprices[items.indexOf(item)].innerText = parseInt(item.price) - parseInt(i[1]);
                    }
                }
            }
        });
    });
};

$(document).ajaxComplete(function(e,xhr,settings){
    var marketRegex = /^imarket.php\?rfcv=(.+)$/;
    if (marketRegex.test(settings.url)) {

         // Process the items and their prices
        var items = JSON.parse(xhr.responseText);
        if (items) itemsLoaded(items);
    }
});