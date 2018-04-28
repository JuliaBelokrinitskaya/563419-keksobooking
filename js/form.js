'use strict';

(function () {
  var noticeFormElement = document.querySelector('.ad-form');
  var noticeFormFieldsets = noticeFormElement.querySelectorAll('fieldset');
  var noticeFormFields = noticeFormElement.querySelectorAll('input, select, textarea');
  var typeSelect = noticeFormElement.querySelector('[name=type]');
  var priceInput = noticeFormElement.querySelector('[name=price]');
  var timeInSelect = noticeFormElement.querySelector('[name=timein]');
  var timeOutSelect = noticeFormElement.querySelector('[name=timeout]');
  var roomsCountSelect = noticeFormElement.querySelector('[name=rooms]');
  var capacitySelect = noticeFormElement.querySelector('[name=capacity]');

  /**
   * Функция, подсвечивающая поле красной рамкой.
   * @param {Object} target - поле формы
   */
  var markInvalid = function (target) {
    target.classList.add('invalid');
  };

  /**
   * Функция, снимающая подсветку поля красной рамкой.
   * @param {Object} target - поле формы
   */
  var markValid = function (target) {
    target.classList.remove('invalid');
  };

  /**
   * Функция, устанавливающая или снимающая подсветку поля красной рамкой,
   * в зависимости от правильности введенных данных.
   * @param {Object} target - поле формы
   */
  var changeValidityIndicator = function (target) {
    // Сброс рамки
    markValid(target);

    // Если поле не валидно, оно подсвечивается
    target.checkValidity();
  };

  /**
   * Функция, устанавливающая нижнюю границу цены и плейсхолдер в зависимости от типа помещения.
   * @param {string} propertyType - тип помещения
   */
  var setMinPrice = function (propertyType) {
    var price = window.data.getPropertyMinPrice(propertyType);
    priceInput.min = price;
    priceInput.placeholder = price;
    changeValidityIndicator(priceInput);
  };

  /**
   * Функция, синхронизирующая время заезда с временем выезда.
   * @param {Object} timeSelect - DOM-элемент выбора времени заезда или выезда
   * @param {string} timeValue - время заезда/выезда
   */
  var setTime = function (timeSelect, timeValue) {
    timeSelect.value = timeValue;
  };

  /**
   * Функция, устанавливающая сообщение об ошибке для поля выбора количества гостей.
   * @param {number} minGuests - минимальное количество гостей
   * @param {(string|number)} maxGuests - максимальное количество гостей
   * @param {string} validationMessage - сообщение об ошибке
   */
  var setCapacityValidity = function (minGuests, maxGuests, validationMessage) {
    var message = capacitySelect.value < minGuests || capacitySelect.value > maxGuests ? validationMessage : '';
    capacitySelect.setCustomValidity(message);
    changeValidityIndicator(capacitySelect);
  };

  /**
   * Функция, выполняющая проверку поля выбора количества гостей в зависимости от выбранного количества комнат.
   * @param {(string|number)} roomsCount - количество комнат
   */
  var validateCapacity = function (roomsCount) {
    if (roomsCount < window.data.getNoGuestsRoomsCount) {
      setCapacityValidity(1, roomsCount, 'Количество гостей не должно превышать число комнат и должно быть больше 0.');
    } else {
      setCapacityValidity(0, 0, '100 комнат - не для гостей.');
    }
  };

  typeSelect.addEventListener('change', function (evt) {
    setMinPrice(evt.target.value);
  });

  timeInSelect.addEventListener('change', function (evt) {
    setTime(timeOutSelect, evt.target.value);
  });

  timeOutSelect.addEventListener('change', function (evt) {
    setTime(timeInSelect, evt.target.value);
  });

  roomsCountSelect.addEventListener('change', function (evt) {
    validateCapacity(evt.target.value);
  });

  capacitySelect.addEventListener('change', function () {
    validateCapacity(roomsCountSelect.value);
  });

  noticeFormElement.addEventListener('reset', function () {
    resetPage();
  });

  for (var i = 0; i < noticeFormFields.length; i++) {
    var formField = noticeFormFields[i];

    formField.addEventListener('invalid', function (evt) {
      markInvalid(evt.target);
    });
    formField.addEventListener('blur', function (evt) {
      changeValidityIndicator(evt.target);
    });
  }
})();
