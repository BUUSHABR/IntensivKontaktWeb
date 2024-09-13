const FakeAuthRepository = {
  isAuthenticated: false,

  signin(callback: VoidFunction) {
    FakeAuthRepository.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },

  signout(callback: VoidFunction) {
    FakeAuthRepository.isAuthenticated = false;
    setTimeout(callback, 100);
  },
  
};

export { FakeAuthRepository };
