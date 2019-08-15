/**
  *
  * main() will be executed when this action be triggered
  *
  * @param Is the only way to pass parameters to an action, and it mus be a JSON
  *
  * @return Output of action and must be a JSON format
  *
  * To test: {"AVGHEARTBEATSPERMIN":93,"PALPITATIONSPERDAY":22,"CHOLESTEROL":180,"BMI":23,"AGE":52,"SEX":"M","FAMILYHISTORY":"Y","SMOKERLAST5YRS":"Y","EXERCISEMINPERWEEK":0}
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
                // TODO: Substituir com USERNAME e PASSWORD do serviço de Watson Machine Learning
                user: "apikey",
                pass: "<API Key>"
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
        const body = {fields: ["AVGHEARTBEATSPERMIN", "PALPITATIONSPERDAY", "CHOLESTEROL", "BMI", "AGE", "SEX", "FAMILYHISTORY", "SMOKERLAST5YRS", "EXERCISEMINPERWEEK"], 
      values: [[params.AVGHEARTBEATSPERMIN,params.PALPITATIONSPERDAY,params.CHOLESTEROL,params.BMI,params.AGE,params.SEX,params.FAMILYHISTORY,params.SMOKERLAST5YRS,params.EXERCISEMINPERWEEK]]};
        
        // TODO: Create a acces token:
        // curl -X POST 'https://iam.cloud.ibm.com/identity/token' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<WML API Key>'
        const _token = {access_token:"<Access Token>"};

        getToken().then(token => {
            const options = {
                // TODO: Substituir com SCORING END-POINT do Deployment do Modeler flow on Watson Studio
                url: "https://us-south.ml.cloud.ibm.com/v3/wml_instances/4eda26fa-04aa-435a-be1b-0ce9c0f04057/deployments/fb726ac7-d0c0-44fc-b4cb-59adf763c0c0/online",
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
                        "Resultado": data.errors[0].message
                    });
                }
                else {
                    resolve({
                        "err": false,
                        "Result": data.values[0][0],
                        "Confidence": data.values[0][1]
                    });
                }
            });
        }).catch(err => reject(err));
    });
}
