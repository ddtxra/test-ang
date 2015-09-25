'use strict';

var CartService = angular.module('np.cart', ['np.user.protein.lists.service']);

CartService.factory('Cart', [
    'config',
    'flash',
    function (config, flash) {

        var elements;


        var Cart = function () {
            elements = sessionStorage.cart ? this.getCartFromStorage().elements : [];
        };


        // entry changes status ( selected => unselected ; unselected => selected; )
        Cart.prototype.change = function (docId) {
            var found = _.indexOf(elements, docId);

            // it was found so remove
            if (found != -1) {
                elements = _.without(elements, docId);
                flash("alert-info", docId + " successfully cleared from clipboard")
            } else {	// not found so add
                elements.push(docId);
                flash("alert-info", docId + " successfully added to clipboard")
            }

            this.saveCartToStorage();

            return found;
        };


        Cart.prototype.isInCart = function (docId) {
            return (_.indexOf(elements, docId) != -1);
        };

        Cart.prototype.getCartFromStorage = function () {
            return angular.fromJson(sessionStorage.cart);
        };

        Cart.prototype.saveCartToStorage = function () {
            sessionStorage.cart = angular.toJson({elements: elements});
        };

        Cart.prototype.setCart = function (docIds) {
            elements = _.union(elements, docIds);
            this.saveCartToStorage();
        };

        Cart.prototype.removeFromCart = function (docIds) {
            elements = _.difference(elements, docIds);
            this.saveCartToStorage();
        };

        Cart.prototype.getCartSize = function () {
            return elements.length;
        };

        Cart.prototype.emptyCart = function () {
            elements = [];
            this.saveCartToStorage();
        };

        Cart.prototype.getElements = function () {
            return elements;
        };

        Cart.prototype.inCart = function (id) {
            return elements.indexOf(id) != -1;
        };

        Cart.prototype.remove = function (id) {
            if (elements.length == 1)
                elements = [];
            else elements = elements.splice(id, 1);
        };

        var cart = new Cart();
        return cart;
    }]);


'use strict';


//
//Define the application global configuration

angular.module('np.config', []).factory('config', [
    '$http','npSettings',
    function ($http, npSettings) {

        // api configuration
        var defaultApi = {

            environment: npSettings.environment,
            API_URL: npSettings.base,
            NP1_URL: npSettings.np1,
            AUTH_CALLBACK_URL: npSettings.callback,

            githubQueriesEdit : "https://github.com/calipho-sib/nextprot-queries/edit/develop/src/main/resources/nextprot-queries/",


            ontology: {
                /* Ontology filters */
                "enzymeclassification": "Enzyme classification",
                "evidencecodeontology": "Evidence Code",
                "evocanatomicalsystem": "eVOC Anatomical System",
                "evoccelltype": "eVOC Cell Type",
                "evocdevelopmentstage": "eVOC Development Stage",
                "evocpathology": "eVOC Pathology",
                "gobiologicalprocess": "GO Biological Process",
                "gocellularcomponent": "GO Cellular Component",
                "gomolecularfunction": "GO Molecular Function",
                "mesh": "MeSH",
                "meshanatomy": "MeSH Anatomy",
                "mim": "MIM",
                "ncithesaurus": "NCI Thesaurus",
                "ncimetathesaurus": "NCI Metathesaurus",
                "aanpbiosequenceannotation": "neXtProt annotation",
                "aanpfamily": "neXtProt family",
                "aanptissues": "neXtProt human anatomy",
                "nonstandardaminoacid": "Non-standard amino acid",
                "organelle": "Organelle",
                "sequenceontology": "Sequence ontology",
                "stage": "Bgee developmental stage",
                "upcarbohydrate": "UniProt carbohydrate",
                "upcellline": "neXtProt cell line",
                "updisease": "UniProt disease",
                "updomain": "UniProt domain",
                "upfamily": "UniProt family",
                "upkeywords": "UniProt keyword",
                "upmetal": "UniProt metal",
                "uppathways": "UniPathway",
                "upposttranslationalmodifications": "UniProt post-translational modification",
                "upsubcellularlocation": "UniProt subcellular location",
                "upsubcellularorientation": "Uniprot subcellular orientation",
                "upsubcellulartopology": "UniProt subcellular topology",
                "uptopology": "UniProt topology",

                /* Publication filters */
                "curated": "Cited for annotation",
                "largescale": "Large scale data",
                "computed": "Not cited for annotation",

                /* Entries filters */
                "filterexpressionprofile": "Expression profile",
                "filterproteomics": "Proteomics",
                "filterstructure": "3D structure",
                "filtermutagenesis": "Mutagenesis",
                "filterdisease": "Disease"
            },


            widgets: {
                sort: {
                    asc: "icon-arrow-up",
                    desc: "icon-arrow-down"
                },
                proteins: {
                    sort:{
                        '':{text:"score",image:"icon-arrow-down", isAsc:false},
                        'gene':{text:'gene',image:"icon-arrow-up", isAsc:true},
                        'protein':{text:'protein',image:"icon-arrow-up", isAsc:true},
                        'family':{text:'family',image:"icon-arrow-up", isAsc:true},
                        'chromosome':{text:'chr',image:"icon-arrow-up", isAsc:true},
                        'ac':{text:'ac',image:"icon-arrow-up", isAsc:true},
                        'length':{text:'len',image:"icon-arrow-up", isAsc:true}
                    },
                    gold: true,
                    qualityLabel: {
                        'gold': 'Gold only',
                        'gold-and-silver': 'Include silver'
                    }

                },
                publications: {
                    sort:{
                        '':{text:"",image:"icon-arrow-down", isAsc:false}
                    },
                    gold: false
                },
                terms: {
                    sort:{
                        '':{text:"score",image:"icon-arrow-down", isAsc:false},
                        'name':{text:"name",image:"icon-arrow-up", isAsc:true}
                    },
                    gold: false
                },
                repositories: {
                    aNextprotRep: { /* 'a' is used to appear first */
                        title: "training",
                        tooltip: "Queries used for example",
                        icon: "icon-certificate"
                    },
                    communityRep: {
                        title: "community",
                        tooltip: "Public repository used to share knowledge in the community",
                        icon: "icon-globe"
                    },
                    privateRep: {
                        title: "your private",
                        tooltip: "your private repository",
                        icon: "icon-user"
                    }
                }
            },


            entityMapping: {
                proteins: 'entry.json',
                publications: 'publication.json',
                terms: 'term.json',
                'entry.json': 'proteins',
                'publication.json': 'publications',
                'term.json': 'terms'
            },

            paginate: {
                steps: 8,
                defaultRows: 50
            }

        };
        //
        // global application configuration
        var defaultConfig = {
            api: defaultApi
        }


        return defaultConfig;
    }
]);

(function (angular, undefined) {
    'use strict';

    angular.module('np.export', ['np.tracker'])
        .factory('exportService', exportService)
        .controller('ExportCtrl', ExportCtrl);

    ExportCtrl.$inject = ['Tracker', '$scope', '$routeParams', 'config', 'exportService'];
    function ExportCtrl(Tracker, $scope, $routeParams, config, exportService) {

        var multiEntryFormats = null;
        var singleEntryFormats = null;

        $scope.selectedFormat = null;
        $scope.views = null;
        $scope.selectedView = null;

        $scope.export = exportService;

        $scope.currentSearch = null;
        $scope.currentQuery = null;
        $scope.currentList = null;

        (function initEntryFormats() {

            multiEntryFormats = Object.keys(exportService.templates);
            singleEntryFormats = multiEntryFormats.slice(0);

            // removing 'txt' export for single entry: useless to export one accession number line
            if (!$scope.export.exportObjectType) {

                var index = singleEntryFormats.indexOf('txt');
                if (index > -1) {
                    singleEntryFormats.splice(index, 1);
                }
                index = singleEntryFormats.indexOf('xls');
                if (index > -1) {
                    singleEntryFormats.splice(index, 1);
                }
            }
        })();

        $scope.getFormats = function () {

            return (!$scope.export.exportObjectType) ? singleEntryFormats : multiEntryFormats;
        };

        $scope.setSelectedFormat = function (format) {
            $scope.selectedFormat = format;
            $scope.views = exportService.templates[format];
            $scope.selectedView = $scope.views[0];
            $scope.isSubPartHidden = (exportService.templates[format].length == 0);
        };

        $scope.setSelectedView = function (view) {
            $scope.selectedView = view.replace(new RegExp('^-+', ''), '');
        };

        $scope.gaTrackDownloadEvent = function (closeModal) {

            Tracker.trackDownloadEvent($scope.export.exportObjectType, $scope.selectedFormat, $scope.selectedView);

            if (closeModal) $scope.dismiss();
        };




        $scope.getFileExportURL = function () {

            //multiple entries
            if ($scope.export.exportObjectType) {

                var exportURL = config.api.API_URL + "/export/entries";
                exportURL += _addSuffixURLSubPart($scope.selectedView, $scope.selectedFormat);

                exportURL += "?" + $scope.export.exportObjectType + "=" + window.encodeURIComponent($scope.export.exportObjectIdentifier);

                //TODO
                if ($routeParams.filter)
                    exportURL += "&filter=" + $routeParams.filter;

                if ($routeParams.quality)
                    exportURL += "&quality=" + $routeParams.quality;

                if ($routeParams.sort)
                    exportURL += "&sort=" + $routeParams.sort;

                if ($routeParams.order)
                    exportURL += "&order=" + $routeParams.order;

                return exportURL;

            } else { // export one entry

                var exportURL = config.api.API_URL + "/entry";

                exportURL += "/" + $scope.export.exportObjectIdentifier;
                exportURL += _addSuffixURLSubPart($scope.selectedView, $scope.selectedFormat);
                return exportURL;
            }
        };

        //initialize with xml
        $scope.setSelectedFormat("xml");
    }


    exportService.$inject = ['config', '$http', 'flash', '$log'];
    function exportService(config, $http, flash, $log) {

        var ExportService = function () {

            var self = this;
            this.userQuery = null;
            this.userList = null;

            this.exportObjectType = null;
            this.exportObjectIdentifier = null;

            $http.get(config.api.API_URL+'/export/templates.json')
                .success(function (result) {

                    self.templates = {
                        "xml": result['xml'],
                        "json": result['xml'],
                        "txt": [],
                        "fasta": [],
                        "xls": ["entries","isoforms"]
                        //"peff": []
                    };
                })
                .error(function (data, status) {
                    var message = status+": cannot access views from '"+config.api.API_URL+"/export/templates.json'";
                    $log.error(message);
                    flash("alert-info", message);
                });
        };

        ExportService.prototype.setExportEntry = function (entry) {
            this.exportObjectType = null;
            this.exportObjectIdentifier = entry;
            this.exportTitle = "Download entry '" + entry + "'";
        };

        ExportService.prototype.reset = function () {
            this.userQuery = null;
            this.userList = null;
            this.searchQuery = null;
        };

        ExportService.prototype.setExportParameters = function (params) {

            if (params.queryId) { // neXtProt Query example NXQ_000001
                this.exportObjectType = "queryId";
                this.exportObjectIdentifier = this.userQuery.publicId;
                this.exportTitle = "Download entries for query: '" + this.userQuery.publicId + "'";
            } else if (params.listId) { //a simple list
                this.exportObjectType = "listId";
                this.exportObjectIdentifier = this.userList.publicId;
                this.exportTitle = "Download entries for list '" + this.userList.publicId + "'";
            } else if (params.query) {  //result from a query
                this.exportObjectType = "query";
                this.exportObjectIdentifier = params.query;
                this.exportTitle = "Download entries for simple query";
            }else if (params.sparql) {  //result from a query
                this.exportObjectType = "sparql";
                this.exportObjectIdentifier = params.sparql;
                this.exportTitle = "Download entries for sparql query";
            }

        };

        return new ExportService();
    }



    // PRIVATE METHODS /////////////////////////////////////////
    function _addSuffixURLSubPart (subpart, format){
        var suffix = "";
        if (subpart && (subpart !== 'full-entry')) {
            suffix += "/" + subpart;
        }
        suffix += "." + format;
        return suffix;
    }


})(angular); //global variable

