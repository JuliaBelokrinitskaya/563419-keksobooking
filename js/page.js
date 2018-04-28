'use strict';

(function () {

  var isPageActive = false;

  /**
   * Функция, переводящая страницу в неактивный режим.
   */
  var deactivatePage = function () {
    mapElement.classList.add('map--faded');
    noticeFormElement.classList.add('ad-form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = true;
    }
    isPageActive = false;
  };

  /**
   * Функция, переводящая страницу в активный режим.
   */
  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    noticeFormElement.classList.remove('ad-form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = false;
    }
    isPageActive = true;
  };

  /**
   * Функция, возвращающая страницу в исходное состояние.
   */
  var resetPage = function () {
    if (activeCard) {
      activeCard.remove();
    }
    deletePins();
    deactivatePage();
    userPin.resetAddress();
    setAddressField();
    setUserPinPosition();
    setMinPrice(typeSelect.value);
    validateCapacity(roomsCountSelect.value);
  };

  resetPage();
})();
