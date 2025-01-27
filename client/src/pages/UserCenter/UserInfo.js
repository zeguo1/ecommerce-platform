import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import UserCenterNav from '../../components/UserCenterNav';

const UserInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      if (!user || !user.name || success) {
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar || '');
      }
    }
  }, [dispatch, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email, avatar }));
    setShowEditForm(false);
    setMessage('Profile updated successfully');
  };

  return (
    <div className="user-center-container">
      <UserCenterNav />
      <div className="user-info">
        <h2>User Information</h2>
        {message && <Message variant="success">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <div className="profile-overview">
          <div className="avatar-section">
            <img
              src={avatar || '/images/default-avatar.png'}
              alt="avatar"
              className="profile-avatar"
            />
            <button
              className="btn btn-light"
              onClick={() => setShowEditForm(!showEditForm)}
            >
              {showEditForm ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {showEditForm ? (
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              {user?.wechatOpenId && (
                <p className="text-success">
                  <i className="fab fa-weixin"></i> WeChat account connected
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