;(function (angular, undefined) {'use strict';


var flash = angular.module('np.flash', [])
	.factory('flash', flashImp)
      .directive('flashMessages', flashMessages); 


flashImp.$inject=['$rootScope', '$timeout'];
function flashImp($rootScope, $timeout) {
    var messages = [];
    var reset;
    var cleanup = function() {
    	reset = $timeout(function() { messages = []; });
    	//$timeout.cancel(reset);
    };

    var emit = function() {
    	$rootScope.$emit('flash:message', messages, cleanup);
    };

    $rootScope.$on('$locationChangeSuccess', emit);

    var asMessage = function(level, text) {
      if (!text) {
        text = level;
        level = 'alert-info';
      }
      return { level: level, text: text };
    };

    var asArrayOfMessages = function(level, text) {
      if (level instanceof Array) return level.map(function(message) {
        return message.text ? message : asMessage(message);
      });
      return text ? [{ level: level, text: text }] : [asMessage(level)];
    };

    var flash = function(level, text) {
      emit(messages = asArrayOfMessages(level, text));

      if(level == 'alert-info' || level == 'alert-success'){
        //to remove the messages after a timeout
        $timeout(function() { messages = []; emit();}, 3000);
      }
    };

    ['alert-danger', 'alert-warning', 'alert-info', 'alert-success'].forEach(function (level) {
      flash[level] = function (text) { flash(level, text); };
    });

    return flash;
};

// Mario style (with the template in the js)
    flashMessages.$inject = [];
    function flashMessages() {
        var directive = {restrict: 'EA', replace: true};

        directive.template =
            '<ul style="position: fixed;top: -2px;left: 15%;right: 15%;z-index:10010;opacity:0.9">' +
            '<li style="list-style: none " ng-repeat="m in messages">' +
            '<div  class="flashmsg alert {{m.level}} alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span></button>' +
            '{{m.text}}' +
            '</div>' +
            '</li>' +
            '</ul>';

        directive.controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
            $rootScope.$on('flash:message', function (_, messages, done) {
                $scope.messages = messages;
                done();
            });
        }];

        return directive;
    }



// Olivier style (with the template in the html)
//.directive('flash', ['$rootScope',function ($rootScope) {
//    return function (scope, elm, attrs) {
//        $rootScope.$on('flash:message', function(_, messages, done) {
//            scope.messages = messages;
//            done();
//        });
//    };
//}]);
})(angular);

(function (angular, undefined) {
    'use strict';

//Declare application level module which depends on additional filters and services (most of them are custom)
    var App = angular.module('np', [
        'ngSanitize',
        'ngResource',
        'ngRoute',
        'ngAnimate',
        'ngCookies',
        'ipCookie',
        'npHelp',
        '$strap.directives',
        'np.flash',
        'np.config',
        'np.user',
        'np.cart',
        'np.user.protein.lists',
        'np.search',
        'np.viewer',
        'np.export',
        'np.version',
        'ui.codemirror',
        'auth0', 'angular-storage', 'angular-jwt', 'logglyLogger'
    ]).config(configApplication)
        .factory('errorInterceptor', errorInterceptor)
        .run(runApplication);

    ///// TODO: fixing; we are breaking the DRY principle and it is really bad (see duplication in nextprot-snorql/app/js/app.config.js) !!!!
    //Environment that should be set from outside //TODO should replace this using GRUNT
    var nxEnvironment = "NX_ENV"; //env can be replaced, by dev, alpha or pro
    //var apiBase = "http://localhost:8080/nextprot-api-web"; //default
    var apiBase = "http://dev-api.nextprot.org"; //default

    var np1Base = "https://www.nextprot.org/";
    //var np1Base = 'http://uat-web1/';


    if (nxEnvironment.indexOf("NX_") == -1) // means an environment has been set, sed command has done some magic tricks
    {
        apiBase = 'http://' + nxEnvironment.toLowerCase() + '-api.nextprot.org';
        if (nxEnvironment.toLowerCase() === "pro") {
            apiBase = 'https://api.nextprot.org'; // Don't forget https!
            np1Base = 'http://www.nextprot.org';
        }
    }

    // main application settings
    App.constant('npSettings', {
        environment: nxEnvironment,
        base: apiBase,   //API URL
        np1: np1Base,    //NP1 URL
        callback: window.location.origin,
        auth0_cliendId: '7vS32LzPoIR1Y0JKahOvUCgGbn94AcFW'
    })


    // init application components
    runApplication.$inject = ['config', 'gitHubContent', 'npSettings']
    function runApplication(config, gitHubContent, npSettings) {
        gitHubContent.initialize({
            helpPath: config.api.API_URL + '/assets/rdfhelp.json',
            helpTitle: 'Generalities',
            root: 'help', // specify a URI prefix
            githubRepo: '/',
            githubApi:apiBase,
            githubEditPage : "https://github.com/calipho-sib/nextprot-docs/edit/master/",
            githubToken : null
        });
    };


    // config application $route, $location and $http services.
    configApplication.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', 'authProvider', 'npSettings', 'jwtInterceptorProvider', 'LogglyLoggerProvider'];
    function configApplication($routeProvider, $locationProvider, $httpProvider, authProvider, npSettings, jwtInterceptorProvider, LogglyLoggerProvider) {
        authProvider.init({
            clientID: npSettings.auth0_cliendId,
            callbackURL: npSettings.callback,
            domain: 'nextprot.auth0.com',
            icon: 'img/np.png'
        })


        LogglyLoggerProvider.inputToken('8d9a8721-1beb-4e25-a37d-f0ff528cf611');

        jwtInterceptorProvider.tokenGetter = ['ipCookie', function (ipCookie) {
            // Return the saved token
            return ipCookie('nxtoken');
        }];
        $httpProvider.interceptors.push('jwtInterceptor');

        $httpProvider.interceptors.push('errorInterceptor');
        $httpProvider.defaults.headers.common.Accept = 'application/json'


        // List of routes of the application
        $routeProvider
            // Home page
            .when('/', {title: 'welcome to nextprot', templateUrl: '/partials/welcome.html'})
            // Pages (in nextprot-docs/pages): about, copyright...
            .when('/:article', {title: 'page', templateUrl: '/partials/doc/page.html'})
            //// Help pages
            // Simple pages
            .when('/help/:article', {title: 'help for nextprot', templateUrl: '/partials/doc/page.html'})
            // RDF generalities
            .when('/help/doc/:article', {title: 'help for RDF', templateUrl: '/partials/doc/doc.html'})
            // RDF entities
            .when('/help/entity/:entity', {title: 'help for RDF', templateUrl: '/partials/doc/help.html'})
            // 404 error page
            .when('/404', {title: '404', templateUrl: '/partials/errors/404.html'})
            // Catch all
            //.otherwise({redirectTo : '/404'});

        // Without serve side support html5 must be disabled.
        $locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix = '!';
    };


// define default behavior for all http request
    errorInterceptor.$inject = ['$q', '$rootScope', '$log', '$location', 'flash']
    function errorInterceptor($q, $rootScope, $log, $location, flash) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function (request) {
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                var status = response.status;
                if (status == 0) {
                    //CAREFUL DO NOT LOG EVERYTHING INTO LOGGYL BECAUSE 1) THERE ARE SENSITIVE INFORMATION token / bearer !  2) We have a limit of 200MB / day
                    $log.error({status : response.status, message : "connection problem", href : window.location.href});
                    //flash('alert-info', "network issue: If the error persists please report to support@nextprot.org");
                    return;
                }/*else if (status == 400) { //Should be handled by the controller}*/
                else if ((status == 401) || (status == 403)) {
                    $log.info({status : response.status, message : "not authorized", href : window.location.href});
                    flash('alert-danger', "You are not authorized to access the url. Please login or review your privileges. If you think this is a problem, please report to support@nextprot.org.");
                    $location.url("");
                    return;
                }/*else if (status == 404) {
                 flash('alert-danger', "URL not found");
                 return;
                 } */
                else if (status >= 500) {
                    console.log(response)
                    if (response.message) {
                        flash('alert-warning', response.message);
                        $log.error({status : response.status, message : response.message, href : window.location.href});
                    } else if (response.data.message) {
                        flash('alert-danger', response.data.message);
                        $log.error({status : response.status, message : response.data.message, href : window.location.href});
                    } else
                        $log.error({status : response.status, message : "wtf??", href : window.location.href});
                        flash('alert-danger', 'Some error occured' + " " + status + " " + response.message + " please report to support@nextprot.org");
                }
                return $q.reject(response);
            }
        };
    };

})(angular);



(function (angular, undefined) {'use strict';

//
//Define the search module for controllers, services and models
angular.module('np.search', [
    'np.search.ui',
    'np.search.service',
    'np.cart',
    'np.user.protein.lists',
    'np.tracker'
]).config(searchConfig)
  .controller('SearchCtrl',SearchCtrl)
  .controller('ResultCtrl',ResultCtrl);

//
//define routes for simple Search
searchConfig.$inject=['$routeProvider'];
function searchConfig($routeProvider) {
    // List of routes of the application
    $routeProvider
        .when('/search', {templateUrl: 'partials/search/result.html'})
        .when('/search/:query', {templateUrl: 'partials/search/result.html'})
        .when('/:entity/search', {templateUrl: 'partials/search/result.html'})
        .when('/:entity/search/:query', {templateUrl: 'partials/search/result.html'});
}

//
// implement main application controller
SearchCtrl.$inject=['Tracker', '$scope','$rootScope','$location', '$routeParams','$document', 'Search','Cart','config','user','flash', 'userProteinList', 'queryRepository', 'exportService', '$log'];
function SearchCtrl(Tracker, $scope, $rootScope, $location, $routeParams, $document, Search, Cart, config, user, flash, userProteinList, queryRepository, exportService, $log) {

    // scope from template
    $scope.Search = Search;
    $scope.config = config;
    $scope.user = user;
    $scope.export = exportService;

    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        autofocus:true,
        readOnly: false,
        mode: 'sparql'
    };

    function resetDocumentTitle() {

        if($location.path()==='/') {
            $document[0].title = "neXtProt Search";
        }
        else if($location.path()==='/user/protein/lists') {
            $document[0].title = "neXtProt - My lists";
        }
        else if($location.path()==='/user/queries') {
            $document[0].title = "neXtProt - My queries";
        }
    }

    //
    // update entity documentation on path change
    $scope.$on('$routeChangeSuccess', function(event, next, current) {

        exportService.reset();

        if ($routeParams.queryId) {
            queryRepository.getQueryByPublicId($routeParams.queryId).then(function (query) {
                Search.params.sparql = "#" + query.title + "\n";
                Search.params.sparql += query.sparql;
                exportService.userQuery = query;
            });
        } else if ($routeParams.listId) {
            userProteinList.getListByPublicId($routeParams.listId).then(function (list) {
                exportService.userList = list;
            });

        } else if ($routeParams.query){
            exportService.searchQuery = $routeParams.query;
            $scope.currentSearch = $routeParams.query;
        }

        resetDocumentTitle();

        if($location.path()==='/') {
            $scope.reset();
            Search.clear();
        }

        Tracker.trackPageView();
        Tracker.trackRouteChangeEvent();
    });

    //
    // load profile on init
    user.me();

    // $scope.AdvancedQueryService = AdvancedQueryService;

    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page === currentRoute ? 'active' : '';
    };

    $scope.login = function() {
        var currentUrl = $location.url();
        $location.url("/"); //need to go to context path since the callback is handled only in context path

        user.login(function(err){
          if(err){
            flash('alert-error', "Ooops an error occured with your login");
          }else {
            flash('alert-info', "Welcome " + user.profile.name);
            $location.url(currentUrl);
          }
        });

    };

    $scope.logout = function () {
        $scope.reset();
        user.logout();
        $location.url("/");
        flash('alert-info', "You have successfully logged out!");
    };

    $scope.setAdvancedUserQuery = function (sparql) {
        $scope.advancedUserQuery = sparql;
    };

    // interact with the search bar
    $scope.manualPaginate = function (form) {

        var currentValue = parseInt(Search.result.pagination.current);
        var numPages = parseInt( Search.result.pagination.numPages);
        if(currentValue > numPages){
            Search.result.pagination.current=numPages;
        }

        $scope.params({start:(Search.result.pagination.current - 1)*Search.result.rows}, form);

    };

    // interact with the search bar
    $scope.params = function (params, form) {
        if (form && !form.$valid)
            return;
        angular.forEach(params, function (v, k) {
            $location.search(k, v);
        });
    };

    $scope.quality = function (name) {
        Search.params.quality = name;
        $location.search('quality', (name !== 'gold') ? 'gold-and-silver' : null);
    };

    $scope.entity = function (params) {

        $location.search('start', null);
        $location.search('filter', null);
        $location.search('quality', null);
        $location.search('sort', null);
        $location.search('order', null);
        if (Search.params.listId && params.entity != 'proteins') {
            $location.search('listId', null);
        }
        $location.path('/' + params.entity + '/search' + ((Search.params.query) ? '/' + Search.params.query : ''));
    };

    $scope.updateUrlSearchPartAdvanced = function (mode) {
        if(mode != $location.search("mode")){

            $location.search('query', null);
            $location.search('sparql', null);
            $scope.updateUrlSearchPart(mode);
            if(mode.mode){
                $location.path('/proteins/search')
            }

        }
        // if (mode==='advanced'){
        //     return $location.path('/proteins/search').search('mode', mode).search('query',null);
        // }

        // $location.search('mode', null).search('sparql',null)
    };

    $scope.clean = function () {
        $location.search('engine', null);
        $location.search('title', null);
        $location.search('sparql', null);
        $location.search('list', null);
        $location.search('rows', null);
        $location.search('start', null);
        $location.search('query', null);
        $location.search('queryId', null);
        $location.search('filter', null);
        $location.search('quality', null);
        $location.search('sort', null);
        $location.search('order', null);
        $location.path('/' + Search.config.entityMapping[Search.params.entity] + '/search');

        Search.params.sparql = ""; //This is needed only when the user is in this page proteins/search?mode=advanced and he has typed something and has clean (otherwise it is driven by the url)
    };

    $scope.reset=function(){
        $location.search({})
    };

    $scope.updateUrlSearchPart = function (params) {

        Cart.emptyCart();

        $location.search('start', null);
        angular.forEach(params, function (v, k) {
            var t = ($location.search()[k] && $location.search()[k] === v) ? null : v;
            $location.search(k, t)
        });
    };

    $scope.goToUser = function (resourceType) {

        Cart.emptyCart();

        if(!user.isAnonymous()){
            if(resourceType == "lists"){
                $location.url("/user/protein/lists");
            }else  if(resourceType == "queries"){
                $location.url("/user/queries");
            }

            }else {
            flash("alert-warning", "Please login to access your " + resourceType + ".")
        }
    };

    $scope.active = function (value, key) {
        if (key) {
            return ($location.search()[key] === value) ? ' active  ' : '';
        }
        return ($location.path().indexOf(value) > -1) ? ' active  ' : '';
    };

    $scope.moredetails = function (index) {

    };

    $scope.displaySort=function(){
        //
        // map default visual aspect of sort
        var entity=Search.config.entityMapping[Search.params.entity],
            defaultSort=Search.config.widgets[entity].sort[Search.params.sort];

        //
        // sort order can be overrided by user action
        if(Search.config.widgets.sort[Search.params.order]){
            defaultSort.image=Search.config.widgets.sort[Search.params.order];
            defaultSort.isAsc=(Search.params.order=='asc')
        }
        return defaultSort
    };

    $scope.isAdvancedMode = function () {
        return Search.params.mode == 'advanced';
    };

    $scope.isSearchBarVisible=function(){
        return ($location.path()==='/'||$location.path().indexOf('/search')!==-1)
    };

    $scope.go = function () {
        var url = $location.url();
        $location.search('filter', null);
        $location.search('listId', null);
        $location.search('list', null);
        $location.search('rows', null);
        $location.search('start', null);
        $location.search('queryId', null);

        // 1) Each time a new search is run, the basket (entries selected) should be emptied
        // 2) Each time a list content is displayed, the basket (entries selected) should be emptied
        Cart.emptyCart();

        $location.path('/' + Search.config.entityMapping[Search.params.entity] + '/search');

        //Advanced mode
        if (Search.params.sparql && Search.params.sparql.length) {

            $location.search('sparql', Search.params.sparql.trim()).
                      search('mode','advanced').
                      search('rows', (Search.params.rows) ? Search.params.rows : 50).
                      search('query',null);

        }

        //We are in simple mode
        if(Search.params.query && Search.params.query.length){
            $location.search('query', Search.params.query.trim()).search('sparql',null);
        }

        //
        // url has not changed => FIRE event
        if ($location.url() === url) {
            $scope.reload();
        }
    };

    $scope.reload = function () {
        // restart search with last params
        Search.docs($routeParams, function (docs) {
        });
    };

    $scope.$on('bs.autocomplete.update', function (event, arg) {
        $scope.go();
        $scope.$apply()
    });

    // use global scope to save the old location as referrer
    $rootScope.$watch( function () {
       return $location.url();
    }, function( newPath, oldPath ) {
       if( newPath !== oldPath ) {
            $scope.referrer = oldPath;
       } else {
            $scope.referrer = undefined;
       }
    });

    $rootScope.locateToReferrer=function() {
        $location.url(($scope.referrer)?$scope.referrer:'/');
    }
}


