import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Message from './Message';
import Loader from './Loader';
import { getOrderDetails } from '../actions/orderActions';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>订单 #{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>收货地址</h2>
              <p>
                <strong>姓名: </strong> {order.shippingAddress.name}
              </p>
              <p>
                <strong>电话: </strong> {order.shippingAddress.phone}
              </p>
              <p>
                <strong>地址: </strong> {order.shippingAddress.address}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>支付方式</h2>
              <p>
                <strong>方式: </strong> {order.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>订单商品</h2>
              {order.orderItems.length === 0 ? (
                <Message>您的订单为空</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} × ¥{item.price} = ¥{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>订单摘要</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>商品总价</Col>
                  <Col>¥{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>运费</Col>
                  <Col>¥{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>总计</Col>
                  <Col>¥{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetails;
