/// <reference path="../../../typings/main.d.ts" />
import index = require("../../index");
import assert = require("assert");
import ramlWrapper = require("../artifacts/raml10parser");
import jsyaml = require("../jsyaml/jsyaml2lowLevel");
import hlimpl = require("../highLevelImpl");
import util = require("./test-utils");
import fs = require("fs");

describe('AST Editing Reuse Test Set',function() {
    this.timeout(15000);
    describe('Basic Tests', function () {

        it("Resource type", function () {
            testReuseByEditing("ASTReuseTests/test01/api.raml");
        });

        it("Super type", function () {
            testReuseByEditing("ASTReuseTests/test02/api.raml");
        });

        it("Additional properties for a response mime type", function () {
            testReuseByEditing("ASTReuseTests/test03/api.raml");
        });

        it("Uri parameter facet value", function () {
            testReuseByEditing("ASTReuseTests/test04/api.raml");
        });

        it("Resource description", function () {
            testReuseByEditing("ASTReuseTests/test05/api.raml");
        });

        it("Header name in the method", function () {
            testReuseByEditing("ASTReuseTests/test06/api.raml");
        });

        it("Trait parameter value", function () {
            testReuseByEditing("ASTReuseTests/test07/api.raml");
        });

        it("Method securedBy value", function () {
            testReuseByEditing("ASTReuseTests/test08/api.raml");
        });

        it("Resource annotation", function () {
            testReuseByEditing("ASTReuseTests/test09/api.raml");
        });

        it("Resource type annotation for a resource with the same annotation", function () {
            testReuseByEditing("ASTReuseTests/test10/api.raml");
        });

        it("Resource type: method response change 1", function () {
            testReuseByEditing("ASTReuseTests/test11/api.raml");
        });

        it("Inherited method", function () {
            testReuseByEditing("ASTReuseTests/test12/api.raml");
        });

        it("Resource type method trait content", function () {
            testReuseByEditing("ASTReuseTests/test13/api.raml");
        });

        it("Resource type parameter name", function () {
            testReuseByEditing("ASTReuseTests/test14/api.raml");
        });

        it("Object annotation", function () {
            testReuseByEditing("ASTReuseTests/test15/api.raml");
        });

        it("Property declaration type", function () {
            testReuseByEditing("ASTReuseTests/test16/api.raml");
        });

        it("Property declaration type", function () {
            testReuseByEditing("ASTReuseTests/test17/api.raml");
        });

        it("Resource type: supertype", function () {
            testReuseByEditing("ASTReuseTests/test18/api.raml");
        });

        it('Should parse simple resource type with request body', function(){
            testReuseByEditing('parser/resourceType/resType01.raml');
        });

        it('Should parse simple resource type with response body', function(){
            testReuseByEditing('parser/resourceType/resType02.raml');
        });

        it('Should parse resource type with response body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType03.raml');
        });

        it('Should parse resource type with request body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType04.raml');
        });

        it('Should parse resource type with uri parameters', function(){
            testReuseByEditing('parser/resourceType/resType05.raml');
        });

        it('Should parse applying resource type with uri parameters', function(){
            testReuseByEditing('parser/resourceType/resType06.raml');
        });

        it('Should parse resource inherited from simple resource type with request body', function(){
            testReuseByEditing('parser/resourceType/resType07.raml');
        });

        it('Should parse resource inherited from simple resource type with response body', function(){
            testReuseByEditing('parser/resourceType/resType08.raml');
        });

        it('Should parse resource inherited from resource type with response body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType09.raml');
        });

        it('Should parse resource inherited from resource type with request body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType10.raml');
        });

        it('Should parse schema item as parameter', function(){
            testReuseByEditing('parser/resourceType/resType17.raml');
        });

        it('Should parse type item as parameter', function(){
            testReuseByEditing('parser/resourceType/resType18.raml');
        });

        it('Should fail on parameter non exist value', function(){
            testReuseByEditing('parser/resourceType/resType19.raml');
        });

        it('Should parse all resource types methods defined in the HTTP version 1.1 specification [RFC2616] and its extension, RFC5789 [RFC5789]', function(){
            testReuseByEditing('parser/resourceType/resType20.raml');
        });

        it('Should parse resource type method with response body', function(){
            testReuseByEditing('parser/resourceType/resType15.raml');
        });

        it('Should parse resource type method with request body.', function(){
            testReuseByEditing('parser/resourceType/resType16.raml');
        });

        it('New methods test 0.8.', function(){
            testReuseByEditing('parser/resourceType/resType11.raml');
        });

         it('New methods test 1.0.', function(){
             testReuseByEditing('parser/resourceType/resType12.raml');
         });

        it('Disabled body test 0.8.', function(){
            testReuseByEditing('parser/resourceType/resType13.raml');
        });

         it('Disabled body test 1.0.', function(){
             testReuseByEditing('parser/resourceType/resType14.raml');
         });
    });
});

function testReuseByNode(content: string, specPath:string, reuseNode: index.IHighLevelNode): index.IHighLevelNode{
    var resolver = new jsyaml.FSResolverImpl();
    var isValid: boolean = true;
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
            isValid = false;
        }
        reuseNode = api.highLevel();
        if (!isValidErrors(apiJSON["errors"]))
            throw new Error("Position error");
    } catch (err){
        console.error(err);
        console.error(content);
    }
    assert(isValid);
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