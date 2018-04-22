'use strict';

/**
 * Наименьшая x-координата метки
 * @const
 * @type {number}
 */
var MIN_X_LOCATION = 300;

/**
 * Наибольшая x-координата метки
 * @const
 * @type {number}
 */
var MAX_X_LOCATION = 900;

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
 * Наименьшая цена
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
 * Наибольшее количество комнат
 * @const
 * @type {number}
 */
var MAX_ROOMS_COUNT = 5;

/**
 * Ширина метки
 * @const
 * @type {number}
 */
var PIN_WIDTH = 50;

/**
 * Высота метки
 * @const
 * @type {number}
 */
var PIN_HEIGHT = 70;

/**
 * Высота выступающей части метки пользователя
 * @const
 * @type {number}
 */
var USER_PIN_POINT_SHIFT = 16;

/**
 * Количество похожих объявлений
 * @const
 * @type {number}
 */
var SIMILAR_NOTICES_COUNT = 8;

/**
 * Код клавиши Enter
 * @const
 * @type {number}
 */
var ENTER_KEYCODE = 13;

var HOURS = [
  '12:00',
  '13:00',
  '14:00'
];

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

var mapElement = document.querySelector('.map');
var userPinElement = mapElement.querySelector('.map__pin--main');
var mapPinsElement = mapElement.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapFiltersElement = mapElement.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var activeCard = null;
var noticeFormElement = document.querySelector('.ad-form');
var noticeFormFieldsets = noticeFormElement.querySelectorAll('fieldset');
var addressInput = noticeFormElement.querySelector('#address');

/**
 * Функция, выполняющая перестановку элементов массива случайным образом.
 * @param {Array.<*>} items - массив элементов
 * @return {Array.<*>} - новый массив с переставленными элементами
 */
var shuffle = function (items) {
  var shuffledItems = items.slice();

  for (var i = shuffledItems.length; i > 1; i--) {
    var randomIndex = Math.floor(Math.random() * i);
    var itemCopy = shuffledItems[i - 1];
    shuffledItems[i - 1] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = itemCopy;
  }

  return shuffledItems;
};

/**
 * Функция, выбирающая случайное число из заданного промежутка.
 * @param {number} startNumber - начальное число промежутка
 * @param {number} endNumber - конечное число промежутка
 * @return {number} - случайное число из заданного промежутка,
 * включая startNumber и endNumber
 */
var getRandomNumber = function (startNumber, endNumber) {
  return Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;
};

/**
 * Функция, выбирающая случайный элемент в массиве.
 * @param {Array.<*>} items - массив элементов
 * @return {*} - случайный элемент массива
 */
var getRandomItem = function (items) {
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Функция, генерирующая объявление случайным образом.
 * @callback generateNoticeCallback
 * @param {number} userNumber - номер пользователя (однозначное число)
 * @param {string} noticeTitle - заголовок объявления
 * @return {Object} - JS объект, описывающий объявление
 */
var generateRandomNotice = function (userNumber, noticeTitle) {
  var locationX = getRandomNumber(MIN_X_LOCATION, MAX_X_LOCATION);
  var locationY = getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION);
  var featuresList = [];

  for (var k = 0; k < PROPERTY_FEATURES.length; k++) {
    if (getRandomNumber(0, 1)) {
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
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: getRandomItem(Object.keys(PROPERTY_TYPES)),
      rooms: getRandomNumber(1, MAX_ROOMS_COUNT),
      guests: getRandomNumber(1, MAX_ROOMS_COUNT),
      checkin: getRandomItem(HOURS),
      checkout: getRandomItem(HOURS),
      features: featuresList,
      description: '',
      photos: shuffle(PROPERTY_PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

/**
 * Функция, генерирующая массив объявлений.
 * @param {generateNoticeCallback} generateNotice - функция, генерирующая объявление
 * @param {number} length - длина массива
 * @return {Array.<Object>}
 */
var generateNotices = function (generateNotice, length) {
  var titles = shuffle(NOTICE_TITLES);
  var notices = [];

  for (var i = 0; i < length; i++) {
    notices[i] = generateNotice(i + 1, titles[i]);
  }

  return shuffle(notices);
};

/**
 * Функция, создающая DOM-элемент, соответствующий метке на карте.
 * @callback renderItemCallback
 * @param {Object} notice - объект, описывающий объявление
 * @param {Object} pinTemplate - шаблон метки
 * @return {Object} - DOM-элемент
 */
var renderPin = function (notice, pinTemplate) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');

  pinElement.style.left = notice.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = notice.location.y - PIN_HEIGHT + 'px';

  pinAvatar.src = notice.author.avatar;
  pinAvatar.alt = notice.offer.title;

  pinElement.addEventListener('click', function () {
    openCard(notice);
  });

  pinElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openCard(notice);
    }
  });

  return pinElement;
};

/**
 * Функция, создающая DOM-элемент, соответствующий доступному удобству,
 * указанному в объявлении.
 * @callback renderItemCallback
 * @param {string} feature - удобство, один из элементов PROPERTY_FEATURES
 * @param {Object} featureTemplate - шаблон удобства
 * @return {Object} - DOM-элемент
 */
var renderFeature = function (feature, featureTemplate) {
  var featureElement = featureTemplate.cloneNode(true);
  featureElement.class = 'popup__feature';
  featureElement.classList.add('popup__feature--' + feature);

  return featureElement;
};

