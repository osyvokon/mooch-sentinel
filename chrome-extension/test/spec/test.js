/*global describe, it */
'use strict';

(function () {
    describe('Codeforces.ru goal', function () {
        it('should extract solved challenges from codeforce.ru status page', function() {
            var submissions = CodeForces.parseSubmissionsPage('fixtures/codeforces.html');
            expect(submissions).to.be.a("Array");
            expect(submissions).to.be.not.empty();
        });
    });

})();
