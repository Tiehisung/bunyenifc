// utils/device-id.ts
export function getDeviceId(): string {
    if (typeof window === "undefined") return "";

    const KEY = "konjiehifc_device_id";

    let id = localStorage.getItem(KEY);

    if (!id) {
        id = crypto.randomUUID(); // creates secure unique identifier
        localStorage.setItem(KEY, id);
    }

    return id;
}
