/**
 * Created by mauricio on 12/7/15.
 */

var app = angular.module('hangman', ['ngMockE2E'])

    .controller('gameController', (['$scope', '$http'], function($scope, $http){

        console.log('start appController');

        $scope.player = {};

        $scope.max_errors = 6;

        // game status
        $scope.game_init = false;
        $("#player").focus();

        var resetAllValues = function()
        {
            $scope.letters = {};
            $scope.error_count = 0;
            $scope.word  = null;
            $scope.message = null;
        }

        $scope.gameInit = function() {

            // create session and return word
            $http.post('/new', $scope.player )
                .success(function(result){
                    resetAllValues();
                    $scope.game_init = true;
                    $scope.word = result.word;
                })
        }

        $scope.tryLetter = function()
        {
            // a player should be present"
            if (angular.isUndefined($scope.player.name) || $scope.player.name === null) {
                $scope.new_letter = null;
                return;
            }

            // a letter should be present"
            if (angular.isUndefined($scope.new_letter) || $scope.new_letter === null) {
                $scope.new_letter = null;
                return;
            }

            // only consider uppercase
            $scope.new_letter = $scope.new_letter.toUpperCase();

            // letter should be new
            if ($scope.letters[$scope.new_letter]) {
                $scope.new_letter = null;
                return;
            }

            // check if the letter is valid:
            var letter_is_valid = false;

            $http.post('/play', {letter:$scope.new_letter})
                .then(
                    // success
                    function(result) {
                        console.log(result.data);

                        if(result.data.length < 1){
                            $scope.error_count ++;
                            return;
                        }

                        letter_is_valid = true;

                        // replace letter in the correct position
                        angular.forEach(result.data, function(index) {
                            var position = 3 * index + 1;
                            $scope.word = $scope.word.substr(0, position) + $scope.new_letter + $scope.word.substr(position + 1);
                        });
                    },
                    // error
                    function(result) {
                        // increment error counter
                        $scope.error_count ++;
                    })
                .then(
                    function() {

                        $scope.letters[$scope.new_letter] = {
                            value: $scope.new_letter,
                            status:letter_is_valid?'success':'danger'
                        };

                        $scope.new_letter = null;

                        if ($scope.word.indexOf('_') == -1){
                            // win
                            resetAllValues();
                            $scope.game_init = false;
                            $scope.message = 'Congratulations, you won!';
                        }

                    }
                );

            $("#new-letter" ).focus();
        }

        $scope.$watch('error_count',function(){
            if($scope.error_count >= $scope.max_errors ){
                resetAllValues();
                $scope.game_init = false;
                $scope.message = 'Game Over';
            }
        })

    }));
