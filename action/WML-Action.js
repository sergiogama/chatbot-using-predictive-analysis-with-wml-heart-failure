/**
*
* main() will be executed when this action be triggered
*
* @param Is the only way to pass parameters to an action, and it mus be a JSON
*
* @return Output of action and must be a JSON format
*
* TO TEST: {"AVGHEARTBEATSPERMIN":93,"PALPITATIONSPERDAY":22,"CHOLESTEROL":180,"BMI":23,"AGE":52,"SEX":"M","FAMILYHISTORY":"Y","SMOKERLASTFIVEYRS":"Y","EXERCISEMINPERWEEK":0}
*/
const request = require('request');
function main(params) {
    const getToken = () => {
        const options = {
            // us-south if the region of your service is Dallas
            url: "https://us-south.ml.cloud.ibm.com/v3/identity/token",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                // TODO: Replace "pass" with äpikey" from https://cloud.ibm.com/iam/apikeys. If you havent it already, create one.
                user: "apikey",
                pass: "<API KEY>"
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            request.get(options, (error, resp, body) => {
                if (error) reject(error);
                else {
                    resolve(body.token);
                }
            });
        });
    };

    return new Promise((resolve, reject) => {
        const body = {"input_data": [{fields: ["AVGHEARTBEATSPERMIN", "PALPITATIONSPERDAY", "CHOLESTEROL", "BMI", "AGE", "SEX", "FAMILYHISTORY", "SMOKERLAST5YRS", "EXERCISEMINPERWEEK"], 
                                      values: [[params.AVGHEARTBEATSPERMIN,params.PALPITATIONSPERDAY,params.CHOLESTEROL,params.BMI,params.AGE,params.SEX,params.FAMILYHISTORY,params.SMOKERLASTFIVEYRS,params.EXERCISEMINPERWEEK]]}]};

        // TODO: Create a acces token:
        // NOTE: you must set $API_KEY below using information retrieved from your IBM Cloud account.
        // curl --insecure -X POST --header "Content-Type: application/x-www-form-urlencoded" --header "Accept: application/json" --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" --data-urlencode "apikey=$API_KEY" "https://iam.ng.bluemix.net/identity/token"
        const _token = {"access_token":"<ACCESS TOKEN>"};

        getToken().then(token => {
            const options = {
                // TODO: Replace with DIRECT LINK END-POINT from API reference tab on Watson Machine Learning deployment, on Cloud Pack for Data (Watson Studio)
                url: "<API reference END-POINT URL>",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ` + _token.access_token
                },
                body: body,
                json: true
            };
            request.post(options, (error, resp, data) => {
                if (error) reject(error);
                else if (data.errors) {
                    resolve({
                        "err": true,
                        "result": data.errors[0].message
                    });
                }
                else {
                    resolve({
                        "err": false,
                        "params":params,
                        "result": data.predictions[0].values[0][0], 
                        "confidence": data.predictions[0].values[0][1] 
                    });
                }
            });
        }).catch(err => reject(err));
    });
}
