requirejs.config({
    paths: {
        'pages': '../pages',
        'js': '../js',
        'scripts': '../js',
        'lib': '../lib',
        'components': '../components'
    },
    packages: [{
        name: 'css',
        location: '../lib/require-css',
        main: 'css'
    }, {
        name: 'less',
        location: '../lib/require-less',
        main: 'less'
    }, {
        name: 'text',
        location: '../lib/require-text',
        main: 'text'
    }],

    waitSeconds: 30
});



(function () {

    var modules = [
        'js/sprintf',
        'js/gopher',
        'js/model',
        'js/date',
        'js/sha1',
        'js/cloudinary',
        'pages/page-1',
        'pages/rentals/list',
        'pages/login',
        'pages/main',
        'pages/mobile/select-category'
    ];


    require(modules, function () {

        var pages = [];


        $(document).on("pagebeforeload", function (event, params) {
            console.log("pagebeforeload", params);
        });


        $(document).on("pagebeforecreate", function (event, params) {
            console.log("pagebeforecreate ", params);
        });


        $(document).on("pagebeforechange", function (event, params) {


            if (params.options.reverse)
                return;

            if (isObject(params.toPage)) {
                console.log("pagebeforechange ", params);
                console.log("Pushing page '%s' ", params.absUrl);

                pages.push(params);
            } else
                $.mobile.pageData = (params && params.options && params.options.pageData) ? params.options.pageData : null;

        });


        $.mobile.pushPage = function (page, options) {


            var defaults = {
                changeHash: false,

                transition: 'fade',
                showLoadMsg: false
            };

            var opts = $.extend({}, defaults, options);


            $.mobile.changePage(page, opts);

        }

        $.mobile.gotoPage = function (page, options) {

            pages = [];
            $.mobile.pushPage(page, options);
        }


        $.mobile.popPage = function () {

            if (pages.length > 0) {
                var thisPage = pages.pop();

                if (pages.length > 0) {
                    var nextPage = pages[pages.length - 1];

                    console.log("popping from %s to %s", thisPage.absUrl, nextPage.absUrl);

                    var options = {};
                    options.changeHash = false;
                    options.showLoadMsg = false;
                    options.transition = thisPage.options.transition;
                    options.reverse = true;

                    $.mobile.changePage(nextPage.absUrl, options);
                }
            }
        }

        $.urlParam = function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        window.history.back = $.mobile.popPage;

        if ($.urlParam('user')) {
            var user = $.urlParam('user');
            var request = Gopher.login(user);

            request.fail(function () {
                debugger;
            });

            request.done(function (data) {
                $.mobile.gotoPage('pages/mobile/select-category.html');
            });
        } else if (Gopher.sessionID != '') {
            var request = Gopher.verify();

            request.fail(function () {
                $.mobile.gotoPage('pages/login.html');
            });

            request.done(function (data) {
                $.mobile.gotoPage('pages/main.html');
            });

        } else
            $.mobile.gotoPage('pages/login.html');

    });


})();