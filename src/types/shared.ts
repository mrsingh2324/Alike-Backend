// Shared types for the server
export interface ContactInput {
    name: string;
    phone?: string;
    email?: string;
}

export enum PlatformType {
    IOS = 'ios',
    ANDROID = 'android',
    WEB = 'web',
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
}

export enum ChatType {
    SINGLE = 'single',
    DIRECT = 'direct',
    GROUP = 'group',
}

export enum OTPChannel {
    PHONE = 'phone',
    EMAIL = 'email',
}
