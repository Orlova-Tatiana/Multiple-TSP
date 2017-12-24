# Multiple-TSP
Это уже почти начатая дипломная работа.
В итоге, должен получится визуализированный алгоритм многих коммивояжеров.
На данном этапе есть точный (ветвей и границ) и неточный (генетический) алгоритмы.

В работе представлены все найденные мной в интернете реализации этапов
(селекции, кроссовера и мутации) генетического алгоритма для многих коммивояжеров.

Собрать и протестировать алгоритм можно по следующей
[ссылке](https://dmitriy-kiselyov.github.io/Multiple-TSP/).

На данный момент выявлен самый быстрый и точный алгоритм:
Селекция: _tournament_, кроссовер: _prev/next_, мутация: _reverse_ или _segment_.
Для _турнира_ планируется подобрать параметр - размер турнира, для мутации - вероятность.

**Внимание!** Код написан при помощи нового стандарта *ECMAScript 6*.
Он может не поддерживаться вашим браузером.
Код работает на последних версиях Google Chrome, Opera, Mozilla Firefox и Edge.
IE не работает, Safari не тестировался.
