// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://18.218.99.213:3000',
  BLOG_API_ENDPOINT:'http://18.218.99.213/mentordex/blog/wp-json/wp/v2',
  TOKEN_NAME:"x-mentordex-auth-token",
  MESSGES:{
    "CHECKING-AUTHORIZATION":"Checking Authorization. Please Wait..",
    "LOGIN-SUCCESS":"You have loggedin successfully.",
    "LOGOUT-SUCCESS":"You have been loggedout successfully.",
    "REGISTERD-SUCCESSFULLY":"Account has been registered successfully. Please do login now.",
    "EMAIL-SUCCESS":"Account is authorized. Please enter password more for login.",
    "EMAIL-AUTHORIZED":"Email has been authorized successfully.",
    "SAVING-INFO":"Saving information. Please Wait...",
    "PASSWORD-UPDATED":"Password has been updated successfully.",
    "EMAIL-SENT":"Email has been sent successfully. Please check your inbox.",
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
