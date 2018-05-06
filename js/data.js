'use strict';

(function () {
  /**
   * Количество комнат, при котором жилье предназначено не для гостей
   * @const
   * @type {number}
   */
  var NO_GUESTS_ROOMS_COUNT = 100;

  var PROPERTY_TYPES = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var PROPERTY_MIN_PRICES = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var noticesData = [];

  window.data = {
    /**
     * Метод, возвращающий русское название типа жилья.
     * @param {string} propertyType - тип жилья по-английски
     * @return {string}
     */
    getPropertyType: function (propertyType) {
      return PROPERTY_TYPES[propertyType];
    },

    /**
     * Метод, возвращающий минимальную стоимость данного типа жилья.
     * @param {string} propertyType - тип жилья по-английски
     * @return {string}
     */
    getPropertyMinPrice: function (propertyType) {
      return PROPERTY_MIN_PRICES[propertyType];
    },

    /**
     * Метод, возвращающий количество комнат, при котором жилье предназначено не для гостей
     * @return {number}
     */
    getNoGuestsRoomsCount: function () {
      return NO_GUESTS_ROOMS_COUNT;
    },

    /**
     * Метод, возвращающий копию списка похожих объявлений.
     * @return {Array.<Object>}
     */
    getNotices: function () {
      return noticesData.slice();
    },

    /**
     * Метод, сохраняющий список похожих объявлений.
     * @param {Array.<Object>} notices - массив объявлений
     */
    setNotices: function (notices) {
      noticesData = notices;
    }
  };
})();
