/*global describe, it */
'use strict';

(function () {
    describe('Codeforces.ru goal', function () {
        it('should extract solved challenges from codeforce.ru status page', function(done) {
            CodeForces.parseSubmissionsPage('fixtures/codeforces.html', function (submissions) {
                expect(submissions).to.be.a("Array");
                expect(submissions).not.to.be.empty;
                done();
            });
        });
    });

})();
