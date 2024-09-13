const AuthRepository = {
  isAuthenticated: false,

  signin(callback: VoidFunction) {
    AuthRepository.isAuthenticated = true;
    setTimeout(callback, 100);
  },

  signout(callback: VoidFunction) {
    AuthRepository.isAuthenticated = false;
    setTimeout(callback, 100);
  },
  
};

export { AuthRepository };
