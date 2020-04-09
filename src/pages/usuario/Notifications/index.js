/* eslint-disable no-console */
/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Container, Badge, Modal, Button } from 'react-bootstrap';

import api from '../../../services/api';

import { Notification } from './styles';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const usuario = useSelector(state => state.usuario);
  console.log('selector', usuario);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    let c = 0;
    async function loadNotification() {
      const response = await api.get(`medico/notify/${usuario.codMed}`);
      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
        counter: notification.read === false ? (c += 1) : 0,
      }));

      setNotifications(data);
      setCount(c);
    }

    loadNotification();
  }, [usuario.codMed, count]);

  async function handleMarkAsRead(id) {
    await api.put(`medico/notify/update/${id}`);

    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
    let c = 0;
    setCount(c);
    notifications.map(notification =>
      notification.read === false ? setCount((c += 1)) : 0
    );
  }

  return (
    <Container>
      {/* <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="darkgreen" size={20} />
      </Badge> */}
      <Button variant="success" onClick={handleShow}>
        Notificações{' '}
        <Badge pill variant="warning">
          {count}
        </Badge>
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Notificações</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.map(notification =>
            notification.read === false ? (
              <Notification key={notification._id} unread={!notification.read}>
                <p>{notification.content}</p>
                <time>{notification.timeDistance}</time>
                {!notification.read === true ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Marcar como lida
                  </Button>
                ) : (
                  <Button size="sm" variant="success">
                    Notificação Lida
                  </Button>
                )}
                <hr />
              </Notification>
            ) : (
              ''
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
