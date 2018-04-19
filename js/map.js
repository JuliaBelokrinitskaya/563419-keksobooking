'use strict';

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

var NO_GUESTS_ROOMS_COUNT = 100;

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

var noticeFormElement = document.querySelector('.ad-form');
var typeSelect = noticeFormElement.querySelector('[name=type]');
var priceInput = noticeFormElement.querySelector('[name=price]');
var timeInSelect = noticeFormElement.querySelector('[name=timein]');
var timeOutSelect = noticeFormElement.querySelector('[name=timeout]');
var roomsCountSelect = noticeFormElement.querySelector('[name=rooms]');
var capacitySelect = noticeFormElement.querySelector('[name=capacity]');

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
 * @param {string} userNumber - номер пользователя вида '0X',
 * где X - однозначное число
 * @param {string} noticeTitle - заголовок объявления
 * @return {Object} - JS объект, описывающий объявление
 */
var generateRandomNotice = function (userNumber, noticeTitle) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(150, 500);
  var featuresList = [];

  for (var k = 0; k < PROPERTY_FEATURES.length; k++) {
    if (getRandomNumber(0, 1)) {
      featuresList.push(PROPERTY_FEATURES[k]);
    }
  }

  return {
    author: {
      avatar: 'img/avatars/user' + userNumber + '.png'
    },
    offer: {
      title: noticeTitle,
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1000, 1000000),
      type: getRandomItem(Object.keys(PROPERTY_TYPES)),
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 5),
      checkin: getRandomNumber(12, 14) + ':00',
      checkout: getRandomNumber(12, 14) + ':00',
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
  var userNumbers = [];
  var titles = shuffle(NOTICE_TITLES);
  var notices = [];

  for (var i = 0; i < length; i++) {
    userNumbers[i] = '0' + (i + 1);
  }
  userNumbers = shuffle(userNumbers);

  for (var j = 0; j < length; j++) {
    notices[j] = generateNotice(userNumbers[j], titles[j]);
  }

  return notices;
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

  pinElement.style.left = notice.location.x - 25 + 'px';
  pinElement.style.top = notice.location.y - 35 + 'px';

  pinAvatar.src = notice.author.avatar;
  pinAvatar.alt = notice.offer.title;

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
};

/**
 * Функция, устанавливающая нижнюю границу цены и плейсхолдер в зависимости от типа помещения.
 * @param {string} propertyType - тип помещения
 */
var setMinPrice = function (propertyType) {
  var price = PROPERTY_MIN_PRICES[propertyType];
  priceInput.min = price;
  priceInput.placeholder = price;
};

/**
 * Функция, синхронизирующая время заезда с временем выезда.
 * @param {string} timeOut - время выезда
 */
var setTimeIn = function (timeOut) {
  timeInSelect.value = timeOut;
};

/**
 * Функция, синхронизирующая время выезда с временем заезда.
 * @param {string} timeIn - время заезда
 */
var setTimeOut = function (timeIn) {
  timeOutSelect.value = timeIn;
};

/**
 * Функция, устанавливающая сообщение об ошибке для поля выбора количества гостей.
 * @param {number} minGuests - минимальное количество гостей
 * @param {(string|number)} maxGuests - минимальное количество гостей
 * @param {string} validationMessage - сообщение об ошибке
 */
var setCapacityValidity = function (minGuests, maxGuests, validationMessage) {
  var message = capacitySelect.value < minGuests || capacitySelect.value > maxGuests ? validationMessage : '';
  capacitySelect.setCustomValidity(message);
};

/**
 * Функция, выполняющая проверку поля выбора количества гостей в зависимости от выбранного количества комнат.
 * @param {(string|number)} roomsCount - количество комнат
 */
var validateCapacity = function (roomsCount) {
  if (roomsCount < NO_GUESTS_ROOMS_COUNT) {
    setCapacityValidity(1, roomsCount, 'Количество гостей не должно превышать число комнат и должно быть больше 0.');
  } else {
    setCapacityValidity(0, 0, '100 комнат - не для гостей.');
  }
};

/**
 * Функция, активирующая карту с метками.
 */
var activateMap = function () {
  var mapElement = document.querySelector('.map');

  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var mapFilters = mapElement.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var noticesData = generateNotices(generateRandomNotice, 8);

  mapElement.classList.remove('map--faded');
  renderElements(noticesData, mapPinsElement, mapPinTemplate, renderPin);
  renderCard(noticesData[0], mapElement, mapFilters, mapCardTemplate);
};

activateMap();

setMinPrice(typeSelect.value);
validateCapacity(roomsCountSelect.value);

typeSelect.addEventListener('change', function (evt) {
  setMinPrice(evt.target.value);
});

timeInSelect.addEventListener('change', function (evt) {
  setTimeOut(evt.target.value);
});

timeOutSelect.addEventListener('change', function (evt) {
  setTimeIn(evt.target.value);
});

roomsCountSelect.addEventListener('change', function (evt) {
  validateCapacity(evt.target.value);
});

capacitySelect.addEventListener('change', function (evt) {
  validateCapacity(roomsCountSelect.value);
});
