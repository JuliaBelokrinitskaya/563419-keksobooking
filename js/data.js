'use strict';

(function () {
  /**
   * Наименьшая y-координата метки (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MIN_Y_LOCATION = 150;

  /**
   * Наибольшая y-координата метки (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MAX_Y_LOCATION = 500;

  /**
   * Наименьшая x-координата метки (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MIN_X_LOCATION = 300;

  /**
   * Наибольшая x-координата метки (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MAX_X_LOCATION = 900;

  /**
   * Наименьшая цена (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MIN_PRICE = 1000;

  /**
   * Наибольшая цена
   * @const
   * @type {number}
   */
  var MAX_PRICE = 1000000;

  /**
   * Наибольшее количество комнат (для похожих объявлений)
   * @const
   * @type {number}
   */
  var MAX_ROOMS_COUNT = 5;

  /**
   * Количество комнат, при котором жилье предназначено не для гостей
   * @const
   * @type {number}
   */
  var NO_GUESTS_ROOMS_COUNT = 100;

  var NOTICE_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

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

  var HOURS = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var PROPERTY_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var PROPERTY_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  /**
   * Функция, генерирующая объявление случайным образом.
   * @param {number} userNumber - номер пользователя (однозначное число)
   * @param {string} noticeTitle - заголовок объявления
   * @return {Object} - JS объект, описывающий объявление
   */
  var generateNotice = function (userNumber, noticeTitle) {
    var locationX = window.util.getRandomNumber(MIN_X_LOCATION, MAX_X_LOCATION);
    var locationY = window.util.getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION);
    var featuresList = [];

    for (var k = 0; k < PROPERTY_FEATURES.length; k++) {
      if (window.util.getRandomNumber(0, 1)) {
        featuresList.push(PROPERTY_FEATURES[k]);
      }
    }

    return {
      author: {
        avatar: 'img/avatars/user0' + userNumber + '.png'
      },
      offer: {
        title: noticeTitle,
        address: locationX + ', ' + locationY,
        price: window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: window.util.getRandomItem(Object.keys(PROPERTY_TYPES)),
        rooms: window.util.getRandomNumber(1, MAX_ROOMS_COUNT),
        guests: window.util.getRandomNumber(1, MAX_ROOMS_COUNT),
        checkin: window.util.getRandomItem(HOURS),
        checkout: window.util.getRandomItem(HOURS),
        features: featuresList,
        description: '',
        photos: window.util.shuffle(PROPERTY_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  };

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
     * Метод, генерирующий массив похожих объявлений.
     * @param {number} length - длина массива
     * @return {Array.<Object>}
     */
    getNotices: function (length) {
      var titles = window.util.shuffle(NOTICE_TITLES);
      var notices = [];

      for (var i = 0; i < length; i++) {
        notices[i] = generateNotice(i + 1, titles[i]);
      }

      return window.util.shuffle(notices);
    }
  };
})();
