// ==UserScript==
// @name Colored Item Prices
// @version 0.2
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
//    console.log(minprices);

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

    //Show results on page (attempt to find container, if it's not there we create it)
    var container = $('#setCalculator');
    if (!container.length) {
        container = $('<div>').attr('id', 'setCalculator').addClass('msg right-round');

        var wrapper = $('<div>').addClass('info-msg border-round').html($('<i>').addClass('info-icon'));
        wrapper.append(container);
        wrapper.prependTo($('.main-market-page'));
    }

    // Clear text
    container.empty();

    // Loop over itemsets and create a result message
    var setSum = 0;
	var itemSum = 0;

    $.each(items, function(i, item) {
        $.each(mySets, function(j, mySet) {
            if (mySet[0] === item.itemID) {
				setSum += parseInt(mySet[1]);
				itemSum += parseInt(item.price);
                 if (parseInt(item.price) < parseInt(mySet[1])) {
                     minprices[items.indexOf(item)].style.backgroundColor="#64d464";
                     minprices[items.indexOf(item)].innerText = (parseInt(item.price) - parseInt(mySet[1]))/10;
                 }
                 else {
                     minprices[items.indexOf(item)].style.backgroundColor="#ff5310bf";
                     minprices[items.indexOf(item)].innerText = (parseInt(item.price) - parseInt(mySet[1]))/10;
                 }
             }
        });
    });

	// Show message on page
    if (setSum > 0) {
        // Generate final message
        var message = ("One set costs " + accounting.formatMoney((itemSum/10), "$", 0) + " per point and was bought at " + accounting.formatMoney((setSum/10), "$", 0) + " per point. All price differences below are per point.");
        // Append the message to the container
        container.append($('<span>').html(message));
    } else {
        // No sets were present on this page
        container.append($('<span>').html('No sets available.'));
    }
};

$(document).ajaxComplete(function(e,xhr,settings){
    var marketRegex = /^imarket.php\?rfcv=(.+)$/;
    if (marketRegex.test(settings.url)) {

         // Process the items and their prices
        var items = JSON.parse(xhr.responseText);
        if (items) itemsLoaded(items);
    }
});