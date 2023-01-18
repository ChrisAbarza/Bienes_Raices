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

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\n    const lat = -39.862847;\n    const lng = -72.810181;\n    const ZOOM = 16;\n    const mapa = L.map(\"mapa\").setView([lat, lng], ZOOM);\n\n    let marker;\n\n    //utilizar provider y geocoding\n    const geocodeService = L.esri.Geocoding.geocodeService();\n\n    L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\n        attribution:\n            '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n    }).addTo(mapa);\n\n    //datos del ping\n    marker = new L.marker([lat, lng], {\n        draggable: true,\n        autoPan: true,\n    }).addTo(mapa);\n\n    //detectar fin del movimiento del pin para obtener el marcador\n    marker.on(\"moveend\", function (e) {\n        marker = e.target;\n\n        const posicion = marker.getLatLng();\n\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\n\n        //obtener info de calles al soltar pin\n        geocodeService\n            .reverse()\n            .latlng(posicion, ZOOM)\n            .run(function (error, result) {\n                marker.bindPopup(result.address.LongLabel);\n\n                //cargar campos de ubicacion\n                document.querySelector(\".calle\").textContent =\n                    result?.address?.Address ?? \"\";\n                document.querySelector(\"#calle\").value =\n                    result?.address?.Address ?? \"\";\n                document.querySelector(\"#lat\").value =\n                    result?.latlng?.lat ?? \"\";\n                document.querySelector(\"#lng\").value =\n                    result?.latlng?.lng ?? \"\";\n            });\n    });\n})();\n\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;