//
// implement search result controller
ResultCtrl.$inject=['Tracker', '$scope','$modal', '$routeParams','Search','user','Cart','userProteinList','flash', 'exportService', 'queryRepository'];
function ResultCtrl(Tracker, $scope, $modal, $routeParams, Search, user, Cart, userProteinList, flash, exportService, queryRepository) {
    $scope.Search = Search;
    $scope.Cart = Cart;
    $scope.selectedResults = [];

    $scope.showCart = true;

    //
    // save to cart modal
    $scope.modal = { options: { edit: { title: 'Edit' }, create: { title: 'Create'} }, type:'create' };

    var self=this;

    this.search = function (params, cb) {
        if ($routeParams.queryId) {
            queryRepository.repository.show = false;
        }

        Search.docs(params, function (results) {

            params.start = (!$routeParams.start) ? 0 : $routeParams.start;
            if ($routeParams.listId) {
                $scope.showCart = true;
            } else {
                _.each(results.docs, function (doc) {
                    if (Cart.inCart(doc.id))
                        $scope.selectedResults[doc.id] = true;
                });
            }

            $scope.start = Search.result.offset >= Search.resultCount ? 0 : Search.result.offset;
            $scope.rows = Search.result.rows;
            if (cb) cb(results);
        });
    };

    // private
    var searchRouteParams = function() {

        var params = _.clone($routeParams);

        //Set the current owner id, if there is a list
        if ($routeParams.listId) {
            user.$promise.then(function () {

                params.listOwner = user.profile.username;
                self.search(params)
            })
        }
        else {
            self.search(params)
        }
    };

    searchRouteParams();

    $scope.change = function (docId) {
        Cart.change(docId);
    };

    $scope.isInCart = function (docId) {
        return Cart.isInCart(docId);
    };

    $scope.emptyCart = function () {
        Cart.emptyCart();
        if (!$routeParams.listId) $scope.selectedResults = [];
    };

    $scope.addAllToBasket = function () {

        if ($routeParams.listId) {

            userProteinList.getListByPublicId($routeParams.listId).then(
                function (result) {

                    Cart.setCart(result.accessionNumbers);
                    selectAll(result.accessionNumbers);
                },
                function(error){
                    flash(error);
                }
            );
        } else {
            Search.getIds(
                {
                    entity: 'entry.json',
                    quality: Search.params.quality,
                    mode: Search.params.mode,
                    query: Search.params.query,
                    sparql: Search.params.sparql,
                    filter: Search.params.filter
                }, function (docs) {
                    Cart.setCart(docs.ids);
                    selectAll(docs.ids);
                    flash("alert-info", docs.ids.length + " entries added to clipboard");
                });
        }
    };

    function selectAll(ids) {
        $scope.selectedResults = [];
        _.each(ids, function (id) {
            $scope.selectedResults[id] = true;
        });
    }

    $scope.setExportParameters = function (identifier) {
        if (identifier) { //export an entry
            exportService.setExportEntry(identifier);
        } else {
            exportService.setExportParameters($routeParams);
        }
    };

    $scope.removeAllFromBasket = function () {

        if ($routeParams.listId) {

            userProteinList.getListByPublicId($routeParams.listId).then(
                function (result) {

                    Cart.removeFromCart(result.accessionNumbers);
                    $scope.selectedResults = [];
                },
                function (error) {
                    flash(error);
                });
        } else {
            Search.getIds(
                {
                    entity: 'entry.json',
                    quality: Search.params.quality,
                    mode: Search.params.mode,
                    query: Search.params.query,
                    sparql: Search.params.sparql
                }, function (docs) {
                    var size = Cart.getCartSize();
                    Cart.removeFromCart(docs.ids);
                    $scope.selectedResults = [];
                    flash("alert-info", size + " entries removed from clipboard");
                });
        }
    };

    $scope.toggleAllToBasket = function () {

        if (Cart.getCartSize() < Search.resultCount) {
            $scope.addAllToBasket();
        }else {
            $scope.removeAllFromBasket();
        }
    };

    $scope.inverseBasketSelection = function () {

        alert("not yet implemented");
    };

    $scope.getResultTemplateByEntity = function () {
        switch (Search.params.entity) {
            case "publication.json":
                return 'partials/search/result-publications.html';
            case "term.json":
                return 'partials/search/result-terms.html';
            default:
                return 'partials/search/result-proteins.html';
        }
    };

    $scope.getSortTemplateByEntity = function () {
        switch (Search.params.entity) {
            case "publication.json":
                return 'partials/search/sort-publications.html';
            case "term.json":
                return 'partials/search/sort-terms.html';
            default:
                return 'partials/search/sort-proteins.html';
        }
    };

    $scope.affix = function (selector) {
        $(selector).affix()
    };

    $scope.launchModalList = function (elem, action) {
        if(!user.isAnonymous()){

            $scope.selected = {};
            angular.extend($scope.modal, { type: action});

            var proteinListModal = $modal({scope: $scope.$new(), template: 'partials/user/user-protein-lists-modal.html', show: true});
            //proteinListModal.$promise.then(proteinListModal.show);
        } else {
            flash('alert-warning', 'Please login to save a list');
        }
    };

    $scope.saveModal = function () {

        var proteinList = {
            name: $scope.selected.name,
            description: $scope.selected.description,
            accessions: Cart.getElements(),
            ownerId: 1
        };

        userProteinList.create(user, proteinList).$promise.then(
            function () {
                flash('alert-success', "List " + proteinList.name + " successfully created.");

                Tracker.trackSaveAsListEvent(Cart.getElements().length, true);
            }, function(error)  {
                flash('alert-warning', error.data.message);
                Tracker.trackSaveAsListEvent(Cart.getElements().length, false);
            }
        );
    }
}})(angular);

