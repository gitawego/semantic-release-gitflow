'use strict';
var child = require('child_process');
var release = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('release', function () {
    before(function (done) {
        shell.cd('test');
        shell.exec('git init');
        shell.exec('git flow init -d');
        writeFileSync('test1', '');
        shell.exec('git add --all && git commit -m"chore: first commit"');
        writeFileSync('test2', '');
        // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
        child.exec('git add --all && git commit -m"feat: amazing new module\n\nBREAKING CHANGE: Not backward compatible."', function () {
            writeFileSync('test3', '');
            shell.exec('git add --all && git commit -m"fix($compile): avoid a bug"');
            writeFileSync('test4', '');
            shell.exec('git add --all && git commit -m"perf(ngOptions): make it faster"');
            writeFileSync('test5', '');
            shell.exec('git add --all && git commit -m"revert(ngOptions): make it faster"');

            done();
        });
    });

    after(function () {
        shell.cd('../');
    });


    it('should work if there is a semver tag', function (done) {
        var i = 0;

        shell.exec('git tag v1.0.0');
        writeFileSync('test6', '');
        shell.exec('git add --all && git commit -m"feat: some more features"');
        release(null,function(){
            done();
        });

    });

});
