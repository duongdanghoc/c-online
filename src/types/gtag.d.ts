declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js",
      targetOrAction: string | Date,
      parameters?: {
        send_to?: string;
        transaction_id?: string;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

export {};