(function (angular, undefined) {'use strict';
var SearchService = angular.module('np.search.service', ['np.search.ui']);


// Search API

/**
 * define service that made the search
 */
SearchService.factory('Search', [
    '$resource',
    '$http',
    '$cookies',
    '$cookieStore',
    'config',
    'flash', //TODO flash should not be here, it should be placed on the controller, but before, the search need to be promised
    function ($resource, $http, $cookies, $cookieStore, config, flash) {
        //
        // this is the url root
        var $api = $resource(config.api.API_URL + '/:action/:entity', { action: '@action', entity: '@entity', port: config.api.API_PORT }, {
            search: { method: 'POST'}
        });


        var defaultUrl = {
            filter: '',
            entity: 'entry.json',
            quality: 'gold',
            query: '',
            sparql: null,
            sort: '',
            order: '',
            mode: null // can be simple or advanced
        };

        var defaultAdv = {
            sparqlEngine: 'Jena'
        };

        var searchApi = {
            action: 'search'
        };

        var suggestApi = {
            action: 'autocomplete'
        };


        /**
         * Reformat publication fields in doc
         *
         * @param {Object} doc publications to reformat
         */
        function reformatPublication(doc) {

            splitPubAcsPubMedLast(doc);

            doc.year = new Date(doc.date.replace(/(CET|CEST|EEST|WEEST)/gi, "")).getFullYear();
            doc.authors = doc.pretty_authors.split(' | ');
        }

        /**
         * Format publication sources accessions line in doc object
         *
         * @method formatPubSources
         * @param {Object} doc the doc on which format has to be done
         */
        function splitPubAcsPubMedLast(doc) {

            if (doc.ac != undefined) {

                // pubmed last in "ac":"25174335:PubMed | 10.1016/j.jmb.2014.08.014:DOI"
                doc.acs = doc.ac.split(' | ');

                if (doc.acs.length > 1) {
                    var i = 0;
                    while (i < doc.acs.length) {
                        if (doc.acs[i].match("PubMed")) break;
                        i++;
                    }

                    if (i < doc.acs.length) {
                        var pubmed = doc.acs[i];
                        doc.acs[0] = doc.acs[doc.acs.length - 1];
                        doc.acs[doc.acs.length - 1] = pubmed;
                    }
                }
            } else {
                doc.acs = "";
            }
        }

        /**
         * Sort filters in ascending order of their mapped values
         *
         * @method sortFiltersByKey
         * @param {Object} parameters
         *   + {Array} filters array to sort
         *   + {Object} map a dictionary of key/values
         *   + {String='name'} key name to access value from filters element object ('name' by default)
         * @return {Array} Returns a sorted list of filters
         */
        function sortFiltersByKey(parameters) {

            var filters = parameters.filters;
            var map = parameters.map;
            var key = parameters.key;

            key = typeof key !== 'undefined' ? key : 'name';

            return filters.sort(function(f1, f2) {

                if (! (key in f1) ) console.error("alert-warning", "'"+key+"' was not found in "+JSON.stringify(f1, null, 4));
                else if (! (key in f2) ) console.error("alert-warning", "'"+key+"' was not found in "+JSON.stringify(f2, null, 4));
                else return map[f1[key]].localeCompare(map[f2[key]]);
            });
        }

        var Search = function (data) {
            //
            // init session
            this.session = {summary : false};
            //angular.extend(this.session, $cookies)

            //
            // default config
            this.config = config.api;

            //
            // app search service params
            this.params = {};

            //for activating the spinner
            this.loading = false;

            //
            // result content
            this.result = {};

            this.resultCount = 0;

            angular.extend(this.params, defaultUrl, data || {})

        };

        Search.prototype.displayGold = function () {
            return (this.config.widgets[this.result.display] && this.config.widgets[this.result.display].gold && this.params.mode != "advanced");
        };


        /*Search.prototype.cookies = function (session) {
            angular.extend(this.session, session, $cookies)
            Object.keys(session).forEach(function (k) {
                if (session[k] !== undefined)$cookieStore.put(k, session[k])
            })
            return true;
        }*/

        Search.prototype.clear = function () {
            angular.copy(defaultUrl, this.params)
        };

        Search.prototype.isSearchButtonDisabled = function () {
            if (this.params.mode == 'advanced' && (!this.params.sparql || !this.params.sparql.length))
                return true;
            return ((this.params.query) && (this.params.query.length == 0));
        };


        Search.prototype.paginate = function (params, docs) {
            this.resultCount = docs.found;
            this.result.pagination = {};
            if (!params.rows)
                params.rows = config.api.paginate.defaultRows;

            params.rows = parseInt(params.rows);

            // current page in the bottom
            var currentOffset = parseInt((params.start ? params.start : 0) / params.rows);
            //The page starts at 1 and the offset starts at 0
            this.result.pagination.current = (currentOffset + 1);

            //total number of pages
            var totalPage = Math.floor(this.resultCount / params.rows) + 1;

            this.result.pagination.numPages = parseInt(this.calcPages(this.resultCount, params.rows ? parseInt(params.rows) : 50));
            //console.log('pages: ', this.result.num, params.rows ? params.rows : 50, this.result.pagination.numPages, this.calcPages(this.result.num, params.rows ? params.rows : 50));

            // back button
            if (params.start > 0 && (this.result.pagination.current) > 0) {
                this.result.pagination.prev = {
                    offset: currentOffset - 1,
                    rows: params.rows,
                    start: ((currentOffset - 1) * params.rows),
                    visible : (currentOffset != 0)

                };
            }

            // next button
            if (docs.results.length == params.rows) {
                this.result.pagination.next = {
                    offset: currentOffset + 1,
                    rows: params.rows,
                    start: ((currentOffset + 1) * params.rows),
                    visible : (currentOffset != (totalPage - 1))
                };
            }

            this.result.offset = docs.start;
            this.result.pages = [];


            var minPage = this.result.pagination.current - (config.api.paginate.steps / 2);
            var maxPage = this.result.pagination.current + (config.api.paginate.steps / 2);


            if (minPage < 1){
                maxPage  += (Math.abs(minPage) + 1);
                minPage = 1;
            }

            if (maxPage > totalPage){
                minPage -= Math.abs(totalPage - maxPage);
                maxPage = totalPage;
            }

            //Final checks when the num results don't feel the paging
            if(minPage < 1) {
                minPage = 1;
            }

            if(maxPage > totalPage) {
                maxPage = totalPage;
            }


            for (var page = minPage; page <= maxPage; page++) {
                this.result.pages.push({
                    offset: page,
                    current: (this.result.pagination.current) === page
                })
            }

        };


        Search.prototype.calcPages = function (numDocs, pageSize) {
            return ( numDocs + pageSize - 1) / pageSize;
        };


        //
        //
        // suggest is a quick search
        Search.prototype.suggest = function (query, cb) {
            var params = {};
            angular.extend(params, defaultUrl, suggestApi, {query: query, entity: this.params.entity, quality: this.params.quality});

            $api.search(params, params.query, function (result) {
                var items = [];
                for (var i = 0; i < result.autocomplete.length; i = i + 2) {
                    items.push(result.autocomplete[i].name)
                }
                if (cb)cb(items)
            })
        };


        //
        //
        // solr search in all documents
        Search.prototype.docs = function (params, cb) {

            var me = this;
            me.result.error = "";
            me.result.docs = [];
            me.loading = true;

            delete this.params.listId;
            delete this.params.queryId;
            delete this.params.list;
            delete this.params.accs;

            angular.extend(this.params, searchApi, defaultUrl, params);
            this.params.entity = config.api.entityMapping[params.entity];

            // adv search
            if (this.params.sparql) {
                angular.extend(this.params, defaultAdv);
            }

            // make a copy to avoid post issue
            var post = angular.copy(this.params);
            delete post.action;
            delete post.entity;

            // display search status status
            me.result.message = "Loading content...";

            $api.search({action: this.params.action, entity: this.params.entity}, post).$promise.then(function (docs) {
                me.result.rows = docs.rows;
                me.result.params = params;
                me.result.display = config.api.entityMapping[me.params.entity];
                me.result.core = docs.index;
                me.result.time = docs.elapsedTime;
                me.result.score = docs.maxScore;
                me.result.docs = docs.results;
                me.result.ontology = config.api.ontology;
                me.result.filters = sortFiltersByKey({filters: docs.filters, map: me.result.ontology});

                me.result.message = (docs.found == 0) ? "No search results were found." : null;

                //
                // prepare spellcheck stucture
                me.result.spellcheck = docs.spellcheck;

                //
                // prepare pagination
                me.paginate(params, docs);

                if (me.result.display === "publications")
                    me.result.docs.forEach(reformatPublication);

                me.loading = false;

                if (cb)cb(me.result)
            }, function (error) {
                flash("alert-warning", error.data.message); //TODO remove this!!!

                //See if there is a cleaner way of doing this
                me.loading = false;
                me.result.message = null;
                me.result.pages = [];
                me.result.filters = null;
                me.resultCount = 0;
                //if (error.status)
                //me.result.error = "Ooops, request failed: " + error;
            })
        };

        Search.prototype.getIds = function (params, cb) {

            // make a copy to avoid post issue
            var post = angular.copy(params);
            delete post.action;
            delete post.entity;

            // adv search
            if (params.mode == 'advanced')
                angular.extend(post, defaultAdv);

            $api.search({ action: 'search-ids', entity: params.entity, quality: params.quality, filter: params.filters }, post).$promise.then(function (docs) {
                if (cb)cb(docs);
            });
        };


        var search = new Search();
        return search;
    }]);
})(angular);

