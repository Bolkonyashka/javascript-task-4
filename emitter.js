'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    function getListOfEvents(event) {
        let result = [];

        result.push(event);
        var index = event.lastIndexOf('.');
        while (index !== -1) {
            event = event.substring(0, index);
            result.push(event);
            index = event.lastIndexOf('.');
        }

        return result;
    }

    function executeAllHandlers(subscribersList) {
        for (let i = 0; i < subscribersList.length; i++) {
            let subscriberData = subscribersList[i];
            if (subscriberData.count < subscriberData.times &&
                subscriberData.count % subscriberData.frequency === 0) {
                subscriberData.handler.call(subscriberData.context);
            }
            subscriberData.count += 1;
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!events[event]) {
                events[event] = [];
            }

            events[event].push({ context, handler, frequency: 1, times: Infinity, count: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (let ev in events) {
                if (ev === event || ev.startsWith(event + '.')) {
                    events[ev] = events[event].filter(a => a.context !== context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let eventsList = getListOfEvents(event);
            for (let i = 0; i < eventsList.length; i++) {
                let ev = eventsList[i];
                if (events.hasOwnProperty(ev)) {
                    executeAllHandlers(events[ev]);
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (!events[event]) {
                events[event] = [];
            }

            if (times <= 0) {
                times = Infinity;
            }

            events[event].push({ context, handler, frequency: 1, times, count: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (!events[event]) {
                events[event] = [];
            }

            if (frequency <= 0) {
                frequency = 1;
            }

            events[event].push({ context, handler, frequency, times: Infinity, count: 0 });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
