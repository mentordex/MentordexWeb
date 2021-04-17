// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://localhost:3000',
  //API_ENDPOINT: 'http://18.218.99.213:3000',
  BLOG_API_ENDPOINT:'http://18.218.99.213/mentordex/blog/wp-json/wp/v2',
  TOKEN_NAME:"x-mentordex-auth-token",
  MESSGES:{
    "CHECKING-AUTHORIZATION":"Please Wait..",
    "LOGIN-SUCCESS":"You have loggedin successfully.",
    "LOGOUT-SUCCESS":"You are successfully logged out.",
    "REGISTERED-SUCCESSFULLY":"Great! Thank you for registering with us. Please verify your email and mobile number.",
    "PARENT-REGISTERED-SUCCESSFULLY":"Thank You for Registering!.",
    "RESEND-EMAIL-VERIFICATION":"The verification link has been sent to your email.",
    "RESEND-PHONE-VERIFICATION":"OTP has been sent to your phone.",
    "PHONE-VERIFICATION-SUCCESS":"Phone number has been verified successfully.",
    "EMAIL-SUCCESS":"Account is authorized. Please enter password more for login.",
    "EMAIL-AUTHORIZED":"Email has been authorized successfully.",
    "SAVING-INFO":"Saving information. Please Wait...",
    "PASSWORD-UPDATED":"Password has been updated successfully.",
    "EMAIL-SENT":"We have sent the password reset instructions to your email ID.",
    "PAYMENT-METHOD-SUCCESSFULL":"Your payment method added successfully.",
    "ADD-YOUR-BILLING-METHOD":"Add your billing method to send booking request to mentor.",
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