(function (angular, undefined) {
    'use strict';


    var SearchUI = angular.module('np.search.ui', []);


    SearchUI.filter('has', function () {
        return function (input, filter) {
            if (!input || !filter || !input.length || !filter.length)
                return false;
            return input.indexOf(filter) > -1;
        }
    });

    SearchUI.filter('showDropdown', function () {
        return function (input) {
            if (input == 'no')
                return 'hidden';
            return 'dropdown';
        }
    });

    SearchUI.filter('trim', function () {
        return function (input) {
            if (!input || !input.length)
                return '';
            return (input.trim());
        }
    });


    SearchUI.filter('getGitHubUrl', ['config', function (config) {

        return function (queryId) {

            var s = "000000000" + queryId;
            var fileName = "NXQ_" + s.substr(s.length - 5) + ".rq";
            return config.api.githubQueriesEdit + fileName;
        };

    }]);

    /**
     * Filters for publications
     */

    SearchUI.filter('getPubUrl', [function () {
        return function (ac) {
            if (ac.indexOf(":PubMed") != -1) {
                //return "http://www.ncbi.nlm.nih.gov/pubmed?term=" + ac.substring(ac, ac.indexOf(":"));
                return "http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?db=pubmed&cmd=search&term=" + ac.substring(ac, ac.indexOf(":"));
            } else if (ac.indexOf(":DOI") != -1) {
                return "http://dx.doi.org/" + ac.substring(ac, ac.indexOf(":"));
            }
        }
    }]);

    SearchUI.filter('getPubSource', [function () {
        return function (ac) {
            if (ac.toLowerCase().indexOf("pubmed") != -1) return "PubMed";
            else return "Full text";
        };
    }]);

    SearchUI.filter('getPubId', [function () {
        return function (ac) {
            return ac.substring(0, ac.indexOf(":"));
        };
    }]);


    SearchUI.filter('getNeXtProtUrl', ['config', function (config) {
        return function (input) {

                if(config.api.environment === "pro"){
                 switch(input) {
                        case "api": return "https://api.nextprot.org" ;
                        case "search": return "https://search.nextprot.org" ;
                        case "snorql": return "http://snorql.nextprot.org" ;
                    }
                }

                if(input == "api") return config.api.API_URL;
                else return "http://"+ config.api.environment + "-" + input + ".nextprot.org";
        };
    }]);

    SearchUI.filter('filterMyQueries', ['user', function (user) {
        return function (items) {
            var filtered = [];
            angular.forEach(items, function (item) {
                if (item.owner === user.username) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    }]);

    SearchUI.filter('containsTag', ['user',function (user) {
        return function(items, selectedTag) {
            var filtered = [];
            if(selectedTag == null)
                return items;

            if(selectedTag === 'My queries'){
                angular.forEach(items, function(item) {
                    if(item.owner === user.username) {
                        filtered.push(item);
                    }
                });
            }else {
                angular.forEach(items, function(item) {
                    if(_.intersection([selectedTag], item.tags).length > 0) {
                        filtered.push(item);
                    }
                });

            }

            return filtered;
        };
    }]);

    SearchUI.filter('encodeURIComponent', function() {
        return window.encodeURIComponent;
    });

    /*SearchUI.filter('limit', function () {
        return function (value, max, wordwise, tail) {
            if (!value) return '';
            if (!wordwise) wordwise = true;

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' ...');
        };
    });*/

    SearchUI.filter('prefix', function () {
        return function (value, max, wordwise) {
            if (!value) return '';
            if (!wordwise) wordwise = true;

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value;
        };
    });

    SearchUI.filter('suffix', function () {
        return function (value, max) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return '';

            var head = value.substr(0, max);
            var lastHeadSpace = head.lastIndexOf(' ');
            var tail;

            if (lastHeadSpace != -1) {
                tail = value.substr(lastHeadSpace+1);
            }

            return tail;
        };
    });

    SearchUI.directive('version', ['config', function (config) {
        return function (scope, elm, attrs) {
            elm.text(config.version);
        };
    }]);

    SearchUI.directive('npToggleAbstract', [function () {
        return function (scope, elm, attrs) {
            elm.click(function () {

                if (elm.context.text.match(/Show Abstract/)) {
                    elm.context.text = "Hide Abstract";
                } else if (elm.context.text.match(/Hide Abstract/)) {
                    elm.context.text = "Show Abstract";
                }
                angular.element(attrs.npToggleAbstract).toggleClass("hide")
            })
        };
    }]);

    SearchUI.directive('npToggleMore', [function () {
        return function (scope, elm, attrs) {
            elm.click(function () {

                if (elm.context.text.match(/more/)) {
                    elm.context.text = "[less]";
                } else if (elm.context.text.match(/less/)) {
                    elm.context.text = "[more]";
                }
                angular.element(attrs.npToggleMore).toggleClass("hide")
            })
        };
    }]);

    SearchUI.directive('npAnimate', ['config', 'Search', '$location', function (config, Search, $location) {
        return function (scope, elm, attrs) {
            var target = attrs.npAnimate;
            scope.$watch(function () {
                return $location.path()
            }, function (newValue, oldValue) {
                if (newValue !== "/" && newValue !== "/home") {
                    elm.addClass("animate");
                } else {
                    elm.removeClass("animate");
                }

            });
        };
    }]);


    SearchUI.directive('modalOnLoad', function () {
        return function (scope, element, attrs) {
            element.modal({backdrop: false});
        };
    });

    SearchUI.directive('npEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.npEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

//
// autocomplete with customized bootstrap typeahead
// https://github.com/twbs/bootstrap/blob/v2.3.2/js/bootstrap-typeahead.js
    SearchUI.directive('bsAutocomplete', ['Search', '$timeout', function (Search, $timeout) {
        var items = [];

        return function (scope, element, attrs) {
            var promise;

            element.typeahead({
                //minLength: 2,
                autoSelect: false,
                source: function (query, process) {

                    // cancel previous promise if defined
                    if (promise != undefined)
                        $timeout.cancel(promise);

                    // make a promise to look up suggestions after a time delay
                    if (this.$element.val().length>=2) {
                        promise = $timeout(function () {
                            Search.suggest(query, function (items) {
                                return process(items)
                            })
                        }, 500);
                    }
                },
                matcher: function (item) {
                    return true;
                },
                updater: function (item) {
                    Search.params.query = this.$element.val().replace(/[^ ]*$/, '') + item + ' '
                    scope.$emit('bs.autocomplete.update', {element: Search.params.query});
                    return Search.params.query;
                },
                highlighter: function (item) {
                    if (this.query.length > 0) {
                        // this.query: insulin rec
                        // items: receptor, recurrent, receptors, recruitment, receptormediated
                        var words = this.query.split(' ');
                        var endItem= item.slice(words[words.length - 1].length);
                        return "<span class='gray'>" + this.query + "</span><strong class='gray2'>" + endItem + "</strong>"
                    }
                    return this.query;
                }
            });
            // Bootstrap override
            var typeahead = element.data('typeahead');
            // Fixes #2043: allows minLength of zero to enable show all for typeahead
            typeahead.lookup = function (ev) {

                var items;
                this.query = this.$element.val() || '';

                if (this.query.length < this.options.minLength) {
                    return this.shown ? this.hide() : this;
                }
                items = this.source(this.query, $.proxy(this.process, this));

                return items ? this.process(items) : this;
            };
        };
    }]);

    SearchUI.directive('jqAutocomplete', ['Search', function (Search) {
        var results = [];
        return function (scope, elm, attrs) {
            elm.autocomplete({
                select: function (event, ui) {
                    var words = Search.params.query.split(/[\s,]+/);
                    words[words.length - 1] = ui.item.value;
                    Search.params.query = ui.item.value = words.join(' ');
                },
                minLength: 2,
                source: function (request, response) {
                    Search.solrSuggest(request.term, function (docs, solrParams) {
                        var facets = docs.facet_counts.facet_fields.text;
                        results = [];
                        for (var i = 0; i < facets.length; i = i + 2) {
                            results.push({"label": facets[i], "count": facets[i + 1], "value": facets[i]});
                        }
                        //console.log('solr',results,solrParams.q,solrParams )
                        return response(results)
                    });
                }
            })
        };
    }]);


    SearchUI.directive('slideOnClick', ['$parse', '$timeout', function ($parse, $timeout) {
        return function (scope, element, attr) {
            $timeout(function () {
                var e = angular.element(attr['slideOnClick']);
                if (e.length) {
                    element.toggle(function () {
                            e.slideDown();
                        },
                        function () {
                            e.slideUp();
                        })
                }
            }, 100);
        }
    }]);

    SearchUI.directive('npAffix', ['$parse', '$timeout', function ($parse, $timeout) {
        return function (scope, element, attr) {
            $timeout(function () {
                element.affix({offset: attr['npAffix']});
            }, 0);
        }
    }]);

    SearchUI.directive('indeterminateCheckbox', ['Search', function (Search) {
                return {
                    scope: true,
                    restrict: 'A',
                    link: function (scope, element, attrs) {

                        // Watch found proteins for changes
                        scope.$watch(attrs.foundProteinList, function (foundProteinList) {
                            var hasChecked = false;
                            var isIndeterminate = false;
                            var foundProteinCount = Search.resultCount;

                            // some proteins are selected
                            if (foundProteinList.length > 0) {
                                // some proteins are selected
                                hasChecked = true;

                                // not all proteins are selected -> indeterminate state
                                if (foundProteinList.length < foundProteinCount)
                                    isIndeterminate = true;
                            }

                            /*console.log("found proteins changed:", foundProteinList);
                            console.log("found count:", foundProteinCount);
                            console.log("has checked:", hasChecked, "is indeterminate:", isIndeterminate);*/

                            // Determine which state to put the checkbox in
                            if (hasChecked && isIndeterminate) {
                                element.prop('checked', false);
                                element.prop('indeterminate', true);
                            } else {
                                element.prop('checked', hasChecked);
                                element.prop('indeterminate', false);
                            }
                        }, true);
                    }
        }
    }]);

})(angular);



(function (angular, undefined) {
    'use strict';

    angular.module('np.viewer', [])
        .config(viewerConfig)
        .factory('viewerService', viewerService)
        .controller('ViewerCtrl', ViewerCtrl)
        .service('viewerURLResolver', viewerURLResolver)
    ;

    viewerConfig.$inject = ['$routeProvider'];
    function viewerConfig($routeProvider) {

        var ev = {templateUrl: '/partials/viewer/entry-viewer.html'};
        var gv = {templateUrl: '/partials/viewer/global-viewer.html'};

        $routeProvider
            .when('/db/term/:db', {templateUrl: '/partials/viewer/viewer-entry-np1.html'})
            .when('/db/entry/:db', {templateUrl: '/partials/viewer/viewer-entry-np1.html'})
            .when('/db/entry/:element/:db', {templateUrl: '/partials/viewer/viewer-entry-np1.html'})
            .when('/db/publication/:db', {templateUrl: '/partials/viewer/viewer-entry-np1.html'})


            //GLOBAL VIEWS https://github.com/calipho-sib/nextprot-viewers
            .when('/view', gv)
            .when('/view/gist/:gistusr/:gistid', gv) // related to gists
            .when('/view/git/:repository/:user/:branch/:gh1', ev)
            .when('/view/git/:repository/:user/:branch/:gh1/:gh2', ev)
            .when('/view/git/:repository/:user/:branch/:gh1/:gh2/:gh3', ev)

            .when('/view/:gv1', gv)
            .when('/view/:gv1/:gv2', gv)
            .when('/view/:gv1/:gv2/:gv3', gv)

            //ENTRY VIEWS
            .when('/entry/:entry/', ev)
            .when('/entry/:entry/:element', ev)
            .when('/entry/:entry/view/:ev1', ev)
            .when('/entry/:entry/view/:ev1/:ev2', ev)

            .when('/entry/:entry/gist/:gistusr/:gistid', ev) // related to gists
            .when('/entry/:entry/git/:repository/:user/:branch/:gh1', ev)
            .when('/entry/:entry/git/:repository/:user/:branch/:gh1/:gh2', ev)
            .when('/entry/:entry/git/:repository/:user/:branch/:gh1/:gh2/:gh3', ev)
            .when('/term/:termid/', {templateUrl: '/partials/viewer/viewer-term-np1.html'})

    }


    ViewerCtrl.$inject = ['$scope', '$sce', '$routeParams', '$location', 'config', 'exportService', 'viewerService', 'viewerURLResolver'];
    function ViewerCtrl($scope, $sce, $routeParams, $location, config, exportService,  viewerService, viewerURLResolver) {

        $scope.externalURL = null;
        $scope.widgetEntry = null;
        $scope.githubURL = null;
        $scope.communityMode = false;
        $scope.simpleSearchText = "";

        $scope.entryProps ={};
        $scope.entryName = $routeParams.entry;

        var entryViewMode = $scope.entryName != undefined;

        if(entryViewMode){

            viewerService.getCommunityEntryViewers().success(function(data){
                $scope.communityViewers = data;
            });

            viewerService.getEntryProperties($routeParams.entry).$promise.then(function (data) {

                $scope.entryProps.name = data.entry.overview.mainProteinName;
                $scope.entryProps.genesCount = data.entry.overview.geneNames.length;
                angular.extend($scope.entryProps, data.entry.properties);

            })

        }else {

            viewerService.getCommunityGlobalViewers().success(function(data){
                $scope.communityViewers = data;
            });
        }

        $scope.setExportEntry = function (identifier) {
            exportService.setExportEntry(identifier);
        };

        $scope.makeSimpleSearch = function () {
            $location.search("query", $scope.simpleSearchText);
            $location.path("proteins/search");
        }

        $scope.activePage = function (page) {

           if(angular.equals({'entry': $routeParams.entry},  $routeParams)){ // Page function
               if(page === 'function') {
                   return 'active';
               }
           }

            if ($routeParams.element == page)  return 'active'
            if ("view/" + $routeParams.ev1 == page)  return 'active';
            if (("gist/" + $routeParams.gistusr + "/" + $routeParams.gistid) == page)  return 'active';

            else return '';
        }

        // update entity documentation on path change
        $scope.$on('$routeChangeSuccess', function (event, next, current) {
            $scope.widgetEntry = $routeParams.entry;

            //redirect for compatibility with old neXtProt
            if ($routeParams.db) {
                $location.path($location.$$path.replace("db/", ""));
            }

            if ($routeParams.ev1) { //Entry view
                angular.extend($scope, viewerURLResolver.getScopeParamsForEntryViewers($routeParams.ev1, $routeParams.ev2, $routeParams.entry));
            }else if ($routeParams.gv1) { //Global view
                angular.extend($scope, viewerURLResolver.getScopeParamsForGlobalViewers($routeParams.gv1, $routeParams.gv2, $routeParams.gv3));
            // COMMUNITY VIEWERS etiher with GitHub or Gist //////////////////////////////////////
            } else if ($routeParams.repository) {
                angular.extend($scope, viewerURLResolver.getScopeParamsForGitHubCommunity($routeParams.gh1, $routeParams.gh2, $routeParams.gh3, $routeParams.repository, $routeParams.user, $routeParams.branch, $routeParams.entry));
            } else if ($routeParams.gistusr && $routeParams.gistid) { //Gist
                angular.extend($scope, viewerURLResolver.getScopeParamsForGistCommunity($routeParams.gistusr, $routeParams.gistid, $routeParams.entryName));

            // GRAILS INTEGRATION
            } else { //deprecated nextprot
                angular.extend($scope, viewerURLResolver.getScopeParamsForNeXtProtGrails($location.$$path));
            }
        });


    }


    viewerService.$inject = ['$resource', '$http', 'config'];
    function viewerService($resource, $http, config) {

        var rawGitUrlBase = 'https://cdn.rawgit.com/calipho-sib/nextprot-viewers/master/community/';

        //skips authorization
        var entryViewersResource = $http({url: rawGitUrlBase + 'community-entry-viewers.json', skipAuthorization : true, method: 'GET'});
        var globalViewersResource = $http({url: rawGitUrlBase + 'community-global-viewers.json', skipAuthorization : true, method: 'GET'});

        var entryProperties = $resource(config.api.API_URL + '/entry/:entryName/overview.json', {entryName: '@entryName'}, {get : {method: "GET"}});


        var ViewerService = function () {

        };

        ViewerService.prototype.getCommunityGlobalViewers = function () {
            return globalViewersResource;
        }

        ViewerService.prototype.getCommunityEntryViewers = function () {
            return entryViewersResource;
        }

        ViewerService.prototype.getEntryProperties = function (entryName) {
            return entryProperties.get({entryName:entryName});
        }

        return new ViewerService();
    }


    viewerURLResolver.$inject = ['$sce', '$location', 'config', 'npSettings'];
    function viewerURLResolver($sce, $location, config, npSettings) {


        //Setting correct api for viewer
        var env = npSettings.environment;
        if(env.indexOf("NX_") !== -1){ // Choose the environemnt for the viewers
            env = 'dev';
            //env = 'localhost';
        }

        function concatEnvToUrl (url) {
            var envUrl = "";
            if(env !== 'pro'){
                if(url.indexOf('?') !== -1){
                    envUrl = ("&env=" + env);
                }else {
                    envUrl = ("?env=" + env);
                }
            }
            return url + envUrl;
        }

        this.getScopeParamsForEntryViewers = function (ev1, ev2, entryName) {

            var url = window.location.protocol + "//rawgit.com/calipho-sib/nextprot-viewers/master/" + ev1;
            if(ev2) url += "/" + ev2;
            url += "/app/index.html" ;

            return {
                "communityMode": false,
                "githubURL": url.replace("rawgit.com", "github.com").replace("/master/", "/blob/master/"),
                "externalURL":  $sce.trustAsResourceUrl(concatEnvToUrl(url + "?nxentry=" + entryName + "&inputOption=true")) ,
                "widgetURL": $sce.trustAsResourceUrl(concatEnvToUrl(url + "?nxentry=" + entryName))
            }

        }

        this.getScopeParamsForGlobalViewers = function (gv1, gv2, gv3) {

            var url = window.location.protocol + "//rawgit.com/calipho-sib/nextprot-viewers/master/" + gv1;
            if (gv2) url += "/" + gv2;
            if (gv3) url += "/" + gv3;
            url += "/app/index.html";

            return {
                "communityMode": false,
                "githubURL": url.replace("rawgit.com", "github.com").replace("/master/", "/blob/master/"),
                "externalURL": $sce.trustAsResourceUrl(concatEnvToUrl(url)),
                "widgetURL": $sce.trustAsResourceUrl(concatEnvToUrl(url))
            }

        }


        this.getScopeParamsForGitHubCommunity = function (gh1, gh2, gh3, repository, user, branch, entryName) {

            var url = window.location.protocol + "//rawgit.com/" + repository + "/" + user + "/" + branch + "/" + gh1;
            if (gh2) { url += "/" + gh2; }
            if (gh3) { url += "/" + gh3; }

            var urlSource = url.replace("rawgit.com", "github.com").replace("/" + branch + "/", "/blob/" + branch + "/");
            if(entryName != undefined) url += "?nxentry=" + entryName;

            return {
                "communityMode": true,
                "githubURL": urlSource,
                "externalURL": $sce.trustAsResourceUrl(concatEnvToUrl(url)),
                "widgetURL": $sce.trustAsResourceUrl(concatEnvToUrl(url))
            }
        }

        this.getScopeParamsForGistCommunity = function (gistUser, gistId, entryName) {
            var url = window.location.protocol + "//bl.ocks.org/" + gistUser + "/raw/" + gistId;
            if(entryName != undefined) url += "?nxentry=" + entryName;

            return {
                "communityMode": true,
                "githubURL": window.location.protocol + "//bl.ocks.org/" + gistUser + "/" + gistId,
                "externalURL": $sce.trustAsResourceUrl(concatEnvToUrl(url)),
                "widgetURL": $sce.trustAsResourceUrl(concatEnvToUrl(url))
            }
        }


        this.getScopeParamsForNeXtProtGrails = function (path) {
            /* np1Base: origin of NP1 http service, read from conf or set to localhost for dev/debug */
            //var np1Base = "http://localhost:8080/db/entry/";
            var np1Base = config.api.NP1_URL + "/db";
            /* np2css: the css hiding header, footer and navigation items of NP1 page */
            var np2css = "/db/css/np2css.css"; // NP1 integrated css (same as local)
            //var np2css = "http://localhost:3000/partials/viewer/np1np2.css"; // UI local css
            /* np2ori: the origin of the main frame (UI page) used as a base for relative links in iframe*/
            var np2ori = window.location.origin;
            /* np1Params: params to pass to NP1 */
            var np1Params = "?np2css=" + np2css + "&np2ori=" + np2ori;

            return {
                "communityMode": false,
                "githubURL": null,
                "externalURL": np1Base + path,
                "widgetURL": $sce.trustAsResourceUrl(np1Base + $location.$$path + np1Params)
            }
        }


    }





    })(angular); //global variable

;'use strict';

var TrackingService = angular.module('np.tracker', []);

TrackingService
    .value('developTrackingId', 'UA-61448300-1')
    .value('productionTrackingId', 'UA-61448300-2')

TrackingService.factory('Tracker', [
    '$window',
    '$location',
    '$routeParams',
    'RELEASE_INFOS',
    'developTrackingId','productionTrackingId',
    function ($window, $location, $routeParams,
              RELEASE_INFOS,
              developTrackingId, productionTrackingId) {

        var separator = '_';
  
        var tracker = {};

        tracker.trackPageView = function () {
            $window.ga('send', 'pageview', $location.url());
        };

        tracker.trackTransitionRouteChangeEvent = function(dest) {

            var gaEvent = {
                'hitType': 'event',
                'eventCategory': 'ui'+separator+'routing-'+dest
            };

            if (Object.keys(gaEvent).length>0) {

                console.log("tracking transition route -> ga event:", gaEvent);
                ga('send', gaEvent);
            }
        };

        tracker.trackDownloadEvent = function (type, selectedFormat, selectedView) {
            var gaEvent = {
                'hitType': 'event',
                'eventCategory': 'ui'+separator+'download'
            };

            if (typeof selectedFormat !== 'undefined') {
                gaEvent.eventAction = gaEvent.eventCategory + separator + ((type != null) ? 'entries' : 'entry');
                gaEvent.eventLabel = gaEvent.eventAction + separator + selectedView + "-" + selectedFormat;
            } else {
                gaEvent.eventAction = gaEvent.eventCategory + separator + type;
            }

            console.log("tracking download event -> ga event:", gaEvent);
            ga('send', gaEvent);
        };

        tracker.trackSaveAsListEvent = function (count, hasSucceed) {

            if (!hasSucceed) {

                var exceptionEvent = {
                    'exDescription': 'could not save '+count+' entries as list',
                    'exFatal': false,
                    'appName': 'nextprot-ui',
                    'appVersion': version
                };

                if (!isNaN(build))
                    exceptionEvent.appVersion += "-build."+RELEASE_INFOS.build;

                console.log("tracking save as list exception -> ga event:", exceptionEvent);
                ga('send', 'exception', exceptionEvent);
            } else {

                var gaEvent = {
                    'hitType': 'event',
                    'eventCategory': 'ui'+separator+'save-as-list'
                };

                gaEvent.eventAction = gaEvent.eventCategory+separator+'size-'+count;

                console.log("tracking save as list event -> ga event:", gaEvent);
                ga('send', gaEvent);
            }
        };

        tracker.trackRouteChangeEvent = function() {

            var factory = {};

            if ("query" in $routeParams) {
                factory = new SimpleSearchRouteEventFactory($routeParams.entity, $routeParams.query, $routeParams.filter, $routeParams.quality);
            }
            else if ("sparql" in $routeParams) {
                factory = new AdvancedSparqlSearchRouteEventFactory($routeParams.filter);
            }
            else if ("queryId" in $routeParams) {

                var queryId = $routeParams.queryId;
                var type;

                // predefined query
                if (queryId.startsWith("NXQ_")) {
                    type = 'NXQ';
                    queryId = 'NXQ_'+queryId.split("_")[1];

                    factory = new AdvancedQueryIdSearchRouteEventFactory(type, queryId, $routeParams.filter);
                }
                // private query
                else {
                    factory = new ShowListRouteEventFactory('query', $routeParams.filter);
                }
            }
            else if ("listId" in $routeParams) {
                factory = new ShowListRouteEventFactory('list', $routeParams.filter);
            }
            else if ("article" in $routeParams) {
                factory = new HelpRouteEventFactory($routeParams.article);
            }

            if (Object.keys(factory).length > 0) {

                var event = factory.create();

                console.log("tracking route change category  event -> ga event:", event);
                ga('send', event);
            }
        };

        tracker.trackContactUsEvent = function(subject) {

            var gaEvent = {
                'hitType': 'event',
                'eventCategory': 'ui'+separator+'contact-us'
            };

            gaEvent.actionCategory = gaEvent.eventCategory+separator+subject;

            console.log("tracking contacting us -> ga event:", gaEvent);
            ga('send', gaEvent);
        };

        function RouteEventFactory(funcCategory, funcAction, funcLabel) {

            var factory = {};

            factory.category = function () {

                return 'ui' + separator + funcCategory()
            };

            factory.action = function () {

                return 'ui' + separator + funcAction()
            };

            if (typeof funcLabel !== 'undefined') {

                factory.label = function () {

                    return 'ui' + separator + funcLabel()
                };
            }

            function gaEvent(category, action, label) {

                var event = {
                    'hitType': 'event',
                    'eventCategory': category,
                    'eventAction': action
                };

                if (typeof label !== 'undefined')
                    event.eventLabel = label;

                return event;
            }

            factory.create = function () {

                if ('label' in this)
                    return new gaEvent(this.category(), this.action(), this.label());
                else
                    return new gaEvent(this.category(), this.action());
            };

            return factory;
        }

        function SearchRouteEventFactory(kind, type, filter) {

            function category() {
                return 'search' + separator + kind;
            }

            function action() {
                var action = category() + separator + type;

                if (typeof filter !== 'undefined')
                    action += separator + "filtered";

                return action;
            }

            return new RouteEventFactory(category, action);
        }

        function SimpleSearchRouteEventFactory(type, query, filter, silverPlus) {

            var factory = new SearchRouteEventFactory('simple', type, filter);

            var parentAction = factory.action();

            factory.action = function () {

                var action = parentAction;

                if (typeof silverPlus !== 'undefined')
                    action += separator + "gold-and-silver";

                return action;
            };

            factory.label = function () {

                return factory.action() + separator + query;
            };

            return factory;
        }

        function AdvancedSparqlSearchRouteEventFactory(filter) {

            return new SearchRouteEventFactory('advanced', 'sparql', filter);
        }

        function AdvancedQueryIdSearchRouteEventFactory(type, queryId, filter) {

            var factory = new SearchRouteEventFactory('advanced', type, filter);

            if (typeof queryId !== 'undefined' && type == 'NXQ') {

                factory.label = function () {

                    return factory.action() + separator + queryId;
                };
            }
            return factory;
        }

        function ShowListRouteEventFactory(type, filter) {

            function category() {
                return 'show' + separator + type;
            }

            function action() {
                var action = category();

                if (typeof filter !== 'undefined')
                    action += separator + "filtered";

                return action;
            }

            var factory = new RouteEventFactory(category, action);

            if (typeof filter !== 'undefined') {
                factory.label = function () {

                    return factory.action() + separator + filter;
                };
            }

            return factory;
        }

        function HelpRouteEventFactory(docname) {

            function category() {
                return 'help';
            }

            function action() {
                return category() + separator + docname;
            }

            return new RouteEventFactory(category, action);
        }

        // The ga() function provides a single access point for everything in the analytics.js library
        // all tracking calls are made via the ga() function
        function createAndInitGATracker(propertyId) {

            // Google Analytics
            // Asynchronously loads the analytics.js library onto this page
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            // Creates a new default tracker object
            ga('create', propertyId, 'auto');
        }

        function getTrackingId() {

            var trackingId = (RELEASE_INFOS.isProduction == "true") ? productionTrackingId : developTrackingId;

            console.log('Tracking ids: { develop:', developTrackingId, ', production:', productionTrackingId, ', current tracking:', trackingId, '}');

            return trackingId;
        }

        // Setup Universal Analytics Web Tracking (analytics.js)
        createAndInitGATracker(getTrackingId());

        // Sends a first pageview hit for the current page to Google Analytics
        ga('send', 'pageview');

        return tracker;
    }]);


(function (angular, undefined) {'use strict';

angular.module('np.user.application.service', [])


.factory('UserApplication', [
   '$resource',
   '$http',
   'config',
   'user',
   function($resource, $http, config, user) {
	   var baseUrl = config.api.BASE_URL+config.api.API_PORT,
	   		 $dao=$resource(baseUrl+'/nextprot-api-web/user/:username/user-application/:id',
						{username: '@username', id: '@id'}, {
						get: { method: 'GET', isArray: false },
						create: { method: 'POST' },
						update: { method: 'PUT'}
	   			});


/**
       User.prototype.getApplications = function(user, cb) {
	   		var self=this;
	   		user.$promise.then(function(){
			   return self.$dao.get({username: user.profile.username}, function(data) {
				  service.lists = data;
				  if(cb)cb(data);
			   });
	   		})
	   		return this;
	   };

       UserApplication.prototype.create = function(user, application, cb) {
   		var self=this;
   		user.$promise.then(function(){
		   return self.$dao.create({ username: user.profile.username }, list, function(data) {
				if(cb)cb(data);
			});
   		})
   		return this;
	   };

       UserApplication.prototype.update = function(user, list, cb) {
	   	  var self=this;
	   	  user.$promise.then(function(){
			return self.$dao.update({ username: user.profile.username, id: list.id }, list, function(data) {
			});
   		  })
   		  return this;
		};

       UserApplication.prototype.delete = function(user, listId, cb) {
	   	  var self=this;
   		  user.$promise.then(function(){
			return self.$dao.delete({username: user.profile.username, id: listId}, function(data) {
			});
   		  })
   		  return this;
		}
*/
   }
]);


})(angular);

(function (angular, undefined) {'use strict';

angular.module('np.user', [
  'np.user.query',
  'np.config'
]).config(userConfig)
  .factory('user', user)
  .controller('UserCtrl',UserCtrl);

    userConfig.$inject = ['$routeProvider'];
    function userConfig($routeProvider) {
        $routeProvider
            .when('/user', {templateUrl: 'partials/user/user-profile.html'})
            .when('/user/queries', {templateUrl: 'partials/user/user-queries.html'})
            .when('/user/queries/create', {templateUrl: 'partials/user/user-queries-create.html'})
            .when('/user/applications', {templateUrl: 'partials/user/user-applications.html'})
    }

//
// implement user factory
user.$inject=['$resource','$http','config','$timeout','$rootScope','$location','$cookieStore','auth','$q', 'ipCookie', '$window', 'store'];
function user($resource, $http, config, $timeout, $rootScope, $location, $cookieStore, auth, $q, ipCookie, $window, store) {
    //

    // default user data for anonymous
    var defaultProfile={
        authorities : [],
        username : 'Guest',
        profile:{}
    };


    //See also the refresh token https://github.com/auth0/auth0-angular/blob/master/docs/refresh-token.md
    $rootScope.$on('$locationChangeStart', function() {
        if(ipCookie('nxprofile') != null){
            user.copy(ipCookie('nxprofile'));
        } else {
            if ($window.location.hostname === "localhost") {
                ipCookie.remove('nxprofile', { path: '/' });
                ipCookie.remove('nxtoken', { path: '/' });
            } else {
                ipCookie.remove('nxprofile', { path: '/', domain: ".nextprot.org" });
                ipCookie.remove('nxtoken', { path: '/', domain: ".nextprot.org" });
            }
        }
    });

    /*
    $rootScope.$on('auth0.loginSuccess', function (event,auth) {
        user.$promise=auth.profile
        auth.getProfile().then(function(profile){
         user.copy(profile)
         })
    });*/

    //
    // create user domain
    var User = function () {

        //'this' is the 'User' instance
        // init the dao
        this.dao={
           $profile:$resource(config.api.baseUrl + '/user/me', {
                get: { method: 'GET' }
            })
        };

        //
        // init user profile
        this.profile={};
        angular.extend(this.profile,defaultProfile);
        /*
         The $q.when() method creates a promise that is immediately resolved with the given value

         http://stackoverflow.com/questions/16770821/how-does-angular-q-when-work

         Calling $q.when takes a promise or any other type, if it is not a promise then it will wrap it in a
         promise and call resolve. If you pass a value to it then it is never going to be rejected.

         From the docs:
         Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
         This is useful when you are dealing with an object that might or might not be a promise,
         or if the promise comes from a source that can't be trusted.
         */
        this.$promise=$q.when(this);
    };

    //
    //
    User.prototype.isAnonymous = function () {
        return this.profile.username === 'Guest';
    };

    //
    // make the always User a promise of the dao usage
    User.prototype.chain=function(promise){
      this.$promise=this.$promise.then(function(){
         return promise
        },function(){
         return promise
        });
      return this
    };

    User.prototype.copy = function(data) {
        angular.extend(this.profile,defaultProfile, data);
        this.profile.username=this.username=data.email;
        return this;
    };

    User.prototype.clear = function() {
        angular.copy(defaultProfile, this.profile);
        return this;
    };


    User.prototype.login = function (cb) {
        var self=this;

        auth.signin({popup: true, icon:'img/np.png', authParams: {
                scope: 'openid email name picture'
            }},
            function(profile, token) {
                // Success callback
                var expirationInDays = 730; // 730 days = 2 years
                if ($window.location.hostname === "localhost") {
                    ipCookie('nxprofile', profile, { path: '/', expires: expirationInDays });
                    ipCookie('nxtoken', token, { path: '/', expires: expirationInDays });
                } else {
                    ipCookie('nxprofile', profile, { path: '/', domain: '.nextprot.org', expires: expirationInDays });
                    ipCookie('nxtoken', token, { path: '/', domain: '.nextprot.org', expires: expirationInDays });
                }
                $location.path('/');

                self.copy(auth.profile);
                self.username=auth.email;
                cb()

            }, function(error) {
            cb(error)
        });

        /*auth.signin({
            popup: true,
            icon:'img/np.png',
            scope: 'openid email name picture' // This is if you want the full JWT
        }).then(function() {
            // Success callback
            self.copy(auth.profile)
            self.username=auth.email;
            cb()
        }, function(error) {
            cb(error)
        });*/
    };

    User.prototype.logout = function (cb) {
        this.clear();
        auth.signout();

        if ($window.location.hostname === "localhost") {
            ipCookie.remove('nxprofile', { path: '/' });
            ipCookie.remove('nxtoken', { path: '/' });
        } else {
            ipCookie.remove('nxprofile', { path: '/', domain: ".nextprot.org" });
            ipCookie.remove('nxtoken', { path: '/', domain: ".nextprot.org" });
        }

        //legacy remove if it exists (should be removed from June 2015)
        store.remove('profile');
        store.remove('token');

    };


    User.prototype.me = function (cb) {
        var self=this;

        return this.chain(this.dao.$profile.get( function (data) {
                if(data.username){
                    return self.copy(data)
                }

                //
                // the passing token is wrong
                //return self.clear()
            }).$promise
        );
    };


    var user = new User();
    return user;
}


//
// implement user controller
UserCtrl.$inject=['$scope','user','flash','config','ipCookie'];
function UserCtrl($scope, user, flash, config, ipCookie) {
    $scope.user = user;
}

})(angular);

(function (angular, undefined) {
    'use strict';

    angular.module('np.user.protein.lists', [
        'np.user.protein.lists.service',
        'np.user.protein.lists.ui',
        'np.flash',
        'np.tracker'
    ])

//
// configure this module
        .config([
            '$routeProvider',
            '$locationProvider',
            '$httpProvider',
            function ($routeProvider) {
                $routeProvider.when('/user/protein/lists', {templateUrl: 'partials/user/user-protein-lists.html'})
                    .when('/user/protein/lists/create', {templateUrl: 'partials/user/user-protein-lists-create.html'})
            }
        ])
        .controller('ListCtrl', ListCtrl)
        .controller('ListCreateCtrl', ListCreateCtrl);

//
// Controller
    ListCtrl.$inject = ['Tracker', '$scope', 'userProteinList', 'user', 'flash', 'config'];
    function ListCtrl(Tracker, $scope, userProteinList, user, flash, config) {
        $scope.userProteinList = userProteinList;
        $scope.showCombine = false;
        $scope.combineDisabled = true;
        $scope.selected = {};
        $scope.modal = {options: {edit: {title: 'Edit'}, create: {title: 'Create'}}, type: 'create'};
        $scope.lists = [];
        $scope.operators = ["AND", "OR", "NOT_IN"];
        $scope.combination = {first: null, op: $scope.operators[0], second: null};
        $scope.options = {
            first: $scope.lists,
            second: $scope.lists
        }


        $scope.loadMyLists = function () {
            // why get a promise wrapped around the user object ?
            // why not create a promise just here ???
            user.$promise.then(function () {
                userProteinList.list(user).$promise.then(function (data) {
                    $scope.lists = data;
                    $scope.initCombinationForm();
                }, function (reason) {
                    alert('Failed: ' + reason);
                });
            })
        };

        $scope.getListExportUrl = function (list) {
            return config.api.API_URL + "/export/lists/" + list.publicId;
        };

        $scope.gaTrackDownloadList = function () {
            Tracker.trackDownloadEvent('list');
        };

        $scope.initCombinationForm = function () {

            $scope.$watch('combination.first', function (newVal, oldVal) {
                $scope.options.second = $scope.lists.slice(0);

                var index = $scope.options.second.indexOf(newVal);
                if (index > -1)
                    $scope.options.second.splice(index, 1);
            });

            $scope.$watch('combination.second', function (newVal, oldVal) {
                $scope.options.first = $scope.lists.slice(0);

                var index = $scope.options.first.indexOf(newVal);

                if (index > -1)
                    $scope.options.first.splice(index, 1);
            });
        };


        $scope.modalDissmiss = function () {

        };

        $scope.switchCombine = function () {
            var temp = $scope.combination.first;
            $scope.combination.first = $scope.combination.second;
            $scope.combination.second = temp;
        };

        $scope.launchModal = function (elem, action) {
            $scope.selected = {};
            if (action == 'edit') {
                $scope.selected = $scope.lists[elem];
                angular.extend($scope.selected, {index: elem});
            }
            angular.extend($scope.modal, {type: action});
        };

        $scope.saveModal = function () {

            if ($scope.modal.type == 'edit') {
                angular.extend($scope.lists[$scope.selected.index], $scope.selected);

                var list = {
                    id: $scope.selected.id,
                    name: $scope.selected.name,
                    description: $scope.selected.description
                };

                userProteinList.update(user, list).$promise.then(
                    function () {
                        flash("alert-success", list.name + " list was successfully updated");
                    },
                    function (error) {
                        flash("alert-warning", error.message);
                    }
                )

            } else if ($scope.modal.type == 'create') {
                var newList = {name: $scope.selected.name, description: $scope.selected.description};

                userProteinList.combine(
                    user,
                    newList,
                    $scope.combination.first.name,
                    $scope.combination.second.name,
                    $scope.combination.op
                ).$promise.then(function (returnedList) {
                        returnedList.accessions = returnedList.accessionNumbers.length;
                        $scope.lists.push(returnedList);
                        $scope.options.first = $scope.options.second = $scope.lists;
                        flash("alert-success", newList.name + " was successfully created");
                    }, function (error) {
                        flash("alert-warning", error.data.message);
                    });
            }
        };

        // Remove from list
        function removeFromList(list, listId) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === listId) {
                    list.splice(i, 1);
                    break;
                }
            }
        }

        $scope.delete = function (list) {

            if (confirm("Are you sure you want to delete the " + list.name + " list ?")) {
                var listName = list.name;
                var listId = list.id;
                userProteinList.delete(user, listId).$promise.then(
                    function () {
                        removeFromList($scope.lists, listId);
                        $scope.options.first = $scope.options.second = $scope.lists;
                        flash("alert-success", listName + " was successfully deleted");
                    }, function (error) {
                        flash("alert-warning", error.data.message);
                    }
                )
            }
        }
    }

    ListCreateCtrl.$inject = ['$q', '$scope', '$rootScope', '$location', 'userProteinList', 'user', 'uploadListService', 'flash', '$log']
    function ListCreateCtrl($q, $scope, $rootScope, $location, userProteinList, user, uploadListService, flash, $log) {

        $scope.inputAccessions = "";
        $scope.listName = "";

        $scope.files = [];

        $rootScope.$on('upload:loadstart', function () {
            $log.info('Controller: on `loadstart`');
        });

        $rootScope.$on('upload:error', function () {
            $log.info('Controller: on `error`');
        });

        $scope.createList = function () {

            var list = {};

            // get accessions from text area
            if ($scope.inputAccessions.length > 0) {

                var accessions = $scope.inputAccessions.split("\n");

                list = {
                    name: $scope.listName,
                    description: $scope.listDescription,
                    accessions: accessions
                };
            } else {
                list = {
                    name: $scope.listName,
                    description: $scope.listDescription,
                    accessions: []
                }
            }

            userProteinList.create(user, list).$promise
                .then(function (newList) {

                    var promises = [$q.when(true)];

                    for (var i = $scope.files.length - 1; i >= 0; i--) {
                        promises.push(uploadListService.send(newList.id, $scope.files[i]));
                    }

                    $q.all(promises).then(function () {
                        flash('alert-info', "List " + $scope.listName + " created.");
                        $scope.files = [];
                        $location.path('/user/protein/lists');
                    }, function (o) {
                        flash('alert-warning', "List " + $scope.listName + " not created: " + o.data.message)
                    })
                }, function (o) {
                    flash('alert-warning', "List " + $scope.listName + " not created: " + o.data.message)
                })

        };

        $scope.removeUploadFile = function (index) {
            $scope.files.splice(index, 1);
        };

        $scope.isCreatable = function () {

            return ($scope.listName != "" && ( $scope.files.length > 0 || $scope.inputAccessions.length > 0 ) );
        };
    }
})(angular);



