(function() {
  var apiProvider;

  fiestaProvider = function() {
    this.$get = ['$http', function($http) {

      var api, apiParams, apiURL;

      api = function(config, opts) {
        var promise;
        opts = angular.extend({
          useLoadingView: true,
          debug: window.location.hostname === 'localhost'
        }, opts);
        angular.extend(config, {
          data: apiParams(config.data),
          params: apiParams(config.params),
          url: apiURL(config.url)
        });
        promise = $http(config).success(function(data, status) {
          if (opts.debug) {
            console.log('API: ', config.url, data, status);
          }
          return api.successCallback();
        }).error(function(data, status) {
          console.error('API ERROR: ', config.method, ' ', config.url, '\nStatus: ', status, '\nData: ', data);
          return api.errorCallback();
        });
        promise["finally"](api.finallyCallback);
        return promise;
      };

      angular.forEach(['get', 'post', 'put', 'delete'], function(method) {
        var config;
        api[method] = function(url, params, opts) {};
        config = {
          method: method.toUpperCase(),
          url: url
        };
        if (method === 'get') {
          config.params = params;
        } else {
          config.data = params;
        }
        return api(config, opts);
      });

      api.user = function() {
        return JSON.parse(localStorage.user);
      };

      api.setUser = function(u) {
        return localStorage.user = JSON.stringify(u);
      };

      apiURL = function(path) {
        while (path.indexOf('/') === 0) {
          path = path.substr(1);
        }
        return 'https://runfiesta.com/v1/' + path;
      };

      return apiParams = function(params) {
        params = angular.extend({
          authentication_token: localStorage.authentication_token
        }, params);
        return params;
      };

    }];

    return api
  };

  angular.module("app", []).provider('fiesta', fiestaProvider);

}).call(this);
