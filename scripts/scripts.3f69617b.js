"use strict";angular.module("client1App",["oauth","ngCookies","ngResource","ngRoute","cfp.loadingBar","sticky"]).config(["$routeProvider",function(a){a.when("/access_token=:accessToken",{template:"",controller:["$location","AccessToken",function(a,b){var c=a.path().substr(1);b.setTokenFromString(c),a.path("/"),a.replace()}]}).when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/report/new",{templateUrl:"views/report.new.html",controller:"NewReportController"}).when("/report/:id",{templateUrl:"views/report.sections.html",controller:"ReportController"}).when("/myreport",{templateUrl:"views/myreport.html",controller:"MyReportController"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$http","$cookieStore","AccessToken","cfpLoadingBar",function(a,b,c,d,e){function f(a,b){var c;"js"===b?(c=document.createElement("script"),c.setAttribute("type","text/javascript"),c.setAttribute("src",a+"."+b)):"css"===b&&(c=document.createElement("link"),c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",a+"."+b)),"undefined"!=typeof c&&document.getElementsByTagName("head")[0].appendChild(c)}var g="rapports-app.";e.start(),a.API_SITE=$("oauth").attr("site"),c.put("API_SITE",$("oauth").attr("site")),c.get(g+"AccessToken")&&(b.defaults.headers.common.Authorization="Bearer "+c.get(g+"AccessToken")),c.get(g+"app")&&(a.app=c.get(g+"app")),c.get(g+"profile")&&(a.profile=c.get("profile")),c.get(g+"theme")&&f("themes/"+c.get(g+"theme"),"css"),a.$on("oauth:login",function(){e.start(),c.put(g+"AccessToken",d.get().access_token),b.defaults.headers.common.Authorization="Bearer "+d.get().access_token,b.get(a.API_SITE+"/api/me").success(function(b){c.put(g+"profile",b),a.profile=b,e.complete()}),b.get(a.API_SITE+"/api/info").success(function(b){c.put(g+"app",b),c.put(g+"theme",b.theme),a.app=b,f("themes/"+b.theme,"css")})}),a.$on("oauth:logout",function(){"ActiveXObject"in window&&document.execCommand("ClearAuthenticationCache",!1),a.profile={},a.app={},c.remove(g+"profile"),c.remove(g+"app"),c.remove(g+"API_SITE"),c.remove(g+"theme")}),e.complete()}]);var app=angular.module("client1App");app.factory("Item",["$rootScope","$resource",function(a,b){return b(a.API_SITE+"/item/:id",null,{update:{method:"PUT"}})}]);var app=angular.module("client1App");app.factory("QuarterReport",["$rootScope","$resource",function(a,b){return b(a.API_SITE+"/quarterreport/:id",null,{update:{method:"PUT"}})}]);var app=angular.module("client1App");app.factory("QuarterReportComment",["$rootScope","$resource",function(a,b){return b(a.API_SITE+"/quarterreportcomment/:id",null,{update:{method:"PUT"}})}]);var app=angular.module("client1App");app.controller("MainCtrl",["Item",function(a){console.log(a)}]);var app=angular.module("client1App");app.controller("NewReportController",["$scope","$location","QuarterReport",function(a,b,c){function d(){a.report=new c,c.query(function(a){console.log(a)})}d(),a.setReportType=function(b){a.report.type=b},a.setReportPeriod=function(b){a.report.period=b},a.setReportGroup=function(b){a.report.groupId=b},a.createReport=function(){return a.report.type?a.report.period?a.report.groupId?void a.report.$save(function(a){b.path("/report/"+a.id)}):window.alert("Veuillez choisir un groupe"):window.alert("Veuillez choisir une periode"):window.alert("Veuillez choisir un type de rapport")}}]);var app=angular.module("client1App");app.controller("ReportController",["$scope","$routeParams","cfpLoadingBar","QuarterReport","QuarterReportComment",function(a,b,c,d,e){function f(){c.start(),d.get({id:b.id},function(b){a.report=b,e.query({report:b.id},function(b){a.comments=b,c.complete()})}),a.sections=[{id:"securite",name:"Sécurité"},{id:"chaudieres",name:"Chaudières et utilité"},{id:"hydrogene",name:"Hydrogène"},{id:"paraxylene",name:"Paraxylène"},{id:"stdp",name:"STDP"},{id:"tours",name:"Tours d'eau de redroidissement"},{id:"divers",name:"Divers"},{id:"personnel",name:"Personnel"}],a.input={securite:"",chaudieres:"",hydrogene:"",paraxylene:"",stdp:"",tours:"",divers:"",personnel:""}}f(),a.addComment=function(b){if(""===a.input[b])return window.alert("Vous devez entrez du texte");c.start();var d=new e;d.text=a.input[b],d.section=b,d.report=a.report.id,d.$save(function(d){a.comments.push(d),a.input[b]="",document.getElementById(b).focus(),c.complete()})},a.deleteComment=function(b){window.confirm("Etes vous certain de vouloir supprimer cet élément?")&&(c.start(),e.delete({id:b.id},function(){a.comments.splice(a.comments.indexOf(b),1),c.complete()}))},a.editComment=function(b){c.start(),e.delete({id:b.id},function(d){a.comments.splice(a.comments.indexOf(b),1),a.input[d.section]=d.text,document.getElementById(d.section).focus(),c.complete()})}}]);var app=angular.module("client1App");app.controller("MyReportController",["$scope","$location","$rootScope","QuarterReport",function(a,b,c,d){function e(){d.query({createdBy:c.profile.account},function(b){a.reports=b})}e(),a.go=function(a){b.path(a)}}]);