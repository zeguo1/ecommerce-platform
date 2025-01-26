import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from './FormContainer';
import CheckoutSteps from './CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';
import { createOrder } from '../actions/orderActions';

const OrderCreate = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [paymentMethod, setPaymentMethod] = useState('微信支付');

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [history, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createOrder({
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
      shippingPrice: 0,
      totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    }));
    history.push('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>订单确认</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>选择支付方式</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='微信支付'
              id='WechatPay'
              name='paymentMethod'
              value='微信支付'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          继续
        </Button>
      </Form>
    </FormContainer>
  );
};

export default OrderCreate;
