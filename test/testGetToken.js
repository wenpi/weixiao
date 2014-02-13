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

console.info(getUserToken('3d6a1441-b4f5-445c-a27f-02a8667ad293'));