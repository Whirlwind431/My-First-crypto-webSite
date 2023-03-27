// Global variables
const ctx = document.getElementById('mainChart');
const mainChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const coinsContainer = document.getElementById('coinsContainerId');
const searchInput = document.getElementById('searchInputId');
const homePage = document.getElementById('homePageId');
let cryptoArray = [];
const inputMsg = document.getElementById("searchInputId")
let newCryptoArray = [];
let reportsArray = [];


//  Check if we do have already a localstorage data
function isDataLocalStorage() {
    const data = localStorage.getItem('crypto');
    if (data) {
        newCryptoArray = JSON.parse(data);
    } else {
        newCryptoArray = [];
        getCryptoData();
    }
}

// when click on home page (Logo)
// function createHomePage() {
//     homePage.style.display = 'none'
//     createMainCoinCards();
// }

// when click on coins page 
function createCoinsPage() {
    homePage.style.display = 'none'
    coinsContainer.style.display = 'flex';

    createCoinCards();
}

// Main function to start the website needed functions
function websiteInit() {
    isDataLocalStorage();
    createCoinsPage()
    homePage.style.display = 'none'
    findReports()
    // console.log(`Your reports array is ${reportsArray} `)
}

function showChart() {
    findReports()
    homePage.style.display = 'flex';
    coinsContainer.style.display = 'none';
}

// connect to the canvas in our HTML and add a chart from chartJS.
function createMainChart() {
    websiteInit()
    findReports()
    showChart()
    const myDataAll = localStorage.getItem('arrayReportWithAllInfo');
    const dataAll = JSON.parse(myDataAll)
    const dataSet = dataAll.map(x => ({
        label: x.id,
        data: [x.current_price, x.current_price, x.current_price, x.current_price],
        borderWidth: 1

    }))

    mainChart.data.labels = [1, 2, 3, 'Today']
    mainChart.data.datasets = dataSet;


    mainChart.update();

    // // console.log(dataSet)
    // new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: [1, 2, 3, 'Today'],
    //         datasets: dataSet
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true
    //             }
    //         }
    //     }
    // });


}



// Adding new data to our local storage as 'crypto' key
function addToLocalStorage(data) {
    cryptoArray.push(data);
    newCryptoArray = cryptoArray
    const strData = JSON.stringify(newCryptoArray)
    localStorage.setItem('crypto', strData);
}

// fetch the data from crypto api
async function getCryptoData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=2');
    const data = await response.json();
    addToLocalStorage(data);

}


// show only 100 coins for the main page
function createMainCoinCards() {

    let html = '';
    for (const item of newCryptoArray[0]) {
        html += `<div class='coinCardBox ' id="${item.id}DIV"> <br> <img class="imgCard" onclick"createMainCoinCards()" src="${item.image}" ></h2>`;
        html += `<p <h2 class="coinCardBoxHeader">${item.name}</h2></p>`;
        html += `<p class='coinCardSymbol'>${item.symbol}</p>`;
        html += `<p class='coinCardPrice'>USD: $${(item.current_price * 1).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p>`;
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="addToReportsByClick('${item.id}')" class="moreInfoButton">Add</button></p>`
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="removeElementFromReportsByClick('${item.id}')" class="moreInfoButton">remove</button></p>`
        html += `<div class="dropdown"  id="${item.id}infoDiv"><button id="${item.symbol}infoBtn" onclick="moreInfo('${item.id}')" class="moreInfoButton">more</button>`
        html += `<div class="dropdown-content"><p class='coinCardPrice '>Highest 24h:</br>$${(item.high_24h * 1).toFixed(2)}</br>₪${(item.high_24h * 3.51).toFixed(2)}</br>€${(item.high_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Low 24h:</br>${(item.low_24h * 1).toFixed(2)}</br>₪${(item.low_24h * 3.51).toFixed(2)}</br>€${(item.low_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Last update:</br>${item.last_updated}</p>  `
        html += `<p class='coinCardPrice '>Total supply:</br>${item.total_supply}</p>  `
        html += `<p class='coinCardPrice '>Total volume:</br>${item.total_volume}</p> </div></div></div>`

    }
    $('#coinsContainerId').html(html)

}


// remove element from array by click
function removeElementFromReportsByClick(id) {
    removeElementFromReports(id)
    findReports();

}

function removeElementFromReports(data) {
    const myData = localStorage.getItem('Reports');
    // console.log(':' + myData)
    if (myData !== null && myData.length !== 0) {
        reportsArray = JSON.parse(myData);
    } if (reportsArray.includes(data) && (reportsArray.length) !== 0) {
        const id = reportsArray.indexOf(data)
        // console.log('id:' + id + ' of ' + data)
        const removedElement = reportsArray.splice(id, 1)

        const strData = JSON.stringify(reportsArray);
        localStorage.setItem('Reports', strData);
        // console.log("Reports Array: " + reportsArray);
    } if (reportsArray.length === 0) {
        alert("You don't have any crypto!Please add them!")
    }

}
// show reports in popup
function showReports() {
    findReports()
    printReports()
}




