'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    /**
     * Метод, проверяющий нажатие клавиши Esc
     * @param {Object} evt - объект события
     * @return {boolean}
     */
    isEscEvent: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },

    /**
     * Метод, проверяющий нажатие клавиши Enter
     * @param {Object} evt - объект события
     * @return {boolean}
     */
    isEnterEvent: function (evt) {
      return evt.keyCode === ENTER_KEYCODE;
    },

    /**
     * Функция, отрисовывающая массив DOM-элементов.
     * @param {Array.<*>} dataList - массив, содержащий данные элементов
     * @param {Object} parentElement - родительский DOM-элемент, в котором будут отрисованы элементы
     * @param {Object} template - шаблон элемента
     * @param {renderItemCallback} renderItem - функция, создающая DOM-элемент
     * @return {Array.<Object>} - массив отрисованных DOM-элементов
     */
    renderElements: function (dataList, parentElement, template, renderItem) {
      var fragment = document.createDocumentFragment();
      var items = [];
      for (var i = 0; i < dataList.length; i++) {
        items[i] = renderItem(dataList[i], template);
        fragment.appendChild(items[i]);
      }
      parentElement.appendChild(fragment);

      return items;
    }
  };
})();
