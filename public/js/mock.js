/**
 * Created by mauricio on 12/8/15.
 */


app.run(function($httpBackend) {
    var words = [
        'IQU',
        'PERFORMANCE MARKETING',
        'GAME ANALYTICS',
        'HANGMAN',
        'PEELING THE ONION',
        'COHORT ANALYSIS',
        'GAME ON',
    ];

    var word = null;
    var masked_word = null;

    function mask()
    {
        masked_word = word.replace(/[^\w]/g,' / ').replace(/[\w]/g, ' _ ');
    }

    // starts a new game anr return masked word
    $httpBackend.whenPOST('/new').respond(function(method, url, data) {
        word = words[Math.floor( Math.random() * words.length )].toUpperCase();
        mask()
        return [200, {word:masked_word}, {}];
    });

    // tries a letter and return positions when valid
    $httpBackend.whenPOST('/play').respond(function(method, url, json) {
        var data = angular.fromJson(json);
        var letter = data.letter.toUpperCase();
        var findings = [];

        angular.forEach(word.split(''),function(_letter,position) {
            if (letter == _letter) {
                findings.push(position);
            }
        });

        if (!findings.length) {
            return [400, {}, {}];
        }
        return [200, findings, {}];
    });
});
