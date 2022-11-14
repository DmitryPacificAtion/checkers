/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\n/* harmony import */ var _functional_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functional-utils */ \"./src/functional-utils.js\");\n\n\n\n\nconst defaultArrangements = {\n  [_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND]: ['a7', 'e3'],\n  [_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.ALIEN]: ['d6', 'b4'],\n  // [CONSTANTS.FRIEND]: [\n  //   'a7', 'g7', 'e1',\n  //   'b4', 'd6', 'e3',\n  //   'b2', 'h2',\n  // ],\n  // [CONSTANTS.ALIEN]: [\n  //   'b8', 'f8', 'h8',\n  //   'b6', 'f6', 'h6',\n  //   'a3', 'c3', 'f2',\n  //   'a1', 'c1', 'g1'\n  // ],\n  // [CONSTANTS.FRIEND]: [\n  //   'a1', 'c1', 'e1', 'g1',\n  //   'b2', 'd2', 'f2', 'h2',\n  //   'a3', 'c3', 'e3', 'g3',\n  // ],\n  // [CONSTANTS.ALIEN]: [\n  //   'b8', 'd8', 'f8', 'h8',\n  //   'a7', 'c7', 'e7', 'g7',\n  //   'b6', 'd6', 'f6', 'h6',\n  // ]\n};\n\nconst endGame = () => {\n  Object.values(document.querySelectorAll(`.${_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND}`)).forEach(\n    (cell) => {\n      cell.onclick = null;\n      cell.removeEventListener('click', onClickChecker);\n    }\n  );\n  Object.values(document.querySelectorAll(`.${_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.ALIEN}`)).forEach(\n    (cell) => {\n      cell.onclick = null;\n      cell.removeEventListener('click', onClickChecker);\n    }\n  );\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPointers)();\n  document.getElementById('give-up').removeEventListener('click', giveUp);\n};\n\nconst giveUp = () => {\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.showWinnerModal)((0,_helper__WEBPACK_IMPORTED_MODULE_0__.oppositePlayer)((0,_helper__WEBPACK_IMPORTED_MODULE_0__.getTurn)()));\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearReadyField)();\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPossibleStepsSelection)();\n  endGame();\n};\n\nconst endTurn = () => {\n  const turn = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getTurn)();\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearReadyField)();\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPossibleStepsSelection)();\n\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPointers)();\n  if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.isWinner)(turn)) {\n    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.showWinnerModal)(turn);\n    endGame();\n  } else {\n    if ((0,_functional_utils__WEBPACK_IMPORTED_MODULE_1__.isEquals)(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND)(turn)) {\n      (0,_helper__WEBPACK_IMPORTED_MODULE_0__.setTurn)(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.ALIEN);\n    } else {\n      (0,_helper__WEBPACK_IMPORTED_MODULE_0__.setTurn)(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND);\n    }\n    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.setPointers)(turn);\n  }\n};\n\nconst onMoveHandler =\n  (fromId) =>\n  ({ target }) => {\n    const source = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldById)(fromId);\n    target.appendChild(source.firstChild);\n    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.shouldUpgrateToQueen)(target.firstChild) &&\n      (0,_helper__WEBPACK_IMPORTED_MODULE_0__.upgradeToQueen)(target.firstChild);\n    source.innerHTML = null;\n    endTurn();\n  };\n\nconst onAtackHandler =\n  (fromId) =>\n  ({ target }) => {\n    const [resultDirection] = _helper__WEBPACK_IMPORTED_MODULE_0__.directions.diff(fromId, target.id);\n\n    const source = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldById)(fromId);\n    const enemyId = resultDirection(1)(target.id);\n    const enemy = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldById)(enemyId);\n\n    if (enemy) {\n      target.appendChild(source.firstChild);\n      enemy.firstChild.classList.add('remove-checker');\n\n      setTimeout(() => {\n        enemy.innerHTML = null;\n        (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPossibleStepsSelection)();\n\n        const arr = _helper__WEBPACK_IMPORTED_MODULE_0__.directions.all.map(defineCellsForAttack(target)).filter(_functional_utils__WEBPACK_IMPORTED_MODULE_1__.is);\n        if (arr.length === 0) {\n          target.onclick = null;\n          endTurn();\n        }\n        (0,_helper__WEBPACK_IMPORTED_MODULE_0__.updateScore)();\n      }, 500);\n    }\n  };\n\nconst defineCellsForAttack = (cell) => (direction) => {\n  const cellsForAttack = [];\n  for (var index = 1; ; index++) {\n    const nextCell = document.getElementById(direction(index)(cell.id));\n    const cellAfterNext = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldById)(direction(index + 1)(cell.id));\n\n    if (!(nextCell && cellAfterNext)) return null;\n    if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.hasEnemy)(nextCell) && (0,_helper__WEBPACK_IMPORTED_MODULE_0__.isCellEmpty)(cellAfterNext)) {\n      cellsForAttack.push(nextCell);\n      !(0,_helper__WEBPACK_IMPORTED_MODULE_0__.isCellEmpty)(nextCell) && (0,_helper__WEBPACK_IMPORTED_MODULE_0__.highlightCellForMove)(cellAfterNext);\n      cellAfterNext.onclick = onAtackHandler(cell.id);\n      return cellsForAttack.map(_helper__WEBPACK_IMPORTED_MODULE_0__.highlightCellForAttack);\n    } else if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.isQueen)(cell.firstChild) && (0,_helper__WEBPACK_IMPORTED_MODULE_0__.isCellEmpty)(nextCell)) {\n      continue;\n    } else {\n      return null;\n    }\n  }\n};\n\nconst defineCellsToMove = (cell) => (direction) => {\n  const foundCells = [];\n  for (var index = 1; ; index++) {\n    const nextCell = document.getElementById(direction(index)(cell.id));\n    if (!nextCell || !(0,_helper__WEBPACK_IMPORTED_MODULE_0__.isCellEmpty)(nextCell)) break; // Skip undefined cells\n    nextCell.onclick = onMoveHandler(cell.id);\n    foundCells.push(nextCell);\n    if (!(0,_helper__WEBPACK_IMPORTED_MODULE_0__.isQueen)(cell.firstChild)) {\n      // If cell is !isQueen - finish\n      break;\n    }\n  }\n\n  return foundCells.map(_helper__WEBPACK_IMPORTED_MODULE_0__.highlightCellForMove);\n};\n\nconst definePossibleSteps = (cell) => {\n  const { firstChild: target } = cell;\n  const directionsForAttack = _helper__WEBPACK_IMPORTED_MODULE_0__.directions.all.map(defineCellsForAttack(cell))\n    .filter(_functional_utils__WEBPACK_IMPORTED_MODULE_1__.is);\n  if (directionsForAttack.length === 0) {\n    if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.isQueen)(target)) {\n      _helper__WEBPACK_IMPORTED_MODULE_0__.directions.all.forEach(defineCellsToMove(cell));\n    } else {\n      if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.getTurn)() === _helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND) {\n        _helper__WEBPACK_IMPORTED_MODULE_0__.directions.forward.forEach(defineCellsToMove(cell));\n      } else {\n        _helper__WEBPACK_IMPORTED_MODULE_0__.directions.backward.forEach(defineCellsToMove(cell));\n      }\n    }\n  }\n\n  return directionsForAttack;\n};\n\nconst onClickChecker = ({ target }) => {\n  const { parentNode: cell } = target;\n  if ((0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldById)(cell.id)) {\n    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearReadyField)();\n    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.clearPossibleStepsSelection)();\n  }\n\n  if (target.dataset[(0,_helper__WEBPACK_IMPORTED_MODULE_0__.getTurn)()]) {\n    // console.time('select-checker');\n    target.classList.add(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.READY);\n    definePossibleSteps(cell);\n    // console.timeEnd('select-checker');\n  }\n};\n\nconst createChecker = (name, index) => {\n  const div = document.createElement('div');\n  div.addEventListener('click', onClickChecker);\n\n  div.classList.add(name);\n  div.setAttribute(`data-${name}`, index);\n  return div;\n};\n\nconst putCheckerToTheBoard = (name, field, index) => {\n  if (defaultArrangements[name].includes(field.id)) {\n    const checker = createChecker(name, index);\n    field.appendChild(checker);\n  }\n};\n\nfunction init() {\n  console.time('init');\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getFieldsHTML)().forEach((field, index) => {\n    putCheckerToTheBoard(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.FRIEND, field, index);\n    putCheckerToTheBoard(_helper__WEBPACK_IMPORTED_MODULE_0__.CONSTANTS.ALIEN, field, index);\n  });\n  (0,_helper__WEBPACK_IMPORTED_MODULE_0__.updateScore)();\n}\n\n(function () {\n  init();\n  document.getElementById('give-up').addEventListener('click', giveUp);\n})();\n\n\n//# sourceURL=webpack://checkers-game/./src/app.js?");

