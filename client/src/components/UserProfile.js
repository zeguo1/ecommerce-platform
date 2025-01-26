import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import Loader from './Loader';
import Message from './Message';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!user || !user.name) {
      dispatch(getUserDetails('profile'));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('密码不匹配');
    } else {
      dispatch(updateUserProfile({ 
        id: user._id,
        name,
        email,
        password
      }));
    }
  };

  return (
    <div className="user-profile">
      <h2>用户资料</h2>
      {message && <Alert variant="danger">{message}</Alert>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">资料更新成功</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>姓名</Form.Label>
            <Form.Control
              type="text"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>邮箱地址</Form.Label>
            <Form.Control
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>密码</Form.Label>
            <Form.Control
              type="password"
              placeholder="请输入新密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>确认密码</Form.Label>
            <Form.Control
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            更新资料
          </Button>
        </Form>
      )}
    </div>
  );
};

export default UserProfile;
