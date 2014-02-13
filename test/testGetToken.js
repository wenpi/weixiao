var crypto = require('crypto');

function getUserToken(userId) {
    var shasum = crypto.createHash('md5');
    var key = (new Date()).getTime();
    shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + userId);
    var token = shasum.digest('hex');
    return {
        'wexkey': key,
        'wextoken': token,
    }
}

console.info(getUserToken('02b3213c-c4ba-4b7b-be4b-8d751f8b305e'));