/***/ }),

/***/ "./src/functional-utils.js":
/*!*********************************!*\
  !*** ./src/functional-utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Identity\": () => (/* binding */ Identity),\n/* harmony export */   \"add\": () => (/* binding */ add),\n/* harmony export */   \"curry\": () => (/* binding */ curry),\n/* harmony export */   \"div\": () => (/* binding */ div),\n/* harmony export */   \"filter\": () => (/* binding */ filter),\n/* harmony export */   \"is\": () => (/* binding */ is),\n/* harmony export */   \"isEquals\": () => (/* binding */ isEquals),\n/* harmony export */   \"join\": () => (/* binding */ join),\n/* harmony export */   \"logger\": () => (/* binding */ logger),\n/* harmony export */   \"map\": () => (/* binding */ map),\n/* harmony export */   \"pipe\": () => (/* binding */ pipe)\n/* harmony export */ });\nconst pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);\nconst is = x => x;\nconst isEquals = x => y => x === y;\nconst Identity = value => ({\n  map: fn => Identity(fn(value))\n});\n\nconst logger = label => value => {\n  console.log(`${ label }: ${ value }`);\n  return value;\n}\nconst curry = (f, arr = []) => (...args) => (\n  a => a.length === f.length ?\n    f(...a) :\n    curry(f, a)\n)([...arr, ...args])\n\nconst add = x => y => x + y;\nconst div = x => y => x - y\n\nconst map = f => arr => arr.map(f);\nconst filter = f => arr => arr.filter(f);\n// export const split = pattern => string => string.split(pattern);\nconst join = pattern => arr => arr.join(pattern);\n\n\n//# sourceURL=webpack://checkers-game/./src/functional-utils.js?");

