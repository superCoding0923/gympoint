import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { FaClipboardCheck } from 'react-icons/fa';

import Loading from '~/components/Loading';
import Modal from '~/components/Modal';
import api from '~/services/api';

import { Container, EmptyList, HelpOrdersList } from './styles';

export default function HelpOrders() {
  const [orders, setOrders] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const modalRef = React.createRef();

  const loadOrders = async () => {
    const response = await api.get('help-orders');
    console.tron.log(response.data);

    setOrders(response.data);
    setLoading(false);
  };
  useEffect(() => {
    loadOrders();
  }, []);

  const handleAnswer = async answer => {
    modalRef.current.setIsComponentVisible(true);
    setLoading(true);
    try {
      await api.post(`/help-orders/${order.id}/answer`, { answer });

      toast.success('Resposta enviada com sucesso');
      loadOrders();
    } catch (err) {
      toast.error(
        (err.response && err.response.data.error) ||
          'Erro de comunicação com o servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = studentOrder => {
    setOrder(studentOrder);
    modalRef.current.setIsComponentVisible(true);
  };

  return (
    <Container>
      {loading ? (
        <Loading type="spinner" />
      ) : (
        <>
          <div>
            <h1>Pedidos de auxílio</h1>
          </div>
          {!orders.length ? (
            <EmptyList>
              <FaClipboardCheck size={50} color="#42cb59" />
              <p>Parabens! Todos os pedidos foram respondidos</p>
            </EmptyList>
          ) : (
            <HelpOrdersList>
              <li>
                <strong>ALUNO</strong>
              </li>
              {orders.map(o => (
                <li key={o.id}>
                  <span>{o.student.name}</span>
                  <button type="button" onClick={() => handleOpen(o)}>
                    responder
                  </button>
                </li>
              ))}
            </HelpOrdersList>
          )}
          <Modal handleAnswer={handleAnswer} ref={modalRef}>
            {order ? (
              <>
                <strong>PERGUNTA DO ALUNO</strong>
                <p>{order.question}</p>
              </>
            ) : (
              <h2>Carregando...</h2>
            )}
          </Modal>
        </>
      )}
    </Container>
  );
}
