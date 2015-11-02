angular.module('YourApp', ['ngMaterial'])
    .controller('YourController', function($scope) {
        options = {
            tech: [{
                image: './images/nodejs.png',
                name: 'Nodejs',
                slogan: 'Event-driven I/O server-side JavaScript environment based on V8. Includes API documentation, change-log, examples and announcements.'
            }, {
                image: './images/nodejs.png',
                name: 'AWS',
                slogan: 'Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services. Free to join, pay only for what you use.'
            }, {
                image: './images/rails.png',
                name: 'Ruby on Rail',
                slogan: 'RoR home; full stack, Web application framework optimized for sustainable programming productivity ...'
            }, {
                image: './images/php.png',
                name: 'PHP',
                slogan: 'Server-side HTML embedded scripting language. It provides web developers with a full suite of tools for building dynamic websites'
            }],
            link: ['home', 'tech', 'project', 'team', 'contact']
        }

        function onSwipeLeft() {

        }

        function onSwipeRight() {

        }

        function gotoID(id) {
            console.log(1);
            
            $('body').animate({
                scrollTop: $("#" + id).offset().top
            }, 500)
        }
        $scope.options = options;
        $scope.gotoID = gotoID;
        $scope.onSwipeLeft = onSwipeLeft;
        $scope.onSwipeRight = onSwipeRight;
    });
