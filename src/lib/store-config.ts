import storeConfig from "../../store-config.json";

export type StoreConfig = {
  storeName: string;
  brandColor: string;
  currency: string;
  logoUrl: string;
  contact: {
    phone: string;
    email: string;
  };
};

const config = storeConfig as StoreConfig;

export default config;
