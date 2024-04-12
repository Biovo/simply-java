/*  Come in later and add close on nav-link click? 
    Could be potential issues since this checks EVERY click, but no clue how to fix that (COME BACK LATER ONCE I UNDERSTAND JS MORE)
    Add left and right arrow keys to review and increase slide sensitivity on small screens*/

const navContainer = document.querySelectorAll(".links, .socials");
const navToggle = document.querySelector(".nav_toggle");
const reviews = document.querySelector(".reviews");
const wrapper = document.querySelector(".review_wrapper");
const arrowBtns = document.querySelectorAll("#scroll_left, #scroll_right");
const firstCardWidth = reviews.querySelector(".review_card").offsetWidth;
const reviewsChildren = [...reviews.children];

navToggle.addEventListener("click", () => {
    navContainer.forEach(navContainer => {
        const visibility = navContainer.getAttribute("data-visible") === "true";

        if (!visibility) {
            navContainer.setAttribute("data-visible", true);
            navToggle.setAttribute("aria-expanded", true);
        } else {
            navContainer.setAttribute("data-visible", false);
            navToggle.setAttribute("aria-expanded", false);
        }
    });
});

document.addEventListener("click", (event) => {
    const isClickInsideHeader = event.target.closest("#header");

    // Check if the click occurred inside the header or its children
    if (!isClickInsideHeader) {
        // Close the navigation because the click occurred outside the header
        navContainer.forEach(nav => {
            nav.setAttribute("data-visible", false);
        });
        navToggle.setAttribute("aria-expanded", false);
    }
});

let isDragging = false, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in reviews at once
let cardPerView = Math.round(reviews.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to the beginning of reviews for infinite scroll
reviewsChildren.slice(-cardPerView).reverse().forEach(card => {
    reviews.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to the end of reviews for infinite scrolling
reviewsChildren.slice(0, cardPerView).forEach(card => {
    reviews.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Add event listeners for the arrow buttons to scroll left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        reviews.scrollLeft += btn.id === "scroll_left" ? -firstCardWidth : firstCardWidth;
    })
});

const dragStart = (e) => {
    isDragging = true;
    reviews.classList.add("dragging");
    // records initial cursor and scroll position of reviews
    startX = e.pageX;
    startScrollLeft = reviews.scrollLeft;
}

const dragStop = () => {
    isDragging = false;
    reviews.classList.remove("dragging");
}

const dragging = (e) => {
    if (!isDragging) return // returns from here if false
    // updates scroll position based on cursor movement
    reviews.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const autoPlay = () => {
    if (window.innerWidth < 800) return // so it won't autoplay on mobile
    // autoplay after every 2500ms
    timeoutId = setTimeout(() => reviews.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

const infiniteScroll = () => {
    // if reviews is at the beginning, scroll to the end
    if (reviews.scrollLeft === 0) {
        reviews.classList.add("no-transition");
        reviews.scrollLeft = reviews.scrollWidth - (2 * reviews.offsetWidth);
        reviews.classList.remove("no-transition");
        // if reviews is at the end, scroll to the beginning
    } else if (Math.ceil(reviews.scrollLeft) === reviews.scrollWidth - reviews.offsetWidth) {
        reviews.classList.add("no-transition");
        reviews.scrollLeft = reviews.offsetWidth;
        reviews.classList.remove("no-transition");
    }


    // clear existing timeout & start autoplay if not hovering hovering reviews
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

reviews.addEventListener("mousedown", dragStart);
reviews.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
document.addEventListener("mouseup", dragStop);
reviews.addEventListener("mousemove", dragging);
