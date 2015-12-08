/**
 * Created by mauricio on 12/8/15.
 */


app.run(function($httpBackend) {
    var words = [
        'IQU',
        'PERFORMANCEMARKETING',
        'GAMEANALYTICS',
        'HANGMAN',
        'PEELINGTHEONION',
        'COHORT ANALYSIS',
        'GAMEON',
    ];

    var word = null;
    var masked_word = null;

    function mask()
    {
        masked_word = word.replace(/[^\w]/g,' / ').replace(/[\w]/g, ' _ ');
    }

    // returns the current list of phones
    $httpBackend.whenPOST('/new').respond(function(method, url, data) {
        word = words[Math.floor( Math.random() * words.length )].toUpperCase();
        mask()
        return [200, {word:masked_word}, {}];
    });

    // adds a new phone to the phones array
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

    $httpBackend.whenGET(/^\/templates\//).passThrough();

});
