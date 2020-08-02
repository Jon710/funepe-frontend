import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'funepe-localDB',
      storage,
      whitelist: ['auth', 'protocolo', 'compras', 'orcamentos'],
    },
    reducers
  );

  return persistedReducer;
};
