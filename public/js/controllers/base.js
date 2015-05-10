angular.module("Geeps", ['ui.bootstrap','ui.router','cgBusy'])

.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('##');
    $interpolateProvider.endSymbol('##');
})