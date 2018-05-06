'use strict';

(function () {
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
   * Функция, создающая DOM-элемент, соответствующий метке на карте.
   * @callback renderItemCallback
   * @param {Object} notice - объект, описывающий объявление
   * @param {Object} pinTemplate - шаблон метки
   * @return {Object} - DOM-элемент
   */
  window.pin = {
    render: function (notice, pinTemplate) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinAvatar = pinElement.querySelector('img');

      pinElement.style.left = notice.location.x - PIN_WIDTH / 2 + 'px';
      pinElement.style.top = notice.location.y - PIN_HEIGHT + 'px';

      pinAvatar.src = notice.author.avatar;
      pinAvatar.alt = notice.offer.title;

      return pinElement;
    }
  };
})();
