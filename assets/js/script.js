const navButton = document.querySelector('.nav-btn');
const nav = document.querySelector('.nav');
const resultsAmount = document.querySelector('.results-amount');
const resultsList = document.querySelector('.results-list');
const resultsOrder = document.querySelector('[name="order"]');

navButton.addEventListener('click', () => {
    switch (nav.style.display) {
        case 'none':
            nav.style.display = 'block';
            navButton.style.backgroundColor = 'var(--gray)'
            break;
        default:
            nav.style.display = 'none';
            navButton.style.backgroundColor = null
            break;
    }
})

resultsOrder.addEventListener('change', (e) => {
    init();
})

let swiper = new Swiper('.swiper-container', {
    effect: 'fade',
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    }
});

init();

function init() {
    loadJSON(function (response) {
        var results = JSON.parse(response);
        switch (resultsOrder.value) {
            case 'decrease':
                results = results.sort((a, b) => b.price - a.price)
                break;
            default:
                results = results.sort((a, b) => a.price - b.price)
                break;
        }
        resultsList.innerHTML = '';
        results.forEach(vehicle => {
            resultsAmount.innerHTML = `<b>${results.length}</b> résulats`;
            let item = document.createElement('div');
            let images = '';
            item.classList.add('item');
            vehicle.images.forEach(image => {
                images += `<div class="swiper-slide" style="background-image:url(${image})"></div>`
            })
            item.innerHTML = `
                    <div class="item-swiper-container">
                        <div class="swiper-wrapper">
                            ${images}
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                    <div class="item-desc">
                        <h1 class="item-desc-title">${vehicle.name}</h1>
                        <p class="item-desc-text">${vehicle.description},<br>
                            <b>${vehicle.price}€</b> - Agence de ${vehicle.agency.charAt(0).toUpperCase() + vehicle.agency.slice(1)}
                        </p>
                        <a class="btn btn-success" href="#">Réserver et Payer</a>
                    </div>
            `;
            resultsList.appendChild(item);
            initSwiper();
        });
    });
}

function initSwiper() {
    let itemSwiper = new Swiper('.item-swiper-container', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './vehicles.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}