// function to get all of information about crypto after inizialization of reports array and get info from main crypto array 
let arrayReportWithAllInfo = []

function findReports() {
    const myData = localStorage.getItem('Reports');
    const data = JSON.parse(myData)
    // console.log(data)
    for (const item of newCryptoArray[0]) {
        if (data.includes(item.id) && newCryptoArray.item !== null) {
            arrayReportWithAllInfo.push(item)
        }

    }
    // console.log(arrayReportWithAllInfo)
    const strData = JSON.stringify(arrayReportWithAllInfo)
    localStorage.setItem('arrayReportWithAllInfo', strData)
    printReports()
    arrayReportWithAllInfo = []
}

function printReports() {
    let html = ''
    let popupText_id = document.getElementById('popupText_id')
    if (arrayReportWithAllInfo.length === 0) {
        html += `<p <h4 class="coinCardBoxHeaderReport">You don't have any crypto!Please add them!</h4></p></div>`
        popupText_id.innerHTML = html;
    } else {
        for (const item of arrayReportWithAllInfo) {
            html += `<div class='coinCardBoxReport ' id="${item.id}DIV"> <br> <img class="imgCardReport"  src="${item.image}" ></h2>`;
            html += `<p <h4 class="coinCardBoxHeaderReport">${item.name}</h4></p>`;
            html += `<p class='coinCardPriceReport'>USD: $${(item.current_price * 1).toFixed(2)}</p>`;
            html += `<p class='coinCardPriceReport'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`;
            html += `<p class='coinCardPriceReport'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p></div>`
        }
        $('#popupText_id').html(html)

    }



}




// function more info - in working...
function moreInfo(id) {
    // console.log(id)
}

// function to create reports array and to put this into the lockal storage
function addToReportsByClick(id) {
    isDataLocalStorageReports(id)
    findReports();

}
function isDataLocalStorageReports(data) {
    const myData = localStorage.getItem('Reports');
    // console.log(':' + myData)
    if (myData !== null) {
        reportsArray = JSON.parse(myData);

    } if (!reportsArray.includes(data) && (reportsArray.length) < 5) {
        reportsArray.push(data);
        const strData = JSON.stringify(reportsArray);
        localStorage.setItem('Reports', strData);
        // console.log("Reports Array: " + reportsArray);

    }
}


// show only all coins for the coins page
function createCoinCards() {
    let html = '';
    for (const item of newCryptoArray[0]) {
        html += `<div class='coinCardBox ' id="${item.id}DIV"> <br> <img class="imgCard" onclick"createMainCoinCards()" src="${item.image}" ></h2>`;
        html += `<p <h2 class="coinCardBoxHeader">${item.name}</h2></p>`;
        html += `<p class='coinCardSymbol'>${item.symbol}</p>`;
        html += `<p class='coinCardPrice'>USD: $${(item.current_price * 1).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p>`;
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="addToReportsByClick('${item.id}')" class="moreInfoButton">Add</button></p>`
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="removeElementFromReportsByClick('${item.id}')" class="moreInfoButton">remove</button></p>`
        html += `<div class="dropdown"  id="${item.id}infoDiv"><button id="${item.symbol}infoBtn" onclick="moreInfo('${item.id}')" class="moreInfoButton">more</button>`
        html += `<div class="dropdown-content"><p class='coinCardPrice '>Highest 24h:</br>$${(item.high_24h * 1).toFixed(2)}</br>₪${(item.high_24h * 3.51).toFixed(2)}</br>€${(item.high_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Low 24h:</br>${(item.low_24h * 1).toFixed(2)}</br>₪${(item.low_24h * 3.51).toFixed(2)}</br>€${(item.low_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Last update:</br>${item.last_updated}</p>  `
        html += `<p class='coinCardPrice '>Total supply:</br>${item.total_supply}</p>  `
        html += `<p class='coinCardPrice '>Total volume:</br>${item.total_volume}</p> </div></div></div>`

    }
    $('#coinsContainerId').html(html)

}

