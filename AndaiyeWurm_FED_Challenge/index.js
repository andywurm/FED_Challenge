fetchProducts()

async function fetchProducts() {

    const query = `
                query {
                    products (limit: 50) {
                        products { 
                            name
                            price
                            listPrice
                            brand
                            imageUrl 
                            alternateImageUrls 
                            url
                            scores { 
                                week {
                                    views 
                                    buys
                                } 
                            }
                        } 
                    }
                }`

    const body = JSON.stringify({ query })

    const request = fetch("https://api.nosto.com/v1/graphql", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(":" + "F7k5O1PHyzjwbjQF8Z6UvvZGuu90l3M5WR8Lp8gNoP8nwEQ6zpavKNVUajlZrX6x")
        },
        body: body
    })

    return request.then(res => res.json()).then(data => data.data.products.products).then(p => createProducts(p))

}

function createProducts(product) {

    //Best Seller
    let highestValue = product.reduce((acc, current) => {
        return current.scores.week.buys > acc.scores.week.buys ? current : acc
    })

    document.getElementById("mostBoughtImg").src = highestValue.imageUrl
    document.getElementById("mostBought").onclick = () => {
        window.open(highestValue.url);
    }

    //Most Views
    let highestViewed = product.reduce((acc, current) => {
        return current.scores.week.views > acc.scores.week.views ? current : acc
    })

    document.getElementById("viewedImg").src = highestViewed.imageUrl
    document.getElementById("viewedImg").onclick = () => {
        window.open(highestViewed.url);
    }
    document.getElementById("viewedCompanyName").innerHTML = highestViewed.brand
    document.getElementById("viewedItemName").innerHTML = highestViewed.name
    document.getElementById("viewedItemPrice").innerHTML = "&euro;" + highestViewed.price

    //Builing Carousel
    let sendToCarousel = document.getElementById("allSlides")

    product.map(item => {

        let aSlide = document.createElement("div")
        let slideHtml = "";

        slideHtml += `<div id='slides'>`
        
        slideHtml += `<div class='wrapper'>`
        slideHtml += `<img class="slideImgs" src="${item.imageUrl}"/>`
        slideHtml += item.alternateImageUrls.length > 0 ? aSlide.innerHTML += `<img class="hide" src="${item.alternateImageUrls[0]}"/>` : `<img class="hide" src="${item.imageUrl}"/>`
        slideHtml += `</div>`

        slideHtml += `<div class="allCompanyName">${item.brand}</div>`
        slideHtml += `<div class="allItemName">${item.name}</div>`

        let price = "" + item.price
        slideHtml += `<div class="allItemPrice"> &euro; ${price.charAt(3) === '0' && price.charAt(4) === '0' ? price.substring(0, 2) : item.price}</div>`

        slideHtml += "</div>"

        aSlide.innerHTML = slideHtml

        aSlide.onclick = () => { window.open(item.url) }
        sendToCarousel.appendChild(aSlide)

    })

    //Waits for HTML to load before slick starts
    function letsWait() {
        $('.theSlides').slick({
            arrows: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            draggable: false,
            rows: 0,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 3,
                        arrows: false,
                        draggable: true,
                    },
                },
            ]
        });
    }
    window.setTimeout(letsWait, 1000)

}