(function (angular, undefined) {
    'use strict';

// create the module and define one service
    angular.module('np.user.protein.lists.service', [])
        .factory('userProteinList', userProteinList)
        .factory('uploadListService', uploadListService);


//
// implement the service
    userProteinList.$inject = ['$resource', 'config', '$q'];
    function userProteinList($resource, config, $q) {

        var Proteins = function () {

            this.$daoLists = $resource(config.api.API_URL + '/lists/:id',
                {}, {
                    get: {method: 'GET'},
                    list: {method: 'GET', isArray: true}
                });


            this.$dao = $resource(config.api.API_URL + '/user/me/lists/:id/:action',
                {id: '@id', action: '@action'}, {
                    get: {method: 'GET', isArray: false},
                    list: {method: 'GET', isArray: true},
                    create: {method: 'POST'},
                    update: {method: 'PUT'},
                    fix: {method: 'PUT'}
                });

            //
            // wrap promise to this object
            this.$promise = $q.when(this)
        };

        Proteins.prototype.list = function (user) {
            var self = this;
            self.$promise = self.$dao.list({}).$promise;
            self.$promise.then(function (data) {
                // TODO: weird to refer service that is an instance of Proteins !!!
                service.lists = data;
            });
            return self;
        };

        Proteins.prototype.create = function (user, list) {
            var self = this;
            self.$promise = self.$dao.create({}, list).$promise;
            return self;
        };

        Proteins.prototype.update = function (user, list) {
            var self = this;
            self.$promise = self.$dao.update({id: list.id}, list).$promise;
            return self;
        };

        Proteins.prototype.delete = function (user, listId) {
            var self = this;
            self.$promise = self.$dao.delete({id: listId}).$promise;
            return self;
        };

        Proteins.prototype.getListByPublicId = function (listId) {
            return this.$daoLists.get({id: listId}).$promise;
        };

        /*
         Proteins.prototype.getByIds = function (user, list, cb) {
         var self = this;
         var params = {username: user.profile.username, id: list, action: 'ids'};
         //TODO remove cb
         self.$promise=self.$dao.get(params, function (result) {
         if (cb) cb(result);
         });
         return self;
         }
         */

        Proteins.prototype.combine = function (user, list, l1, l2, op) {
            var self = this;
            self.$promise = self.$dao.get({
                action: 'combine',
                username: user.profile.username,
                listname: list.name,
                description: list.description,
                listname1: l1,
                listname2: l2,
                op: op
            }).$promise;
            return self;
        };

        Proteins.prototype.addElements = function (user, listName, accs, cb) {
            var self = this;
            //TODO remove cb and user promise
            user.$promise.then(function () {
                return self.$dao.fix({
                    action: 'add',
                    username: user.profile.username,
                    list: listName
                }, JSON.stringify(accs), function (data) {
                    if (cb) cb(data);
                });
            });
            return this;
        };

        Proteins.prototype.removeElements = function (user, listName, accs, cb) {
            var self = this;
            //TODO remove cb and user promise
            return user.$promise.then(function () {
                return self.$dao.fix({
                    action: 'remove',
                    username: user.profile.username,
                    list: listName
                }, JSON.stringify(accs), function (data) {
                    if (cb) cb(data);
                });
            });
        };
        var service = new Proteins();
        return service;
    }

// implement the service
    uploadListService.$inject = ['config', '$q', '$http', '$rootScope', 'user', 'auth', 'ipCookie'];
    function uploadListService(config, $q, $http, $rootScope, user, auth, ipCookie) {

        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common["X-Requested-With"];

        var UploadList = function () {
        };
        UploadList.prototype.send = function (listId, file, cb) {
            var data = new FormData(),
                xhr = new XMLHttpRequest(),
                deferred = $q.defer(),
                url = config.api.API_URL + '/user/me/lists/:id/upload';

            // When the request starts.
            xhr.onloadstart = function () {
                $rootScope.$emit('upload:loadstart', xhr);
            };

            // When the request has failed.
            xhr.onerror = function (e) {
                $rootScope.$emit('upload:error', e);
                console.log('errrr', e);
                return deferred.reject(e, xhr)

            };

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status > 305) {
                    return deferred.reject(JSON.parse(xhr.responseText))
                }
                if (xhr.readyState === 4 && xhr.status === 200) {
                    return deferred.resolve(xhr)
                }
            };

            // Send to server, where we can then access it with $_FILES['file].
            data.append('file', file, file.name);
            xhr.open('POST', url.replace(':id', listId));

            //xhr.setRequestHeader('Authorization','Bearer ' + auth.idToken);
            xhr.setRequestHeader('Authorization', 'Bearer ' + ipCookie('nxtoken'));

            xhr.send(data);
            return deferred.promise;
        };
        return new UploadList();
    }


})(angular);

