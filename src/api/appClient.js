import { PRODUCTS } from "@/lib/products";

const emptyEntity = () => ({
  list: async () => [],
  get: async () => null,
  filter: async () => [],
  create: async (payload) => payload || {},
  update: async (_id, payload) => payload || {},
  delete: async () => ({})
});

const localProducts = [...PRODUCTS];

const productEntity = {
  list: async () => [...localProducts],
  get: async (id) => localProducts.find((product) => product.id === id) || null,
  filter: async (criteria = {}) => localProducts.filter((product) => Object.entries(criteria).every(([key, value]) => product[key] === value)),
  create: async (payload) => {
    const product = { id: `product-${Date.now()}`, ...payload };
    localProducts.push(product);
    return product;
  },
  update: async (id, payload) => {
    const index = localProducts.findIndex((product) => product.id === id);
    if (index < 0) return null;
    localProducts[index] = { ...localProducts[index], ...payload };
    return localProducts[index];
  },
  delete: async (id) => {
    const index = localProducts.findIndex((product) => product.id === id);
    if (index >= 0) localProducts.splice(index, 1);
    return {};
  },
};

export const appClient = {
  app: {
    getPublicSettings: async () => ({})
  },
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
    loginViaEmailPassword: async () => {},
    loginWithProvider: () => {},
    register: async () => {},
    verifyOtp: async () => ({ access_token: '' }),
    resendOtp: async () => {},
    resetPasswordRequest: async () => {},
    resetPassword: async () => {},
    setToken: () => {},
    isAuthenticated: () => false
  },
  entities: {
    Product: productEntity,
    Order: emptyEntity(),
    Review: emptyEntity(),
    WarrantyRegistration: emptyEntity()
  }
};

export default appClient;
