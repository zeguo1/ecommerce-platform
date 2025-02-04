import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from './Rating';
import Message from './Message';
import Loader from './Loader';
import { listProductDetails } from '../actions/productActions';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        返回
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} 条评价`}
                />
              </ListGroup.Item>
              <ListGroup.Item>价格: ¥{product.price}</ListGroup.Item>
              <ListGroup.Item>
                描述: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
          <ListGroup.Item>
            <Row>
              <Col>价格：</Col>
              <Col>
                <strong>¥{product.price}</strong>
                {product.isOnSale && (
                  <span className="text-danger ml-2">
                    促销价：¥{product.wechatPromotionPrice}
                  </span>
                )}
              </Col>
            </Row>
          </ListGroup.Item>

          {product.isWechatExclusive && (
            <ListGroup.Item className="bg-warning">
              微信小程序专属商品
            </ListGroup.Item>
          )}

          {product.specifications.length > 0 && (
            <ListGroup.Item>
              <h5>规格参数</h5>
              {product.specifications.map((spec, index) => (
                <div key={index}>
                  {spec.key}: {spec.value}
                </div>
              ))}
            </ListGroup.Item>
          )}

                <ListGroup.Item>
                  <Row>
                    <Col>库存:</Col>
                    <Col>
                      {product.countInStock > 0 ? '有货' : '缺货'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    加入购物车
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductDetails;
