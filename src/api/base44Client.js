const emptyEntity = () => ({
  list: async () => [],
  get: async () => null,
  filter: async () => [],
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
});

export const base44 = {
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
    Product: emptyEntity(),
    Order: emptyEntity(),
    Review: emptyEntity(),
    WarrantyRegistration: emptyEntity()
  }
};
