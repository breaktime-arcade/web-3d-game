/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
if (typeof window !== 'undefined') {
  (() => {
    const coi = {
      shouldRegister: () => true,
      shouldDeregister: () => false,
      doCoep: () => true,
      coepCredentialless: () => false,
      ...window.coi
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          if (coi.shouldDeregister()) {
            registration.unregister();
          }
        }
      });

      if (coi.shouldRegister()) {
        navigator.serviceWorker.register(window.location.href).then(
          (reg) => {
            reg.addEventListener('updatefound', () => {
              window.location.reload();
            });
          },
          (err) => console.error('COI SW failed:', err)
        );
      }
    }
  })();
}
