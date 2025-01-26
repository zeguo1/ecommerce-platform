import React, { useState } from 'react';

function AddProduct() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('originalPrice', product.originalPrice);
    formData.append('brand', product.brand);
    formData.append('category', product.category);
    formData.append('countInStock', product.countInStock);
    formData.append('specifications', JSON.stringify(product.specifications));
    formData.append('weight', product.weight);
    formData.append('dimensions', JSON.stringify(product.dimensions));
    formData.append('shippingClass', product.shippingClass);
    formData.append('isOnSale', product.isOnSale);
    formData.append('saleStartDate', product.saleStartDate);
    formData.append('saleEndDate', product.saleEndDate);
    formData.append('isFeatured', product.isFeatured);
    formData.append('isWechatExclusive', product.isWechatExclusive);
    formData.append('wechatPromotionPrice', product.wechatPromotionPrice);
    
    product.images.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('商品添加成功！');
        setProduct({
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
      } else {
        const errorData = await response.json();
        alert(`错误: ${errorData.message || '添加商品失败'}`);
      }
    } catch (error) {
      console.error('添加商品时出错:', error);
      alert('添加商品时发生错误');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct(prev => ({
      ...prev,
      images: files
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
    <div className="add-product">
      <h2>添加新商品</h2>
      <form onSubmit={handleSubmit}>
        {/* 基本商品信息 */}
        <div className="form-group">
          <label>商品名称</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>价格</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>原价</label>
          <input
            type="number"
            name="originalPrice"
            value={product.originalPrice}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>品牌</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>分类</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>库存数量</label>
          <input
            type="number"
            name="countInStock"
            value={product.countInStock}
            onChange={handleChange}
            required
          />
        </div>

        {/* 商品图片 */}
        <div className="form-group">
          <label>商品图片</label>
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />
        </div>

        {/* 规格参数 */}
        <div className="form-group">
          <label>规格参数</label>
          {product.specifications.map((spec, index) => (
            <div key={index} className="specification-row">
              <input
                type="text"
                placeholder="参数名"
                value={spec.key}
                onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="参数值"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addSpecification}>
            添加规格
          </button>
        </div>

        {/* 物流信息 */}
        <div className="form-group">
          <label>重量 (kg)</label>
          <input
            type="number"
            name="weight"
            value={product.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>尺寸 (cm)</label>
          <div className="dimensions-input">
            <input
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
            <input
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
            <input
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
        </div>

        <div className="form-group">
          <label>物流类别</label>
          <input
            type="text"
            name="shippingClass"
            value={product.shippingClass}
            onChange={handleChange}
          />
        </div>

        {/* 促销信息 */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isOnSale"
              checked={product.isOnSale}
              onChange={handleChange}
            />
            是否促销
          </label>
        </div>

        {product.isOnSale && (
          <>
            <div className="form-group">
              <label>促销开始时间</label>
              <input
                type="datetime-local"
                name="saleStartDate"
                value={product.saleStartDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>促销结束时间</label>
              <input
                type="datetime-local"
                name="saleEndDate"
                value={product.saleEndDate}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* 特色商品 */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
            />
            是否特色商品
          </label>
        </div>

        {/* 微信小程序相关 */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isWechatExclusive"
              checked={product.isWechatExclusive}
              onChange={handleChange}
            />
            是否微信小程序专属
          </label>
        </div>

        {product.isWechatExclusive && (
          <div className="form-group">
            <label>微信小程序促销价</label>
            <input
              type="number"
              name="wechatPromotionPrice"
              value={product.wechatPromotionPrice}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit">添加商品</button>
      </form>
    </div>
  );
}

export default AddProduct;
