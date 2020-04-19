import produce from 'immer';

// Auth de usuário
const initialState = {
  signed: false,
  loading: false,
  token: null,
  user: {},
};

export default function auth(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_REQUEST': {
        draft.loading = true;
        break;
      }

      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.user = action.payload.user;
        break;
      }

      case '@auth/SIGN_IN_FAILURE': {
        draft.token = null;
        draft.loading = false;
        draft.signed = false;
        break;
      }

      case '@auth/SIGN_OUT': {
        draft.token = null;
        draft.signed = false;
        draft.loading = false;
        draft.user = {};
        break;
      }

      default:
    }
  });
}