(function (angular, undefined) {
    'use strict';

    angular.module('np.user.protein.lists.ui', [])

        .directive('fadeOnHover', ['$parse', '$timeout', function ($parse, $timeout) {
            return function (scope, element, attr) {
                $timeout(function () {
                    var e = angular.element(attr['fadeOnHover']);
                    if (e.length) {
                        e.bind('mouseenter', function () {
                            element.fadeIn('fast');
                        }).bind('mouseleave', function () {
                            element.fadeOut('fast');
                        });
                    }
                }, 60);
                element.hide();
            }
        }])

        .directive('upload', ['UploadManager', function factory(UploadManager) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.fileUpload({
                        dataType: 'text',
                        add: function (e, data) {
                            UploadManager.add(data);
                        }
                    });
                }
            };
        }])

        .directive('fileChange', function () {
            var linker = function ($scope, element, attributes) {

                // onChange, push the files to $scope.files.
                element.bind('change', function (event) {

                    var files = event.target.files;

                    $scope.$apply(function () {
                        for (var i = 0, length = files.length; i < length; i++) {
                            $scope.files.push(files[i]);
                        }
                    });
                });
            };

            return {
                restrict: 'A',
                link: linker
            };
        });
})(angular);

(function (angular, undefined) {
    'use strict';


    angular.module('np.user.query', ['np.tracker'])
        .factory('queryRepository', queryRepository)
        .controller('QueryRepositoryCtrl', QueryRepositoryCtrl)
        .run(initQueryModule);


    //
    // init module
    initQueryModule.$inject = ['$resource', 'config', 'user', '$q', '$cacheFactory'];
    function initQueryModule($resource, config, user, $q, $cacheFactory) {
        //
        // data access
        var $dao = {
            queries: $resource(config.api.API_URL + '/user/me/queries/:id', {id: '@id'}, {
                    get: {method: 'GET'},
                    list: {method: 'GET', isArray: true},
                    create: {method: 'POST'},
                    update: {method: 'PUT'}
                })
        };

        //
        // repository of queries (TODO more cache access)
        var queryList = $cacheFactory('queries'), queries=[];


        //
        // model for user sparql queries
        var Query = function (data) {

            // init this instance
            this.userQueryId = data && data.userQueryId || undefined;
            this.title = data && data.title || '';
            this.published = data && Boolean(data.published) || false;
            this.owner = data && data.owner || user.profile.username;
            this.sparql = data && data.sparql || "#Write your sparql query here";
            this.description = data && data.description || '';
            this.tags = data && data.tags;

            //
            // wrap promise to this object
            this.$promise = $q.when(this);

            // save this instance
            queryList.put(this.userQueryId, this)
        };


        //
        // create a new query for this user
        Query.prototype.createOne = function (init) {
            return new Query(init);
        };

        //
        // return current queries of this user
        Query.prototype.queries = function () {
            return queries;
        };

        Query.prototype.payload = function () {
            return {
                userQueryId: this.userQueryId,
                title: this.title,
                published: this.published,
                owner: this.owner,
                sparql: this.sparql,
                description: this.description,
                tags: this.tags
            }
        };
        //
        // check is this query is owned by the current user
        Query.prototype.isOwner = Query.prototype.isEditable = function (who) {
            return (this.owner.toLowerCase() == (who || user.profile.username).toLowerCase());
        };

        //
        // CRUD operations
        //

        //
        // list queries for this user
        Query.prototype.list = function () {

            var me = this, params = {};
            me.$promise = $dao.queries.list(params).$promise
            me.$promise.then(function (data) {
                queries = data.map(function (q) {
                    return me.createOne(q)
                })
            });
            return this;
        };

        //
        // save or create the current instance
        Query.prototype.save = function () {
            var params = {id: this.userQueryId};

            // save this instance
            queryList.put(this.userQueryId, this)

            // on update
            if (this.userQueryId) {
                params.id = this.userQueryId;
                return $dao.queries.update(params, this.payload())
            } else {
                return $dao.queries.create(params, this.payload())
            }

        };

        //
        // delete the current instance
        Query.prototype.delete = function () {
            var me = this, params = {id: this.userQueryId};
            me.$promise = $dao.queries.delete(params).$promise
            me.$promise.then(function(){
              queries.every(function(query,i){
                  if(query.userQueryId===me.userQueryId){
                      return queries.splice(i,1);
                  }
                  return true;
              })
            });

            return me;
        };


        // gets the query instance
        Query.prototype.get = function (queryId) {
            var self = this;
            self.$promise=self.$dao.get({id: queryId}).$promise;
            return self;
       };

        user.query = new Query();


        return Query;

    }

//
//
    queryRepository.$inject = ['$resource', 'config', 'user', '$q'];
    function queryRepository($resource, config, user, $q) {

        var description = {
            'public': 'This is the public repository',
            'private': 'This is the private repository',
            'nextprot': 'This is the nextprot repository'
        };

        var icons = {
            'public': 'icon-globe',
            'private': 'icon-user',
            'tutorial': 'icon-certificate'
        };

        var QueryRepository = function () {
            //  this.selectedQuery = {};
            this.category = 'tutorial';
            this.repository = {
                show: true,
                queries: [],
                queriesTags: [],
                filterTag: null,
                selectedQuery: false
            };

            this.queries = {};

            this.userQueryResource = $resource(config.api.API_URL + '/user/me/queries/:id', {}, {
                    get: {method: 'GET'},
                    list: {method: 'GET', isArray: true},
                    create: {method: 'POST'},
                    update: {method: 'PUT'},
                    delete: {method: 'DELETE'}
                });



            this.$dao = { //should be removed!!!
                queries: $resource(config.api.API_URL + '/user/me/queries.json',
                    {}, {
                        get: {method: 'GET'},
                        list: {method: 'GET', isArray: true}
                    })
            };


            this.$daoQueries = $resource(config.api.API_URL + '/queries/:id',
                    {}, {
                        get: {method: 'GET'},
                        list: {method: 'GET', isArray: true}
                    });

            //
            // wrap promise to this object
            this.$promise = $q.when(this)

        };


        QueryRepository.prototype.getDescription = function (name) {
            return description[this.category];
        };

        QueryRepository.prototype.getIcon = function (name) {
            return icons[this.category];
        };


        QueryRepository.prototype.getTutorialQueries = function (name) {
            return this.$daoQueries.list().$promise;
        };

        QueryRepository.prototype.list = function (category) {
            var me = this;
            this.category = category || 'tutorial';
            this.$promise = this.$dao.queries.list({category: this.category}).$promise;
            this.$promise.then(function (data) {
                me.queries = data.map(function (q) {
                    return user.query.createOne(q)
                });
                return me.queries
            });
            return this
        };


        // new method definitions (by Daniel)
        QueryRepository.prototype.getQueryByPublicId = function (queryId) {
            return this.$daoQueries.get({id: queryId}).$promise;
        };

        QueryRepository.prototype.deleteUserQuery = function (query) {
            return this.userQueryResource.delete({id: query.userQueryId}).$promise;
        };

        QueryRepository.prototype.saveOrCreate = function (query) {
            delete query.$promise;
                if (query.userQueryId) {
                    return this.userQueryResource.update({id: query.userQueryId}, query).$promise;
                } else {
                    return this.userQueryResource.create({}, query).$promise;
                }

            return this.userQueryResource.delete({id: query.userQueryId}).$promise;
        };

        return new QueryRepository();
    }

//
//
    QueryRepositoryCtrl.$inject = ['Tracker', '$scope', '$location', '$timeout', '$log','config', 'user', 'queryRepository', 'Search', 'flash']
    function QueryRepositoryCtrl(Tracker, $scope, $location, $timeout, $log, config, user, queryRepository, Search, flash) {

        // publish data
        $scope.repository = queryRepository.repository;
        $scope.queryRepository = queryRepository;

        $scope.runQuery = function (query) {
            $location.search("sparql", query.sparql);
        };

        $scope.setFilterTag = function (tag) {
            $scope.repository.filterTag = tag;
        };

        // publish function
        $scope.showRepository = function () {
            $scope.repository.selectedQuery = null;
            $scope.repository.show = true;
        };

        // publish function
        $scope.toggleRepository = function () {
            $scope.repository.show = !$scope.repository.show;
            $scope.repository.selectedQuery = null;
        };

        // publish function
        $scope.showNewQuery = function () {
            $scope.showRepository();
            $scope.showNewQueryPanel((Search.params.sparql) ? {sparql: Search.params.sparql} : null);
        };

        // publish function
        $scope.toggleNewQuery = function () {
            $scope.toggleRepository();
            $scope.showNewQueryPanel((Search.params.sparql) ? {sparql: Search.params.sparql} : null);
        };

        $scope.didyoumean = function (index) {

            Search.params.query = Search.result.spellcheck.collations[index].query;

            $scope.go();
        };

        $scope.loadQueries = function (category) {
            queryRepository.getTutorialQueries().then(function (queries) {
                $scope.repository.queries = queries;
                $scope.setTags();
            })
        };

        $scope.loadMyQueries = function () {
          user.$promise.then(function(){
              user.query.list().$promise.then(function (q) {
                  $scope.repository.queries = user.query.queries
              })

          })
        };

        $scope.setModalQuery = function (query) {
            $scope.selected = {};
            angular.extend($scope.selected, query);
        };

        $scope.setTags = function () {
            var queries = $scope.repository.queries;
            var tags = [];
            queries.forEach(function (query) {
                query.tags.forEach(function (tag) {
                        if (tags.indexOf(tag.trim()) == -1) {
                            tags.push(tag)
                        }
                    }
                )
            });
            angular.copy(tags,$scope.repository.queriesTags);
        };


        $scope.setCurrentQuery = function (query) {
            $scope.repository.selectedQuery = query;
        };

        $scope.applyCurrentQueryForSearch = function (query) {
            $location.search('sparql', '#' + query.title + "\n" + query.sparql);
            //close after that
            $scope.repository.show = false;
            $scope.repository.selectedQuery = false;
        };

        $scope.showNewQueryPanel = function (data) {
            if(user.isAnonymous()){
                flash("alert-warning", "Please login to create new queries");
            }else {
                $scope.repository.selectedQuery = user.query.createOne(data);
           }
        };

        $scope.saveSelectedQuery = function (query) {

            var q = query || $scope.repository.selectedQuery;
            if(!q.title || (q.title.length == 0)){//TODO check this at the level of the API and database
                flash('alert-warning', 'Please give your query a title');
           }else {

                queryRepository.saveOrCreate(q).then(function () {
                    flash('alert-info', q.title + ' saved successfully');
                    $scope.loadQueries('tutorial'); //TODO should remove the entry from the list without having to call the api again
                    $scope.repository.selectedQuery = false;
                    $('.modal-backdrop').remove();//remove the modal backdrop if everything is fine
                }, function(error){
                    flash('alert-warning', error.data.message);
                });

            }
        };

        $scope.deleteUserQuery = function (query) {
            if (confirm("Are you sure you want to delete the selected query?")) {
                queryRepository.deleteUserQuery(query).then(function () {
                    $scope.loadQueries('tutorial'); //TODO should remove the entry from the list without having to call the api again
                    flash('alert-info', query.title + 'query successfully deleted');
                });
            }
        };


        $scope.doSparqlSearch = function (query) {

            $location.path("/proteins/search");

            $location.search("query", null);
            $location.search("mode", "advanced");
            $location.search("NXQ_ID", query.userQueryId);

        };

        $scope.clearSelectedQuery = function () {
            $scope.repository.selectedQuery = false;
        };

        $scope.gaTrackContactUsEvent = function(subject) {
            Tracker.trackContactUsEvent(subject);
        };
    }


})(angular); //global variable

;'use strict';

angular.module('np.version.directive', [])
    .directive('npBuildVersion', ['RELEASE_INFOS', function (RELEASE_INFOS) {

      return {
        restrict: 'AE',
        replace: true,
        scope: {},
        link: function(scope, element) {

          var content = RELEASE_INFOS.version;

          if (!isNaN(RELEASE_INFOS.build)) {

            content += " (build " + RELEASE_INFOS.build;
            if (RELEASE_INFOS.isProduction !== 'true') content += "#" + RELEASE_INFOS.githash;
            content += ")";
          }

          element.text(content);
        }
      }
}]);

'use strict';

angular.module('np.version', [
    'np.version.directive'
])

.constant('RELEASE_INFOS', {
    'version': '0.3.0',
    "isProduction": 'IS_PRODUCTION', // i.e 'true'
    'build': 'BUILD_NUMBER', // '926'
    'githash': 'GIT_HASH' // 'e3a1a30'
});

//# sourceMappingURL=app.js.map