// Show coins by search (on  key down)
function createCoinCardBySearch() {
    const newArray = newCryptoArray[0].filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    let html = '';
    for (const item of newArray) {
        html += `<div class='coinCardBox ' id="${item.id}DIV"> <br> <img class="imgCard" onclick"createMainCoinCards()" src="${item.image}" ></h2>`;
        html += `<p <h2 class="coinCardBoxHeader">${item.name}</h2></p>`;
        html += `<p class='coinCardSymbol'>${item.symbol}</p>`;

        html += `<p class='coinCardPrice'>USD: $${item.current_price.toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p>`;
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="addToReportsByClick('${item.id}')" class="moreInfoButton">Add</button></p>`
        html += `<p class="dropdown"  id="${item.id}reportDiv"><button id="${item.symbol}reportBtn" onclick="removeElementFromReportsByClick('${item.id}')" class="moreInfoButton">remove</button></p>`
        html += `<div class="dropdown"  id="${item.id}infoDiv"><button id="${item.symbol}infoBtn" onclick="moreInfo('${item.id}')" class="moreInfoButton">more</button>`
        html += `<div class="dropdown-content"><p class='coinCardPrice '>Highest 24h:</br>$${(item.high_24h * 1).toFixed(2)}</br>₪${(item.high_24h * 3.51).toFixed(2)}</br>€${(item.high_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Low 24h:</br>${(item.low_24h * 1).toFixed(2)}</br>₪${(item.low_24h * 3.51).toFixed(2)}</br>€${(item.low_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Last update:</br>${item.last_updated}</p>  `
        html += `<p class='coinCardPrice '>Total supply:</br>${item.total_supply}</p>  `
        html += `<p class='coinCardPrice '>Total volume:</br>${item.total_volume}</p> </div></div></div>`

    }
    $('#coinsContainerId').html(html)

}

// Show only one coin by search (on  click button)
function createCoinCardBySearchClick() {



    if (searchInput.value) {
        const newArray = newCryptoArray[0].filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase()))
        let html = '';

        html += `<div class='coinCardBox ' id="${newArray[0].id}DIV"> <br> <img class="imgCard" onclick"createMainCoinCards()" src="${newArray[0].image}" ></h2>`;
        html += `<p <h2 class="coinCardBoxHeader">${newArray[0].name}</h2></p>`;
        html += `<p class='coinCardSymbol'>${newArray[0].symbol}</p>`;

        html += `<p class='coinCardPrice'>USD: $${newArray[0].current_price.toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>ILS: ₪${(newArray[0].current_price * 3.51).toFixed(2)}</p>`;
        html += `<p class='coinCardPrice'>Euro: €${(newArray[0].current_price * 0.93).toFixed(2)}</p>`;
        html += `<p class="dropdown"  id="${newArray[0].id}reportDiv"><button id="${newArray[0].symbol}reportBtn" onclick="addToReportsByClick('${newArray[0].id}')" class="moreInfoButton">Add</button></p>`
        html += `<p class="dropdown"  id="${newArray[0].id}reportDiv"><button id="${newArray[0].symbol}reportBtn" onclick="removeElementFromReportsByClick('${newArray[0].id}')" class="moreInfoButton">remove</button></p>`
        html += `<div class="dropdown"  id="${newArray[0].id}infoDiv"><button id="${newArray[0].symbol}infoBtn" onclick="moreInfo('${newArray[0].id}')" class="moreInfoButton">more</button>`
        html += `<div class="dropdown-content"><p class='coinCardPrice '>Highest 24h:</br>$${(newArray[0].high_24h * 1).toFixed(2)}</br>₪${(newArray[0].high_24h * 3.51).toFixed(2)}</br>€${(newArray[0].high_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Low 24h:</br>$${(newArray[0].low_24h * 1).toFixed(2)}</br>₪${(newArray[0].low_24h * 3.51).toFixed(2)}</br>€${(newArray[0].low_24h * 0.93).toFixed(2)}</p>`
        html += `<p class='coinCardPrice '>Last update:</br>${newArray[0].last_updated}</p>  `
        html += `<p class='coinCardPrice '>Total supply:</br>${newArray[0].total_supply}</p>  `
        html += `<p class='coinCardPrice '>Total volume:</br>${newArray[0].total_volume}</p> </div></div></div>`
        coinsContainer.innerHTML = html;
        searchInput.value = ''

    } else {
        createMainCoinCards()

    }

}

function clearMsg() {
    inputMsg.innerHTML = ""
}



// initiate websiteInit function
websiteInit();




function showAbout() {
    let html = '';
    html += `<h2 class="aboutContainer">What is the crypto?</h2>`
    html += '<img src="./Assets/img/939776.jpg" class="img-fluid" alt="...">'
    html += `<br><br><br>`
    html += `<h4>Cryptocurrency, sometimes called crypto-currency or crypto, is any form of currency that exists digitally or virtually and uses cryptography to secure transactions. Cryptocurrencies don't have a central issuing or regulating authority, instead using a decentralized system to record transactions and issue new units</h4>`
    html += `<h4><a href="https://www.kaspersky.com/resource-center/definitions/what-is-cryptocurrency">For more info!</a>
    </h4>`

    $('#coinsContainerId').html(html)

}