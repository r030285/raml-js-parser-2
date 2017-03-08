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

        it('Parse simple resource type with request body', function(){
            testReuseByEditing('parser/resourceType/resType01.raml');
        });

        it('Parse simple resource type with response body', function(){
            testReuseByEditing('parser/resourceType/resType02.raml');
        });

        it('Parse resource type with response body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType03.raml');
        });

        it('Parse resource type with request body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType04.raml');
        });

        it('Parse resource type with uri parameters', function(){
            testReuseByEditing('parser/resourceType/resType05.raml');
        });

        it('Parse applying resource type with uri parameters', function(){
            testReuseByEditing('parser/resourceType/resType06.raml');
        });

        it('Parse resource inherited from simple resource type with request body', function(){
            testReuseByEditing('parser/resourceType/resType07.raml');
        });

        it('Parse resource inherited from simple resource type with response body', function(){
            testReuseByEditing('parser/resourceType/resType08.raml');
        });

        it('Parse resource inherited from resource type with response body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType09.raml');
        });

        it('Parse resource inherited from resource type with request body inherited from user defined type', function(){
            testReuseByEditing('parser/resourceType/resType10.raml');
        });

        it('Parse schema item as parameter', function(){
            testReuseByEditing('parser/resourceType/resType17.raml');
        });

        it('Parse type item as parameter', function(){
            testReuseByEditing('parser/resourceType/resType18.raml');
        });

        it('Should fail on parameter non exist value', function(){
            testReuseByEditing('parser/resourceType/resType19.raml');
        });

        it('Parse all resource types methods defined in the HTTP version 1.1 specification [RFC2616] and its extension, RFC5789 [RFC5789]', function(){
            testReuseByEditing('parser/resourceType/resType20.raml');
        });

        it('Parse resource type method with response body', function(){
            testReuseByEditing('parser/resourceType/resType15.raml');
        });

        it('Parse resource type method with request body.', function(){
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

        it('Parse trait with header and validate it', function(){
            testReuseByEditing('parser/trait/trait01.raml');
        });

        it('Parse trait with query parameter and validate it', function(){
            testReuseByEditing('parser/trait/trait02.raml');
        });

        it('Parse trait with body', function(){
            testReuseByEditing('parser/trait/trait03.raml');
        });

        it('Parse traits with parameters', function(){
            testReuseByEditing('parser/trait/trait04.raml');
        });

        it('Parse traits with boolean parameters', function(){
            testReuseByEditing('parser/trait/trait05.raml');
        });

        it('Parse traits with number parameters', function(){
            testReuseByEditing('parser/trait/trait06.raml');
        });

        it('Parse object properties',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType01.raml');
        });

        it('Parse minimum number of properties',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType02.raml');
        });

        it('Parse maximum number of properties',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType03.raml');
        });

        it('Parse property required option',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType04.raml');
        });

        it('Parse property default option',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType06.raml');
        });

        it('Parse object types that inherit from other object types',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType07.raml');
        });

        it('Parse object inherit from more than one type',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType08.raml');
        });

        it('Parse shortcut scalar type property declaration',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType09.raml');
        });

        it('Parse maps type declaration',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType10.raml');
        });

        it('Parse restricting the set of valid keys by specifying a regular expression',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType11.raml');
        });

        it('Should not parse alternatively use additionalProperties',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType12.raml');
        });

        it('Parse inline type expression gets expanded to a proper type declaration',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypes/oType14.raml');
        });

        it('Parse array of scalar types declaration',function(){
            testReuseByEditing('ASTReuseTests/library/arrayTypes/aType01.raml');
        });

        it('Parse array of complex types declaration',function(){
            testReuseByEditing('ASTReuseTests/library/arrayTypes/aType02.raml');
        });

        it('Parse type inherited from several user defined types declaration',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypeInheritance/oti02.raml');
        });

        it('Parse type inherited from several user defined types shortcut declaration',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypeInheritance/oti03.raml');
        });

        it('Parse inheritance which should works in the types and in the mimeTypes',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypeInheritance/oti04.raml');
        });

        it('Should check that does not allowed to specify current type or type that extends current while declaring property of current type',function(){
            testReuseByEditing('ASTReuseTests/library/objectTypeInheritance/oti07.raml');
        });

        it('Parse included json schema',function(){
            testReuseByEditing('ASTReuseTests/library/externalTypes/eType01.raml');
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