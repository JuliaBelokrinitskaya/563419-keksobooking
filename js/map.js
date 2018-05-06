'use strict';

(function () {
  var YCoordinate = {
    MIN: 150,
    MAX: 500
  };

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
   * @param {Array.<Object>} notices - массив объявлений
   */
  var renderPins = function (notices) {
    var noticesSelection = notices.slice(0, SIMILAR_NOTICES_COUNT);
    pins = window.util.renderElements(noticesSelection, mapPinsElement, mapPinTemplate, window.pin.render);

    noticesSelection.forEach(function (notice, index) {
      pins[index].addEventListener('click', function () {
        openCard(notice);
      });

      pins[index].addEventListener('keydown', function (evt) {
        if (window.util.isEnterEvent(evt)) {
          openCard(notice);
        }
      });
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

  /** Обработчик загрузки данных с сервера.
   * @callback onLoadCallback
   * @param {Array.<Object>} notices - массив объявлений
   */
  var onLoadHandler = function (notices) {
    window.data.setNotices(notices);
    renderPins(notices);
    mapElement.classList.remove('map--faded');
  };

  document.addEventListener('keydown', function (evt) {
    if (window.util.isEscEvent(evt) && evt.target.tagName.toLowerCase() !== 'select') {
      closeActiveCard();
    }
  });

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
      return YCoordinate.MIN;
    },

    /**
     * Метод, возвращающий максимально возможную y-координату метки на карте.
     * @return {number}
     */
    getMaxY: function () {
      return YCoordinate.MAX;
    },

    closeCard: closeActiveCard,

    /**
     * Метод, обновляющий метки на карте.
     * @param {Array.<Object>} notices - массив объявлений
     */
    refreshPins: function (notices) {
      closeActiveCard();
      deletePins();
      renderPins(notices);
    },

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
      window.backend.getData(onLoadHandler, window.util.showError);
      this.isActive = true;
    }
  };

})();
