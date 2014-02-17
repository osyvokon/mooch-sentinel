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

    describe('GitHub plugin', function() {
        it('should get repositories for the user', function(done) {
            // TODO
            GitHub.initRepositories('fixtures/githubrepos.json', function() {
                expect(GitHub.repositories).to.be.a("Array");
                expect(GitHub.repositories).to.have.length(2);
                expect(GitHub.repositories[0]).to.be.equal("klout4j");
                expect(GitHub.repositories[1]).to.be.equal("mooch-sentinel");
            })
            done();
        });
        it('should get commits from repositories for the user', function(done) {
            // TODO
            done();
        });
        describe('GitHub commits parse', function() {
            // TODO
            it('should get last commit date', function(done) {
                // TODO
                done();
            });
            it('should set OK status', function(done) {
                // TODO
                done();
            });
        });
    });

})();
