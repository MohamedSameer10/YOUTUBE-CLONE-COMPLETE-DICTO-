const itemScroll = document.querySelector('.top-scroll-items')
const sideBar = document.querySelector("aside")
const main = document.querySelector("main")
const toggleButton = document.querySelectorAll('.menu i')
const menu = document.querySelector('.menu')
const mic = document.querySelector('.mic')
const userInput = document.querySelector("input")
const searchButton = document.querySelector(".search")
const videoContainer = document.querySelector('.video-content')
const APIKey = "AIzaSyC7HeIzO2DHy7whLoGClzNzDE7U3SKi2Xc"

const itemsForScroll = [
    "All",
    "CSS",
    "User interface desing",
    "Gaming",
    "C++",
    "Music",
    "APIs",
    "Microsolft Windows",
    "Tamil Cinema",
    "Android",
    "AI",
    "Thrillers",
    "Films",
    "SmartPhones",
    "Recently uploaded",
    "Watched",
    "New to you"
]

const items = itemsForScroll.map(element => {
    if (element == "All") {
        return `<p class="active">${element}</p>`
    }
    return `<p>${element}</p>`
})

itemScroll.innerHTML = items.join("")

const scrollItems = document.querySelectorAll('.top-scroll-items p')
scrollItems.forEach(element => {
    element.addEventListener("click",()=>{
        const content = element.textContent
        showContents(content)
    })
})

function showContents(link){
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${link}&key=${APIKey}&maxResults=50`)
        .then(res => res.json())
        .then(data => {
            videoContainer.innerHTML = ""
            data.items.forEach(element => {
                let newUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=50&regionCode=IN&key=${APIKey}` + `&id=${element.id.videoId}`
                initializePage(newUrl)
            })
        })
}


toggleButton.forEach((element) => {
    element.addEventListener('click', () => {
        sideBar.classList.toggle('sidebar')
        main.classList.toggle("side")
    })
})

searchButton.addEventListener("click", search)

userInput.addEventListener("keyup",(event)=>{
    if(event.key == "Enter"){
        search()
    }
})

searchButton.addEventListener("click",()=>{
    menu.classList.add('res-mobile')
    mic.classList.add('res-mobile')
    document.querySelector('.search-option').classList.add('show-res-input')
    document.querySelector('.arrow').classList.add('show-res')
    itemScroll.classList.add('res-mobile')
    document.querySelector('main .video-content').classList.add('mg')
})

document.querySelector('.arrow').addEventListener('click',()=>{
    menu.classList.remove('res-mobile')
    mic.classList.remove('res-mobile')
    document.querySelector('.search-option').classList.remove('show-res-input')
    document.querySelector('.arrow').classList.remove('show-res')
    itemScroll.classList.remove('res-mobile')
})

function search(){
    const query = userInput.value
    showContents(query)
}


let fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=${APIKey}`

async function initializePage(url) {
    const fetchingDetails = await fetch(url)
    const response = await fetchingDetails.json()
    showResults(response)
}

initializePage(fetchURL)

function showResults(data) {
    data.items.forEach(async element => {
        const image = element.snippet.thumbnails.high.url
        const title = element.snippet.title
        const slicedTitle = title.length > 100 ? title.slice(0, 100) + "..." : title
        let viewCount = element.statistics.viewCount

        if (viewCount > 1000 && viewCount < 10000) {
            viewCount = viewCount.slice(0, 2) + "K"
        }
        else if (viewCount > 10000 && viewCount < 1000000) {
            viewCount = viewCount.slice(0, 3) + "K"
        }
        else if (viewCount > 1000000 && viewCount < 10000000) {
            viewCount = viewCount.slice(0, 1) + "M"
        }
        else if (viewCount > 10000000 && viewCount < 1000000000) {
            viewCount = viewCount.slice(0, 2) + "M"
        }
        else {
            viewCount = viewCount
        }
        const video = document.createElement("div")
        video.classList.add('video')
        const fetchingIcon = await fetch(` https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${element.snippet.channelId}&key=${APIKey}`)
        const resIcon = await fetchingIcon.json()
        const view = viewCount + " views ."
        video.innerHTML = `
            <a href=https://www.youtube.com/watch?v=${element.id}>
            <img src=${image} class=${element.id}>
            <div class="text-content">
                <img src=${resIcon.items[0].snippet.thumbnails.high.url}>
                <div class="text">
                    <h2>${slicedTitle}</h2>
                    <span>${element.snippet.channelTitle}</span>
                    <div class="year">
                        <span>${view}</span>
                        <span>Published at ${element.snippet.publishedAt.slice(0, 10)}</span>
                    </div>
                </div>
            </div>    
            
            </a>
        `
        videoContainer.appendChild(video)
    })
}


