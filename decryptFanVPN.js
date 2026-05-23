// Please use the lastest PRIVATE_KEY.
// This PRIVATE_KEY was extracted on 2026.05.24.

async function decryptFanVPN(configObj) {
    const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCUHMdMJFSzOnuO
OIRY3UZcWTXfCexZ15UOXjZB8fvgLxyvTN5gTh+Wo6SNb48ojuIw/p3fltMom3ZW
eyeKD5QB/sL+LgWHs10GrCE73TYwsmhdXUCyZhZX7VK8meqsFBBf7SDTPcJ6lfup
XsFstxQWV9nq2FQAQLSzUVU46KGjADKV7cEwamQ+C+0ix74EfDYvaZohfUtHEMie
MB5xYePJnxPS1qqP4Ftsgco5/hZfscsf9lR4+LSDAj+krNRo2j6Kto030Kxrwymi
7KbfVvlXujYsoh+LlhEXEAxHYUTbllKvcKRWvEiMNkW64+lFMclVIkHs0KjRPrOY
0nfy0iVJAgMBAAECggEAQdrP5HOM84nv0OshMW/lbn89/Dcpz0KTJGnQXx7seqAH
9YvMnm5uDikhq79sHED3oog7guRJbBc/lTE6AeFuUjrH0YN98vnVxXc4aakwhJN2
4vhpIUlR6vN7I5+eH7fmFfjV7QbbV20jkgmvIBsBA/Q40Pox01Dx538k0OJiqBnr
h+jdL99lURPYkG3/mfT3R2pG+vIP2PYydW0pi87f6AK4pxFZnAF82MuGcCM+Byr0
ga8/pSV4wmkU+kezK4P6RfbSi4tuUszvaBWcczAgqEN3yltYwN0v/JSk2oHcBSx4
phJV/RGGGg/IRHt4d0zi3PRfTrx2YI7AEgc1TCVSxwKBgQDMTdr6j64IMtWM45TG
QMcwtZLDutdCpvkVBGtpzdj3DWP2ZYAWQoO1ko1T2IOKkNWIXO3PEmX2fnTvyERk
XPQeiLf085TNnfnzKvCG8DrQwHZqdb2Wt1M2FJkYvxd14CALK2l6yHUEAyNveUoD
VcmtOapYvCndo9d7JpmoiCzelwKBgQC5lwKqyhwLEvbKegMMSZKrL5AsdKbp/r/r
Vovgw2wBhtmj7Gr8bnkS9nAmI3mETCFolxmbDHPK2Yt6D/+LtIcOdalI6Ox93nHx
IV2kPQff5czWa78IiiGPeJYrp/ZBZK33egWJWPAsQsZAms0GXAQ9vSomUUBi8rUT
Lkc03c13HwKBgQCsSqv0yd5WA6ib3ADHADH7HeTbM2H9T5qW4tdCrtnd3mkCja5r
F0TDhwewQdMMs/+fs97I1hcuvI4Y+KbUjJ9CcMHRzOkcTbFQJFIbOdQf3279cLWl
uIxv+wbxG5XJTm03fjDB3vLvo0Xq6DpGfb5KW2sQ0f3scBN0Q6Upv003mQKBgFPk
oG8Fx6F15BtpBiGyzFsXuAtwe9dAsg6246opjJQwGgfQohgT9CUPQ2jqFk8oft2h
mBCPk3Q53KPDwZesdnSh2XE84VKQkF8Y3xSUBhA+99ZhhExe7IbHUtLPLTEoSr+Y
6BHLI15OnQGtOErMo5oo/XmutvVDk3jlLYkHTo6vAoGBAKaT2qIDOStdCrwRbvD1
SF/pcEytM0rQhiJYmBXKeayUsICTxnSdixb42BSRDTL14F6Jzv2GcGRh80Jx1DVL
6Dmv27MEXx3OnCiHmTCHi3CxqKXhOvJGQCbtLLjluP6pAvQCZ7s3KB6/zS4v/fIv
zygLJrETnjWa1iAMPLnIB9lB
-----END PRIVATE KEY-----`;

    const b64ToBuf = (b64) => Uint8Array.from(atob(b64.replace(/\s+/g, '')), c => c.charCodeAt(0)).buffer;

    const rsaKey = await crypto.subtle.importKey(
        'pkcs8',
        b64ToBuf(PRIVATE_KEY.replace(/-----[^-]+-----/g, '')),
        { name: 'RSA-OAEP', hash: 'SHA-1' },
        false,
        ['decrypt']
    );

    const aesKeyBuf = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        rsaKey,
        b64ToBuf(configObj.key)
    );

    const aesKey = await crypto.subtle.importKey(
        'raw', aesKeyBuf, { name: 'AES-CBC' }, false, ['decrypt']
    );

    const decryptedBuf = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: b64ToBuf(configObj.iv) },
        aesKey,
        b64ToBuf(configObj.data)
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuf));
}
