import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ListGroup, Card, Row, Col } from 'react-bootstrap';
import Message from './Message';
import Loader from './Loader';
import { payOrder } from '../actions/orderActions';

const Payment = ({ history }) => {
  const dispatch = useDispatch();

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;

  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (successPay) {
      history.push(`/order/${order._id}`);
    }
  }, [history, successPay, order]);

  const wechatPayHandler = () => {
    const paymentData = {
      orderId: order._id,
      paymentMethod: '微信支付',
      totalAmount: order.totalPrice
    };

    // 调用微信支付接口
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: 'your-app-id', // 从后端获取
        timeStamp: Date.now().toString(),
        nonceStr: '随机字符串', // 从后端获取
        package: 'prepay_id=预支付交易会话标识', // 从后端获取
        signType: 'MD5',
        paySign: '签名' // 从后端获取
      },
      (res) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          setPaymentResult({ success: true });
          dispatch(payOrder(order._id));
        } else {
          setPaymentResult({ success: false, message: res.err_msg });
        }
      }
    );
  };

  return (
    <>
      <h1>支付订单</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>支付方式</h2>
              <strong>微信支付</strong>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>订单金额</h2>
              ¥{order.totalPrice}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={loadingPay}
                  onClick={wechatPayHandler}
                >
                  {loadingPay ? '支付中...' : '立即支付'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          {paymentResult && !paymentResult.success && (
            <Message variant='danger'>支付失败: {paymentResult.message}</Message>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Payment;
