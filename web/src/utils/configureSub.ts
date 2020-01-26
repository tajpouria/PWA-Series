import { APIs } from "./apis";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const PUBIC_KEY = process.env.REACT_APP_PUBLIC_KEY as string;

export async function configureSubscription() {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();

    if (permission === "granted" && "serviceWorker" in navigator) {
      const swReg = await navigator.serviceWorker.ready;

      const subs = await swReg.pushManager.getSubscription();

      if (subs === null) {
        const newSub = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBIC_KEY)
        });

        await fetch(APIs.subs, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newSub)
        });
      }
    }
  }
}