/***/ }),

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CONSTANTS\": () => (/* binding */ CONSTANTS),\n/* harmony export */   \"QUEEN_FOR_ALIEN_INDEXES\": () => (/* binding */ QUEEN_FOR_ALIEN_INDEXES),\n/* harmony export */   \"QUEEN_FOR_FRIEND_INDEXES\": () => (/* binding */ QUEEN_FOR_FRIEND_INDEXES),\n/* harmony export */   \"bottomLeft\": () => (/* binding */ bottomLeft),\n/* harmony export */   \"bottomRight\": () => (/* binding */ bottomRight),\n/* harmony export */   \"clearPointers\": () => (/* binding */ clearPointers),\n/* harmony export */   \"clearPossibleStepsSelection\": () => (/* binding */ clearPossibleStepsSelection),\n/* harmony export */   \"clearReadyField\": () => (/* binding */ clearReadyField),\n/* harmony export */   \"convertDiffToDirection\": () => (/* binding */ convertDiffToDirection),\n/* harmony export */   \"directions\": () => (/* binding */ directions),\n/* harmony export */   \"getCharAt\": () => (/* binding */ getCharAt),\n/* harmony export */   \"getCharFrom\": () => (/* binding */ getCharFrom),\n/* harmony export */   \"getCoordinates\": () => (/* binding */ getCoordinates),\n/* harmony export */   \"getFieldById\": () => (/* binding */ getFieldById),\n/* harmony export */   \"getFieldsHTML\": () => (/* binding */ getFieldsHTML),\n/* harmony export */   \"getFieldsObject\": () => (/* binding */ getFieldsObject),\n/* harmony export */   \"getInnerCell\": () => (/* binding */ getInnerCell),\n/* harmony export */   \"getTurn\": () => (/* binding */ getTurn),\n/* harmony export */   \"hasEnemy\": () => (/* binding */ hasEnemy),\n/* harmony export */   \"hasEnemyNew\": () => (/* binding */ hasEnemyNew),\n/* harmony export */   \"hasFriend\": () => (/* binding */ hasFriend),\n/* harmony export */   \"hasFriendNew\": () => (/* binding */ hasFriendNew),\n/* harmony export */   \"highlightCellForAttack\": () => (/* binding */ highlightCellForAttack),\n/* harmony export */   \"highlightCellForMove\": () => (/* binding */ highlightCellForMove),\n/* harmony export */   \"isCellEmpty\": () => (/* binding */ isCellEmpty),\n/* harmony export */   \"isCellEmptyNew\": () => (/* binding */ isCellEmptyNew),\n/* harmony export */   \"isQueen\": () => (/* binding */ isQueen),\n/* harmony export */   \"isWinner\": () => (/* binding */ isWinner),\n/* harmony export */   \"oppositePlayer\": () => (/* binding */ oppositePlayer),\n/* harmony export */   \"players\": () => (/* binding */ players),\n/* harmony export */   \"setPointers\": () => (/* binding */ setPointers),\n/* harmony export */   \"setTurn\": () => (/* binding */ setTurn),\n/* harmony export */   \"shouldUpgrateToQueen\": () => (/* binding */ shouldUpgrateToQueen),\n/* harmony export */   \"showWinnerModal\": () => (/* binding */ showWinnerModal),\n/* harmony export */   \"topLeft\": () => (/* binding */ topLeft),\n/* harmony export */   \"topRight\": () => (/* binding */ topRight),\n/* harmony export */   \"updateScore\": () => (/* binding */ updateScore),\n/* harmony export */   \"upgradeToQueen\": () => (/* binding */ upgradeToQueen)\n/* harmony export */ });\n/* harmony import */ var _functional_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functional-utils */ \"./src/functional-utils.js\");\n\n\nconst CONSTANTS = {\n  FRIEND: 'friend',\n  ALIEN: 'alien',\n  READY: 'ready',\n  QUEEN: 'queen',\n  POSSIBLE_ATTACK: 'possible-attack',\n  POSSIBLE_STEP: 'possible-step',\n};\n\nconst players = {\n  0: CONSTANTS.FRIEND,\n  1: CONSTANTS.ALIEN,\n  [CONSTANTS.FRIEND]: 0,\n  [CONSTANTS.ALIEN]: 1,\n};\n\nconst QUEEN_FOR_ALIEN_INDEXES = ['a1', 'c1', 'e1', 'g1'];\nconst QUEEN_FOR_FRIEND_INDEXES = ['b8', 'd8', 'f8', 'h8'];\n\nconst getFieldsHTML = () =>\n  Object.values(document.querySelectorAll('.cell'));\nconst getFieldsObject = () =>\n  getFieldsHTML().reduce((acc, cur) => {\n    acc[cur.id] = cur;\n    return acc;\n  }, {});\nconst getFieldById = (id) => getFieldsObject()[id];\nconst getCharAt = (p) => p.toString().charCodeAt();\nconst getCoordinates = (id) => id.split('').map(getCharAt);\nconst getCharFrom = (n) => String.fromCharCode(n);\nconst oppositePlayer = (turn) => players[+!players[turn]];\nconst getTurn = () => {\n  const { turn } = document.getElementById('turn').dataset;\n  return turn;\n};\nconst clearPossibleStepsSelection = () => {\n  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_STEP}`).forEach((cell) => {\n    cell.classList.remove(CONSTANTS.POSSIBLE_STEP);\n    cell.onclick = null;\n  });\n  document.querySelectorAll(`.${CONSTANTS.POSSIBLE_ATTACK}`).forEach((cell) => {\n    cell.classList.remove(CONSTANTS.POSSIBLE_ATTACK);\n  });\n};\n\nconst clearReadyField = () => {\n  document.querySelector('.ready')?.classList.remove(CONSTANTS.READY);\n};\nconst setTurn = (turn) => {\n  document.getElementById('turn').setAttribute('data-turn', turn);\n};\nconst setPointers = (turn) => {\n  document\n    .querySelectorAll(`.${turn}`)\n    .forEach((cell) => cell.classList.add('pointer'));\n};\nconst clearPointers = () => {\n  document\n    .querySelectorAll('.pointer')\n    .forEach((cell) => cell.classList.remove('pointer'));\n};\nconst isWinner = (turn) => {\n  const alients = document.querySelectorAll(`.${oppositePlayer(turn)}`);\n  return alients.length === 0;\n};\nconst showWinnerModal = (turn) => {\n  const color = (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.isEquals)(turn)(CONSTANTS.FRIEND) ? 'White' : 'Black';\n  alert(`${color} player is winner!`);\n};\n\nconst getInnerCell = (cell) => cell.firstChild;\nconst isCellEmpty = (cell) =>\n  cell ? getInnerCell(cell) === null : true;\nconst hasFriend = (cell) =>\n  isCellEmpty(cell) ? false : getInnerCell(cell)?.classList.contains(getTurn());\n\nconst hasEnemy = (cell) => {\n  const cond = isCellEmpty(cell)\n    ? false\n    : !getInnerCell(cell)?.classList.contains(getTurn());\n  return cond;\n};\n\nconst isCellEmptyNew = (cell) => {\n  return (\n    cell &&\n    !(\n      cell.classList.contains(CONSTANTS.FRIEND) ||\n      cell.classList.contains(CONSTANTS.ALIEN)\n    )\n  );\n};\n\nconst hasFriendNew = (cell) =>\n  isCellEmpty(cell) ? false : (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.isEquals)(cell?.classList.value)(getTurn());\n\nconst hasEnemyNew = (cell) =>\n  isCellEmpty(cell) ? false : !(0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.isEquals)(cell?.classList.value)(getTurn());\n\nconst highlightCellForMove = (step) => {\n  step.classList?.add(CONSTANTS.POSSIBLE_STEP);\n};\n\nconst highlightCellForAttack = (step) => {\n  step.classList.add(CONSTANTS.POSSIBLE_ATTACK);\n  return step;\n};\n\nconst topRight = (n) =>\n  (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.pipe)(getCoordinates, (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)((0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.add)(n)), (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)(getCharFrom), (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.join)(''));\n\nconst topLeft = (n) =>\n  (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.pipe)(\n    getCoordinates,\n    ([x, y]) => [(0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.div)(x)(n), (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.add)(y)(n)],\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)(getCharFrom),\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.join)('')\n  );\n\nconst bottomLeft = (n) =>\n  (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.pipe)(\n    getCoordinates,\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)((i) => (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.div)(i)(n)),\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)(getCharFrom),\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.join)('')\n  );\n\nconst bottomRight = (n) =>\n  (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.pipe)(\n    getCoordinates,\n    ([x, y]) => [(0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.add)(x)(n), (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.div)(y)(n)],\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.map)(getCharFrom),\n    (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.join)('')\n  );\nconst directions = {\n  tr: topRight,\n  tl: topLeft,\n  bl: bottomLeft,\n  br: bottomRight,\n  all: [topRight, topLeft, bottomLeft, bottomRight],\n  forward: [topRight, topLeft],\n  backward: [bottomLeft, bottomRight],\n};\n\nconst convertDiffToDirection = (x) => (y) => {\n  if (x > 0 && y > 0) {\n    return directions.tr;\n  }\n  if (x < 0 && y > 0) {\n    return directions.tl;\n  }\n  if (x > 0 && y < 0) {\n    return directions.br;\n  }\n  if (x < 0 && y < 0) {\n    return directions.bl;\n  }\n  return;\n};\n\nObject.defineProperty(directions, 'diff', {\n  value: (from, to) => {\n    const [fromX, fromY] = getCoordinates(from);\n    const [toX, toY] = getCoordinates(to);\n    const steps = (0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.div)(fromX)(toX);\n\n    return [convertDiffToDirection(steps)((0,_functional_utils__WEBPACK_IMPORTED_MODULE_0__.div)(fromY)(toY)), steps];\n  },\n});\n\n// const lookForOneStep = curry(1);\n// const lookForTwoSteps = curry(2);\n\nconst isQueen = (target) => target.classList.contains(CONSTANTS.QUEEN);\n\nconst shouldUpgrateToQueen = (target) => {\n  const friendCheck =\n    target.classList.contains(CONSTANTS.FRIEND) &&\n    QUEEN_FOR_FRIEND_INDEXES.includes(target.parentNode.id);\n  const ailenCheck =\n    target.classList.contains(CONSTANTS.ALIEN) &&\n    QUEEN_FOR_ALIEN_INDEXES.includes(target.parentNode.id);\n\n  if (friendCheck || ailenCheck) {\n    return true;\n  }\n  return false;\n};\n\nconst upgradeToQueen = (target) => {\n  target.classList.add(CONSTANTS.QUEEN);\n};\n\nconst updateScore = () => {\n  const total = document.querySelectorAll('.score-board__in-game');\n  const friends = document.querySelectorAll(`.${CONSTANTS.FRIEND}`);\n  const aliens = document.querySelectorAll(`.${CONSTANTS.ALIEN}`);\n  total[0].innerText = friends.length;\n  total[1].innerText = aliens.length;\n};\n\n\n//# sourceURL=webpack://checkers-game/./src/helper.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;