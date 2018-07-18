/**
 * modal.js
 * Functionality for displaying the game details
 */

class Modal {
  /**
   * setup modal properties
   */
  init() {
    this.modal = document.querySelector('.modal');
  }

  /**
   * Toggle display of game details
   * @param {Object} gameObj
   */
  toggleDetails(gameObj) {
    if (this.modal.classList.contains('show')) {
      this.closeDetails();
    } else {
      this.openDetails(gameObj);
    }
  }

  /**
   * Display modal of details for selected game
   * @param {Object} gameObj
   */
  openDetails(gameObj) {
    const detailsMarkup = `
      <img src="${gameObj.largeImage}" alt="${gameObj.altText}" class="modal__img">
      <h2 class="modal__headline">${gameObj.headline}</h2>
      <p class="modal__text">${gameObj.description}</p>
    `;

    // Add markup to new list item
    this.modal.querySelector('.modal__content').innerHTML = detailsMarkup;

    // Display Modal
    this.modal.classList.add('show');
  }

  /**
   * Close details modal
   */
  closeDetails() {
    if (this.modal.classList.contains('show')) {
      // Hide modal
      this.modal.classList.remove('show');

      // Empty content from modal
      this.modal.querySelector('.modal__content').innerHTML = '';
    }
  }
}

export default Modal;
