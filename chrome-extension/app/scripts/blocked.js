'use strict';

var Blocking = {
    titles: [
        "No mooching until your tasks are done, remember? Go back to work!",
        "Hey, we distinctly recall that you wanted to do something before going there. Remember what it was?",
        "Sorry to interrupt, but there's one tiny insignificant detail. YOU GOTTA DO SOME WORK FIRST!",
        "Now, we are really, really sorry about this. Petrificus Totalus! Freeze!",
        "Aren't you forgetting something? Come again when your tasks are done!"
    ],
    subs: [
        "(You asked for it!)",
        "(This is how YOU wanted it!)",
        "(It won't hurt a bit, you know!)",
        "(They will still be there when you go back!)",
        "(And you know, using another browser now would be cheating!)"
    ],

    getRandomTitle: function () {
        var rand = Math.floor((Math.random() * (this.titles.length)));
        return this.titles[rand];
    },

    getRandomSub: function () {
        var rand = Math.floor((Math.random() * (this.subs.length)));
        return this.subs[rand];
    },

    generate: function () {
        $("#blockingTitle")[0].innerHTML = Blocking.getRandomTitle();
        $("#blockingSub")[0].innerHTML = Blocking.getRandomSub();
    }
};

$(document).ready(Blocking.generate);
