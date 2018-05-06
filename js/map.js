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
  var SIMILAR_NOTICES_COUNT = 5;

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersElement = mapElement.querySelector('.map__filters-container');

  var activeCard = null;
  var noticesData = [];
  var pins = [];

  /**
   * Функция, открывающая карточку объявления.
   * @param {Object} notice - объект, описывающий объявление
   */
  var openCard = function (notice) {
    closeActiveCard();
    activeCard = window.card.render(notice, mapElement, mapFiltersElement, mapCardTemplate);

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

  /**
   * Функция, отрисовывающая на карте метки похожих объявлений.
   * @callback onLoadCallback
   * @param {Array.<Object>} notices - массив объявлений
   */
  var renderPins = function (notices) {
    noticesData = notices.slice(0, SIMILAR_NOTICES_COUNT);
    pins = window.util.renderElements(noticesData, mapPinsElement, mapPinTemplate, window.pin.render);

    for (var i = 0; i < pins.length; i++) {
      addPinEventListeners(pins[i], i);
    }
  };

  /**
   * Функция, добавляющая обработчики событий для метки.
   * @param {Object} pin - метка похожего объявления
   * @param {number} i - позиция объявления в массиве noticesData
   */
  var addPinEventListeners = function (pin, i) {
    pin.addEventListener('click', function () {
      openCard(noticesData[i]);
    });

    pin.addEventListener('keydown', function (evt) {
      if (window.util.isEnterEvent(evt)) {
        openCard(noticesData[i]);
      }
    });
  };

  /**
   * Функция, удаляющая с карты метки похожих объявлений.
   */
  var deletePins = function () {
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  window.map = {
    isActive: false,

    /**
     * Метод, возвращающий DOM-элемент карты.
     * @return {Object}
     */
    getElement: function () {
      return mapElement;
    },

    /**
     * Метод, возвращающий минимально возможную y-координату метки на карте.
     * @return {number}
     */
    getMinY: function () {
      return MIN_Y_LOCATION;
    },

    /**
     * Метод, возвращающий максимально возможную y-координату метки на карте.
     * @return {number}
     */
    getMaxY: function () {
      return MAX_Y_LOCATION;
    },

    closeCard: closeActiveCard,

    /**
     * Метод, возвращающий карту в исходное состояние.
     */
    reset: function () {
      closeActiveCard();
      deletePins();
      mapElement.classList.add('map--faded');
      this.isActive = false;
    },

    /**
     * Метод, переводящий карту в активный режим.
     */
    enable: function () {
      mapElement.classList.remove('map--faded');
      window.backend.getData(renderPins, window.util.showError);
      this.isActive = true;
    }
  };

})();
