import createInstance from "./instance";

export default function testAccess(token: string | null) {
    return new Promise((resolve, reject) => {
        if(token == null)
            resolve("C");

        const instance = createInstance('https://v35jlmhn2d.execute-api.us-east-2.amazonaws.com/Initial');

        instance.post('/test-access', {token: token}).then(res => {
            const accessLevel = res.data.body.access_level;

            resolve(accessLevel);
        }).catch(err => {
            reject(err);
        })
    });
}