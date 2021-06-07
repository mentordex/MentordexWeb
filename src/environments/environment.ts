// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'http://localhost:3000',
  //API_ENDPOINT: 'https://api.mentordex.app',
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
    "BOOKING-REQUEST-SENT":"Your job request has been sent successfully.",
    "BOOKING-REQUEST-CANCELLED":"Your job request has been cancelled successfully.",
    "BOOKING-REQUEST-COMPLETED":"Your job has been marked as completed successfully.",
    "DEFAULT-CARD-UPDATE-SUCCESS":"Your default card updated successfully.",
    "DEFAULT-BANK-UPDATE-SUCCESS":"Your default account updated successfully.",
    "DEFAULT-CARD-REMOVED":"Your card has been removed successfully.",
    "DEFAULT-ACCOUNT-REMOVED":"Your account has been removed successfully.",
    "SUBSCRIPTION-SUCCESS":"Your plan has been activated successfully.",
    "SUBSCRIPTION-CANCEL":"Your plan has been cancelled successfully.",
    "SUBSCRIPTION-UPGRADED":"Your plan has been changed successfully.",
    "MENTOR-SAVED":"Mentor has been saved successfully.",
    "ADD-YOUR-BILLING-METHOD":"Add your billing method to send booking request to mentor.",
    "PROFILE-UPDATED":"Profile Updated Successfully.",
  },
  //social logins
  SOCIAL_LOGINS: {
    GOOGLE: {
      GOOGLE_0AUTH_CLIENT_ID: '433287314095-ii6cjlv1g0qc38hojjq0kbpmcodop14t.apps.googleusercontent.com',
      GOOGLE_0AUTH_CLIENT_SECRET:'us-6eJ-0e61VK5smDgsMbXJO'
    }
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
