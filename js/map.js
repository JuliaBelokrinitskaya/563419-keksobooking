'use strict';

(function () {
  /**
   * Наименьшая y-координата метки
   * @const
   * @type {number}
   */
  var MIN_Y_LOCATION = 150;

  /**
   * Наибольшая y-координата метки
   * @const
   * @type {number}
   */
  var MAX_Y_LOCATION = 500;

  /**
   * Количество похожих объявлений
   * @const
   * @type {number}
   */
  var SIMILAR_NOTICES_COUNT = 8;

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapFiltersElement = mapElement.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var activeCard = null;
  var pins = [];

  /**
   * Функция, открывающая карточку объявления.
   * @param {Object} notice - объект, описывающий объявление
   */
  var openCard = function (notice) {
    closeActiveCard();
    activeCard = window.renderCard(notice, mapElement, mapFiltersElement, mapCardTemplate);

    var closeButton = activeCard.querySelector('.popup__close');

    closeButton.addEventListener('click', function () {
      closeActiveCard();
    });

    closeButton.addEventListener('keydown', function (evt) {
      if (window.util.isEnterEvent(evt)) {
        closeActiveCard();
      }
    });
  };

  /**
   * Функция, закрывающая текущую карточку объявления.
   */
  var closeActiveCard = function () {
    if (activeCard) {
      activeCard.remove();
    }
  };

  window.map = {
    /**
     * Метод, возвращающий DOM-элемент карты.
     * @return {Object}
     */
    getElement: function () {
      return mapElement;
    },

    /**
     * Метод, отрисовывающий на карте метки похожих объявлений.
     */
    renderPins: function () {
      var noticesData = window.getNotices(SIMILAR_NOTICES_COUNT);
      pins = window.util.renderElements(noticesData, mapPinsElement, mapPinTemplate, window.renderPin);
      for (var i = 0; i < pins.length; i++) {
        var notice = noticesData[i];

        pins[i].addEventListener('click', function () {
          openCard(notice);
        });

        pins[i].addEventListener('keydown', function (evt) {
          if (window.util.isEnterEvent(evt)) {
            openCard(notice);
          }
        });
      }
    },

    /**
     * Метод, удаляющий с карты метки похожих объявлений.
     */
    deletePins: function () {
      for (var i = 0; i < pins.length; i++) {
        pins[i].remove();
      }
    }
  };
})();
