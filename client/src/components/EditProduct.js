import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { updateProduct } from '../actions/productActions';
import Loader from './Loader';
import Message from './Message';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    images: [],
    brand: '',
    category: '',
    countInStock: 0,
    specifications: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    shippingClass: '',
    isOnSale: false,
    saleStartDate: '',
    saleEndDate: '',
    isFeatured: false,
    isWechatExclusive: false,
    wechatPromotionPrice: ''
  });

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success } = productUpdate;

  useEffect(() => {
    if (success) {
      navigate('/admin/productlist');
    } else {
      if (!product.name || product._id !== id) {
        dispatch(getProductDetails(id));
      } else {
        setProduct(product);
      }
    }
  }, [dispatch, id, product, success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct(product));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...product.specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value
    };
    setProduct(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  };

  const addSpecification = () => {
    setProduct(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  return (
    <div className="edit-product">
      <h2>编辑商品</h2>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={handleSubmit}>
          {/* 基本商品信息 */}
          <Form.Group controlId="name">
            <Form.Label>商品名称</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>描述</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>价格</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="originalPrice">
            <Form.Label>原价</Form.Label>
            <Form.Control
              type="number"
              name="originalPrice"
              value={product.originalPrice}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="brand">
            <Form.Label>品牌</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>分类</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="countInStock">
            <Form.Label>库存数量</Form.Label>
            <Form.Control
              type="number"
              name="countInStock"
              value={product.countInStock}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* 规格参数 */}
          <Form.Group controlId="specifications">
            <Form.Label>规格参数</Form.Label>
            {product.specifications.map((spec, index) => (
              <div key={index} className="specification-row">
                <Form.Control
                  type="text"
                  placeholder="参数名"
                  value={spec.key}
                  onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="参数值"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                />
              </div>
            ))}
            <Button type="button" onClick={addSpecification}>
              添加规格
            </Button>
          </Form.Group>

          {/* 物流信息 */}
          <Form.Group controlId="weight">
            <Form.Label>重量 (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={product.weight}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="dimensions">
            <Form.Label>尺寸 (cm)</Form.Label>
            <div className="dimensions-input">
              <Form.Control
                type="number"
                placeholder="长"
                value={product.dimensions.length}
                onChange={(e) => setProduct(prev => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    length: e.target.value
                  }
                }))}
              />
              <Form.Control
                type="number"
                placeholder="宽"
                value={product.dimensions.width}
                onChange={(e) => setProduct(prev => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    width: e.target.value
                  }
                }))}
              />
              <Form.Control
                type="number"
                placeholder="高"
                value={product.dimensions.height}
                onChange={(e) => setProduct(prev => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    height: e.target.value
                  }
                }))}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="shippingClass">
            <Form.Label>物流类别</Form.Label>
            <Form.Control
              type="text"
              name="shippingClass"
              value={product.shippingClass}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 促销信息 */}
          <Form.Group controlId="isOnSale">
            <Form.Check
              type="checkbox"
              label="是否促销"
              name="isOnSale"
              checked={product.isOnSale}
              onChange={handleChange}
            />
          </Form.Group>

          {product.isOnSale && (
            <>
              <Form.Group controlId="saleStartDate">
                <Form.Label>促销开始时间</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="saleStartDate"
                  value={product.saleStartDate}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="saleEndDate">
                <Form.Label>促销结束时间</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="saleEndDate"
                  value={product.saleEndDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}

          {/* 特色商品 */}
          <Form.Group controlId="isFeatured">
            <Form.Check
              type="checkbox"
              label="是否特色商品"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 微信小程序相关 */}
          <Form.Group controlId="isWechatExclusive">
            <Form.Check
              type="checkbox"
              label="是否微信小程序专属"
              name="isWechatExclusive"
              checked={product.isWechatExclusive}
              onChange={handleChange}
            />
          </Form.Group>

          {product.isWechatExclusive && (
            <Form.Group controlId="wechatPromotionPrice">
              <Form.Label>微信小程序促销价</Form.Label>
              <Form.Control
                type="number"
                name="wechatPromotionPrice"
                value={product.wechatPromotionPrice}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Button type="submit" variant="primary">
            更新商品
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditProduct;
