var conventionalRecommendedBump = require('conventional-recommended-bump');
var conventionalChangelog = require('conventional-changelog');
var through = require('through2');
var shellJs = require('shelljs');
var semver = require('semver');
var path = require('path');
var fs = require('fs');
var mixin = function (src, dest) {
    Object.keys(dest).forEach(function (k) {
        src[k] = dest[k];
    });
    return src;
};

function changelog(opt, pkgPath, cb) {
    opt = opt || {};
    var pkgFolder = pkgPath || process.cwd();
    var changelogFile = path.resolve(pkgFolder, './CHANGELOG.md');
    shellJs.exec('touch ' + changelogFile);
    shellJs.exec('git add ' + changelogFile);
    conventionalChangelog(mixin({
        preset: 'angular',
        append: true
    }, opt))
        .pipe(through(function (chunk) {
            console.log('chunk', chunk.toString());
            var content = fs.readFileSync(changelogFile, {
                encoding: "utf8"
            });
            fs.writeFileSync(changelogFile, chunk.toString() + content, {
                encoding: "utf8",
                flag: "w"
            });
            cb && cb();
        }));
}
/**
 *
 * @param {Object} opt
 * @param {Object} opt.bump
 * @param {Object} opt.changelog
 * @param {String} opt.path
 * @param {Function} cb
 */
function release(opt, cb) {
    opt = opt || {};
    conventionalRecommendedBump(mixin({
        preset: 'angular'
    }, opt.bump || {}), function (err, releaseAs) {
        console.log("releaseAs",releaseAs);
        var pkgFolder = opt.path || process.cwd();
        var pkgPath = path.resolve(pkgFolder, 'package.json');
        var pkg = require(pkgPath);
        console.log("old pkg",pkg.version);
        pkg.version = semver.inc(pkg.version, releaseAs);
        console.log('pkg.version', pkg.version);
        shellJs.exec('git flow release start v' + pkg.version);
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t'), {
            encoding: "utf8"
        });
        changelog(opt.changelog, opt.path, function () {
            shellJs.exec('git commit -am "chore(release): v' + pkg.version + '"');
            shellJs.exec('git flow release finish v' + pkg.version + ' -m "release v' + pkg.version + '"');
            cb && cb();
        });
    });
}

module.exports = {
    release:release,
    changelog:changelog
};