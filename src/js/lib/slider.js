/**
 * slider.js
 * Functionality for loading content and controlling slider
 */

import { fetchData } from './utils.js';
import Modal from './modal.js';
import Game from './game.js';

class Slider {
  /*
   * Setup for slider
   */
  init() {
    const slider = document.querySelector('.slider');
    this.selectedClass = 'selected';
    this.container = slider.querySelector('.slider__container');
    this.modal = new Modal();
    this.offsetSlideIndex = 0;

    // Array of Node elements in slider
    this.slides = [];

    // Array of objects with game data
    this.gamesArray = [];

    this.loadContent();
  }

  /**
   * Fetch data from MLB api
   * and create new list
   */
  loadContent() {
    fetchData((data) => {
      // Deal with response data
      const gamesListObj = JSON.parse(data);
      gamesListObj.dates[0].games.forEach((gameDataObject) => {
        const recap = gameDataObject.content.editorial.recap.mlb;
        if (recap) {
          // TODO: select image by size property to always get specific image
          const game = new Game(
            recap.media.headline,
            recap.media.blurb,
            recap.media.description,
            recap.media.image.cuts[45].src,
            recap.media.image.cuts[2].src,
            recap.media.image.title
          );
          this.gamesArray.push(game);
        }
      });

      // Pass games data to Modal
      this.modal.init();

      this.createSlideList();

      // Add Event listeners after content has been loaded
      // so we dont try and control the slider before its ready
      this.addEventListeners();
    });
  }

  /**
   * Add event listeners for arrow navigation
   */
  addEventListeners() {
    const self = this;
    // Listen for Key Presses
    document.onkeydown = (evt) => {
      switch (evt.keyCode) {
        // Left Arrow is Pressed
        case 37:
          self.leftArrowPressed();
          self.modal.closeDetails();
          break;
        // Right Arrow is Pressed
        case 39:
          self.rightArrowPressed();
          self.modal.closeDetails();
          break;
        // Enter button is Pressed
        case 13:
          self.modal.toggleDetails(
            self.gamesArray[self.getIndexOfSelectedSlide()]
          );
          break;
        default:
          // Do nothing
      }
    };
  }

  /**
   * Action when left arrow is pressed
   * Check if the first item is selected
   * Do not move past the first item
   */
  leftArrowPressed() {
    if (this.getIndexOfSelectedSlide() > 0) {
      this.selectSlide(false);
    }
  }

  /**
   * Action when right arrow is pressed
   * Check if the last item is selected
   * Do not move past the last item
   */
  rightArrowPressed() {
    if (this.getIndexOfSelectedSlide() < this.slides.length - 1) {
      this.selectSlide(true);
    }
  }

  /**
   * Update selection of slider slide based on arrow key interaction
   * @param {Boolean} slideRight
   */
  selectSlide(slideRight) {
    const currentIndex = this.getIndexOfSelectedSlide();
    const newIndex = slideRight ? currentIndex + 1 : currentIndex - 1;
    const slidesPerScreen = Math.floor(window.innerWidth / this.getSlideWidth());

    // Design decision for how to move slider container
    // to make sure the selected slide is always visible on screen
    if (slideRight && (newIndex >= this.offsetSlideIndex + slidesPerScreen)) {
      this.offsetSlideIndex++;
      this.container.style.left = `${-(Math.abs(this.getSlideWidth())*this.offsetSlideIndex)}px`;
    }
    else if (!slideRight && (newIndex < this.offsetSlideIndex)) {
      this.offsetSlideIndex--;
      this.container.style.left = `${-(Math.abs(this.getSlideWidth())*this.offsetSlideIndex)}px`;
    }

    // Remove selected class from slide
    this.slides[currentIndex].classList.remove(this.selectedClass);
    // Add selected class to next/prev item in list
    this.slides[newIndex].classList.add(this.selectedClass);
  }

  /**
   * Return Index of the slide that contains the selected class
   * @param {NodeList} slides
   * @returns index
   */
  getIndexOfSelectedSlide() {
    let selectedIndex;
    // Loop through slides
    this.slides.forEach((slide, index) => {
      // Find item with the class name 'selected'
      if (slide.classList.contains(this.selectedClass)) {
        selectedIndex = index;
      }
    });
    return selectedIndex;
  }

  /**
   * Parse data and create list markup
   * @param {url string} url of newsfeed
   * @param {string} id of target container
   */
  createSlideList() {
    // empty slide list
    this.container.innerHTML = '';

    // Add a list item for each game item
    this.gamesArray.forEach((item) => {
      this.container.appendChild(this.buildSlideListItem(item));
    });

    // Requery the new slides
    this.slides = this.container.querySelectorAll('.slider__slide');

    // set slidewith property based on new content
    this.setSlideWidth();

    // Select the first item
    this.slides[0].classList.add(this.selectedClass);
  }

  /**
   * Return markup for slide item
   * @param {object} gameItem
   * @returns markup
   */
  buildSlideListItem(gameObj) {
    // Create new node item for slide
    const listItem = document.createElement('li');

    // Slide content markup template
    // Would prefer template to be in a separate file
    const markup = `
      <h2 class='slider__title'>${gameObj.headline}</h2>
      <img src='${gameObj.smallImage}' alt='${gameObj.altText}' class='slider__image'>
      <p class='slider__description'>${gameObj.subhead}</p>
    `;

    // Add slide class to new list item
    listItem.className = 'slider__slide';
    // Add markup to new list item
    listItem.innerHTML = markup;

    return listItem;
  }

  /**
   * Get the set value of the width of a single slide
   * so we know how much to much the slider when a slide is changed.
   * @returns slideWith
   */
  getSlideWidth() {
    return this.slideWidth;
  }

  /**
   * Set the width of slides in the slider
   */
  setSlideWidth() {
    this.slideWidth = this.slides[this.slides.length - 1].offsetWidth;
  }
}

export default Slider;
