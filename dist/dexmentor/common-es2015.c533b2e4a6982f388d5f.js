(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"pX/W":function(r,n,e){"use strict";e.d(n,"a",function(){return H});var c=e("fXoL"),o=e("ofXK");function t(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("",r.errorPrefix," is required.")}}function i(r,n){1&r&&(c.Yb(0),c.Oc(1,"Enter a valid email."),c.Vb(2,"br"),c.Xb())}function s(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("Minimum length is ",r.minLength,".")}}function a(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("Maximum length is ",r.maxLength,".")}}function b(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Pc(r.patternError)}}function u(r,n){1&r&&(c.Yb(0),c.Oc(1,"Password and confirm password do not match."),c.Vb(2,"br"),c.Xb())}function f(r,n){1&r&&(c.Yb(0),c.Oc(1,"Email do not exist in our system."),c.Vb(2,"br"),c.Xb())}function m(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("Minimum value is ",r.min,".")}}function g(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("Maximum value is ",r.max,".")}}function l(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("",r.errorPrefix," must contain at least 1 Letter in Capital Case.")}}function x(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("",r.errorPrefix," must contain at least 1 Letter in Small Case")}}function h(r,n){if(1&r&&(c.Yb(0),c.Oc(1),c.Vb(2,"br"),c.Xb()),2&r){const r=c.oc();c.Hb(1),c.Qc("",r.errorPrefix," must contain at least 1 special character.")}}function p(r,n){1&r&&(c.Yb(0),c.Oc(1,"Must contain at least 1 number."),c.Vb(2,"br"),c.Xb())}let H=(()=>{class r{constructor(){}ngOnInit(){console.log("errorPrefix",this.errorPrefix)}}return r.\u0275fac=function(n){return new(n||r)},r.\u0275cmp=c.Ob({type:r,selectors:[["app-form-validation-errors"]],inputs:{errorPrefix:"errorPrefix",minLength:"minLength",maxLength:"maxLength",min:"min",max:"max",minValue:"minValue",maxValue:"maxValue",patternError:"patternError",errors:"errors",isPrice:"isPrice",minAmount:"minAmount"},decls:13,vars:13,consts:[[4,"ngIf"]],template:function(r,n){1&r&&(c.Mc(0,t,3,1,"ng-container",0),c.Mc(1,i,3,0,"ng-container",0),c.Mc(2,s,3,1,"ng-container",0),c.Mc(3,a,3,1,"ng-container",0),c.Mc(4,b,3,1,"ng-container",0),c.Mc(5,u,3,0,"ng-container",0),c.Mc(6,f,3,0,"ng-container",0),c.Mc(7,m,3,1,"ng-container",0),c.Mc(8,g,3,1,"ng-container",0),c.Mc(9,l,3,1,"ng-container",0),c.Mc(10,x,3,1,"ng-container",0),c.Mc(11,h,3,1,"ng-container",0),c.Mc(12,p,3,0,"ng-container",0)),2&r&&(c.uc("ngIf",n.errors&&n.errors.required),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.email),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.minlength),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.maxlength),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.pattern),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.NoPassswordMatch),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.emailNotExist),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.min),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.max),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.hasCapitalCase),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.hasSmallCase),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.hasSpecialCharacters),c.Hb(1),c.uc("ngIf",n.errors&&n.errors.hasNumber))},directives:[o.l],styles:[""],changeDetection:0}),r})()}}]);