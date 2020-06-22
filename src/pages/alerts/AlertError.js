import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { showAlertErrorClose } from '../../redux/features/context/contextSlice';

export default function AlertError() {
  const { showAlertError, alertError } = useSelector(state => state.contexto);
  const dispatch = useDispatch();
  console.log(alertError);

  function handleCloseAlert() {
    dispatch(showAlertErrorClose({ showAlertError: false, alertError: '' }));
  }

  return (
    <Alert
      variant="danger"
      show={showAlertError}
      onClick={handleCloseAlert}
      dismissible
    >
      <Alert.Heading>Ops! Ocorreu um erro!</Alert.Heading>
      <p>{alertError}</p>
    </Alert>
  );
}
