# twilio_js_google_app_engine
Serverless sending custom SMS via twilio api and google app engine with google sheets and javascript


In order to send sms via twilo`s api, you need to:
*create a new google sheet inside your @gmail account (or G SUITE) like the one attached in this git repo..
  The first 2 rows are used for our variables and hedears.
*Next - create a new script for this Sheet (usually Instruments -> Script...).
 Fill your sheet with the AuthID and Password from Twilio API credentials, fill the sender name(max 8 chars) which will appear on the sms and fill the numbers in the first column starting with the country code only. The second column is the text that the number in the same row will receive.
 * Just run the function sendAll. Current version of this script works with up to 100 numbers because after that the script timeouts. Soon i will rewrite it to make it work with whatever number of sms you want to send.
* Afer function sendAll finishes you can run the function checkSMSstatusAll which will write the final status of each sms in the last column
