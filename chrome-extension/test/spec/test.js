/*global describe, it */
'use strict';

(function () {
    describe('Codeforces.ru plugin', function () {
        it('should extract solved challenges from codeforce.ru status page', function(done) {
            CodeForces.parseSubmissionsPage('fixtures/codeforces.html', function (submissions) {
                expect(submissions).to.be.a("Array");
                expect(submissions).not.to.be.empty;
                expect(submissions).to.have.length(1);
                done();
            });
        });
        describe("submission description", function () {
          var submission;
          before(function(done) {
            CodeForces.parseSubmissionsPage('fixtures/codeforces.html', function (submissions) {
                expect(submissions).to.be.a("Array");
                expect(submissions).to.have.length(1);
                submission = submissions[0];
                done();
            });
          });

          it("should include submission id", function(done) {
            expect(submission).to.have.property("id", "4798493");
            done();
          });

          it("should include parsed datetime", function(done) {
            expect(submission).to.have.property("date");
            expect(submission.date.toUTCString()).to.be.equal("Tue, 15 Oct 2013 20:19:08 GMT");
            done();
          });

        });
    });

})();
