import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useVerifyMutation, useLogoutMutation } from '../slices/userApiSlice';
import Loader from '../components/shared/Loader';
import { toast } from 'react-toastify';
import { clearCredential } from '../slices/authSlice';

const REQUIRED_TOKEN_VERSION = 9;

const Layout = () => {
  const [appLoading, setAppLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verify] = useVerifyMutation();
  const [logout, { isLoading: logOutLoading }] = useLogoutMutation();

  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userEmail = useSelector((state) => state?.auth?.userInfo?.email);
  const userTokenVersion = useSelector(
    (state) => state?.auth?.userInfo?.tokenVersion
  );

  console.log("userEmail", userEmail)
  console.log("userTokenVersion", userTokenVersion)

  useEffect(() => {
    const resetToken = searchParams.get('resetpass');

    if (resetToken) {
      navigate(`/reset-password/${resetToken}`, { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const verifyCurrentUser = async () => {
      if (!userEmail) return;

      setAppLoading(true);

      try {
        await verify({ email: userEmail }).unwrap();
      } catch (error) {
        console.log(error?.data?.message || error);
        dispatch(clearCredential());
        navigate('/login', { replace: true });
      } finally {
        setAppLoading(false);
      }
    };

    // Uncomment only if you really want verification on layout mount.
    // verifyCurrentUser();
  }, [userEmail, verify, dispatch, navigate]);

  useEffect(() => {
    const forceLogoutIfNeeded = async () => {
      if (!userId) return;

      const invalidTokenVersion =
        userTokenVersion === undefined ||
        userTokenVersion === null ||
        Number(userTokenVersion) !== REQUIRED_TOKEN_VERSION;
        console.log("invalidTokenVersion", invalidTokenVersion)

      if (!invalidTokenVersion) return;

      try {
        await logout({}).unwrap();
      } catch (error) {
        console.log('Logout api failed:', error);
      } finally {
        dispatch(clearCredential());
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });        
      }
    };

    forceLogoutIfNeeded();
  }, [userId, userTokenVersion, logout, dispatch, navigate]);

  if (appLoading || logOutLoading) {
    return <Loader />;
  }

  if (!userEmail && !searchParams.get('resetpass')) {
    console.log('No user found, returning to login');
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;