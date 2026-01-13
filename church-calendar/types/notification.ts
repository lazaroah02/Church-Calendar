export type DevicePushNotificationInfo = {
    device_name: string;
    fcm_token: string;
    timezone: string;
    platform: "android" | "ios" | "" | null;
    type: "fcm" | "apns" | "" | null;
    created_at?: string;
}