/**
 * Функция, создающая DOM-элемент, соответствующий фотографии жилья.
 * @callback renderItemCallback
 * @param {string} photoUrl - URL фотографии
 * @param {Object} photoTemplate - шаблон фотографии
 * @return {Object} - DOM-элемент
 */
var renderPhoto = function (photoUrl, photoTemplate) {
  var photoElement = photoTemplate.cloneNode(true);
  photoElement.src = photoUrl;

  return photoElement;
};

/**
 * Функция, отрисовывающая массив DOM-элементов.
 * @param {Array.<*>} dataList - массив, содержащий данные элементов
 * @param {Object} parentElement - родительский DOM-элемент, в котором будут отрисованы элементы
 * @param {Object} template - шаблон элемента
 * @param {renderItemCallback} renderItem - функция, создающая DOM-элемент
 */
var renderElements = function (dataList, parentElement, template, renderItem) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataList.length; i++) {
    fragment.appendChild(renderItem(dataList[i], template));
  }
  parentElement.appendChild(fragment);
};

/**
 * Функция, запоняющая DOM-элемент текстом.
 * @param {Object} element - родительский DOM-элемент
 * @param {string} selector - CSS-селектор элемента
 * @param {string} text - новый текст элемента
 */
var fillTemplateWithText = function (element, selector, text) {
  element.querySelector(selector).textContent = text;
};

/**
 * Функция, отрисовывающая карточку объявления.
 * @param {Object} notice - объект, описывающий объявление
 * @param {Object} parentElement - родительский DOM-элемент
 * @param {Object} nextElement - DOM-элемент, перед которым будет отрисовано объявление
 * @param {Object} cardTemplate - шаблон объявления
 */
var renderCard = function (notice, parentElement, nextElement, cardTemplate) {
  var cardElement = cardTemplate.cloneNode(true);
  var featuresElement = cardElement.querySelector('.popup__features');
  var featureTemplate = featuresElement.querySelector('.popup__feature');
  var photosElement = cardElement.querySelector('.popup__photos');
  var photoTemplate = photosElement.querySelector('.popup__photo');
  var closeButton = cardElement.querySelector('.popup__close');
  var offer = notice.offer;

  fillTemplateWithText(cardElement, '.popup__title', offer.title);
  fillTemplateWithText(cardElement, '.popup__text--address', offer.address);
  fillTemplateWithText(cardElement, '.popup__text--price', offer.price + '₽/ночь');
  fillTemplateWithText(cardElement, '.popup__type', PROPERTY_TYPES[offer.type]);
  fillTemplateWithText(cardElement, '.popup__text--capacity', offer.rooms + ' комнаты для ' + offer.guests + ' гостей');
  fillTemplateWithText(cardElement, '.popup__text--time', 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout);
  fillTemplateWithText(cardElement, '.popup__description', offer.description);
  featuresElement.textContent = '';
  renderElements(offer.features, featuresElement, featureTemplate, renderFeature);
  photosElement.textContent = '';
  renderElements(offer.photos, photosElement, photoTemplate, renderPhoto);

  cardElement.querySelector('.popup__avatar').src = notice.author.avatar;

  parentElement.insertBefore(cardElement, nextElement);
  activeCard = cardElement;

  closeButton.addEventListener('click', function () {
    closeActiveCard();
  });

  closeButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeActiveCard();
    }
  });
};

/**
 * Функция, открывающая карточку объявления.
 * @param {Object} notice - объект, описывающий объявление
 */
var openCard = function (notice) {
  if (activeCard) {
    closeActiveCard();
  }
  renderCard(notice, mapElement, mapFiltersElement, mapCardTemplate);
};

/**
 * Функция, закрывающая текущую карточку объявления.
 */
var closeActiveCard = function () {
  activeCard.remove();
};

/**
 * Функция, переводящая страницу в неактивный режим.
 */
var deactivatePage = function () {
  mapElement.classList.add('map--faded');
  noticeFormElement.classList.add('ad-form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
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
};

/**
 * Функция, определяющая адрес метки на карте.
 * @param {boolean} isActive - находится ли страница в активном режиме
 */
var setAddress = function (isActive) {
  var pinOffsetY = isActive ? (userPinElement.offsetHeight + USER_PIN_POINT_SHIFT) : (userPinElement.offsetHeight / 2);
  var addressX = userPinElement.offsetLeft + userPinElement.offsetWidth / 2;
  var addressY = userPinElement.offsetTop + pinOffsetY;

  addressInput.value = addressX + ', ' + addressY;
};

/**
 * Функция, отрисовывающая на карте метки похожих объявлений.
 */
var renderPins = function () {
  var noticesData = generateNotices(generateRandomNotice, SIMILAR_NOTICES_COUNT);
  renderElements(noticesData, mapPinsElement, mapPinTemplate, renderPin);
};

var inactiveUserPinMouseupHandler = function () {
  activatePage();
  renderPins();
  userPinElement.removeEventListener('mouseup', inactiveUserPinMouseupHandler);
};

deactivatePage();
setAddress();
userPinElement.addEventListener('mouseup', inactiveUserPinMouseupHandler);
userPinElement.addEventListener('mouseup', function () {
  setAddress(true);
});