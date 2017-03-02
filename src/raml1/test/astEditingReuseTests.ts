/// <reference path="../../../typings/main.d.ts" />
import index = require("../../index");
import assert = require("assert");
import ramlWrapper = require("../artifacts/raml10parser");
import jsyaml = require("../jsyaml/jsyaml2lowLevel");
import hl = require("../highLevelImpl");
import util = require("./test-utils");
import fs = require("fs");

testReuseByEditing("ASTReuseTests/test17/api.raml");

function testReuseByNode(content: string, specPath:string, reuseNode: index.IHighLevelNode): index.IHighLevelNode{
    var resolver = new jsyaml.FSResolverImpl();
    var fsResolver = {
        content: (path) => {
            if (path == specPath) {
                return content;
            }
            return resolver.content(path);
        },
        contentAsync: (path) => {
            return Promise.resolve("");
        }
    };
    try {
        var api = (<ramlWrapper.ApiImpl>index.loadRAMLSync(specPath, [], {
            fsResolver: fsResolver
        })).expand();

        var apiReuse = (<ramlWrapper.ApiImpl>index.loadRAMLSync(specPath, [], {
            reusedNode: reuseNode,
            fsResolver: fsResolver
        })).expand();

        var apiJSON = api.toJSON({rootNodeDetails: true});
        var apiReuseJSON = apiReuse.toJSON({rootNodeDetails: true});

        var diff = util.compare(apiJSON, apiReuseJSON);
        if (diff.length != 0) {
            console.warn("DIFFERENCE DETECTED FOR " + specPath);
            console.warn(diff.map(x=>x.message("actual", "expected")).join("\n\n"));
            console.warn(content);
            console.warn(JSON.stringify(diff, null, 2));
            assert(false);
        }
        reuseNode = api.highLevel();
        if (!isValidErrors(apiJSON["errors"]))
            throw new Error("Position error");
    } catch (err){
        console.error(err);
        console.error(content);
    }
    return reuseNode;
}

function testReuseByEditing(specPath:string) {

    var pathRes: string = util.data(specPath).replace(/\\/g,'/');

    var fileContent: string = fs.readFileSync(pathRes, "utf8");
    var contentBuffer: string = fileContent.substr(0, fileContent.indexOf("\n") + "\n".length);
    var prevNode = null;

    var words: string[] = fileContent.substr(contentBuffer.length).split(/(\s+)/);

    for (var i = 0; i < words.length; i++){
        contentBuffer+= words[i];
        prevNode = testReuseByNode(contentBuffer, pathRes, prevNode)
    }
}

function isValidErrors(errs: Object[]): Boolean{
    var  isValid: boolean = true;
    errs.forEach(e=>{
        if (e.hasOwnProperty("column"))
            if (e["column"] == undefined)
                isValid = false;
        if (e.hasOwnProperty("line"))
            if (e["line"] == undefined)
                isValid = false;
        if (e.hasOwnProperty("position"))
            if (e["position"] == undefined)
                isValid = false;
        if (e.hasOwnProperty("range")){
            if (e["range"].hasOwnProperty("end"))
                if (e["range"]["end"] == null)
                    isValid = false;
            if (e["range"].hasOwnProperty("start"))
                if (e["range"]["start"] == null)
                    isValid = false;
        }
    });

    return isValid;
}