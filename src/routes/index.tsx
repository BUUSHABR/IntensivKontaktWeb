import type { RouteObject } from 'react-router-dom';
import LoginPage from 'pages/LoginPage';
import NotFoundPage from 'pages/NotFound';
import { DiashowPage } from 'pages/DiashowPage';
import ChangePassword from 'pages/User/ChangePassword';
import Logout from 'pages/User/Logout';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import NewsPage from '../pages/NewsPage';
import AuthPage from '../pages/AuthPage';
import RegisterPage from '../pages/RegisterPage';
import RegisterSuccessPage from '../pages/RegisterSuccessPage';
import MehrPage from '../pages/MehrPage';
import { OnboardingProvider } from '../components/Onboarding/OnboardingProvider';
import React, { Suspense } from 'react';
import Preloader from '../components/Preloader';
import ConfirmedOnboardingPage from '../pages/ConfirmedOnboardingPage';
import EmailConfirmedSuccessPage from '../pages/EmailConfirmedSuccessPage';
import Photo from '../pages/Photo';
import PhotoPreview from '../pages/PhotoPreview';
import Video from '../pages/Video';
import VideoPreview from '../pages/VideoPreview';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import LoginWithUnconfirmedEmailPage from '../pages/LoginWithUnconfirmedEmailPage';
import DeclinedOnboardingPage from '../pages/DeclinedOnboardingPage';
import PhoneConfirmPage from '../pages/PhoneConfirmPage';
import { RequireAuth } from '../hoc/RequireAuth';

const ZoomMeetingComponent = React.lazy(() => import('../pages/VideoCallPage'));

let routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <AuthPage />,
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/login-unconfirmed-email/:email', element: <LoginWithUnconfirmedEmailPage /> },
      { path: '/onboarding-confirmed', element: <ConfirmedOnboardingPage /> },
      { path: '/onboarding-failed', element: <DeclinedOnboardingPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/password-reset', element: <ResetPasswordPage /> },
      {
        path: '/register',
        children: [{ index: true, element: <RegisterPage /> }],
      },
      { path: 'register-success', element: <RegisterSuccessPage /> },
      { path: 'email-confirmed/:token', element: <EmailConfirmedSuccessPage /> },
      {
        path: 'phone-confirm',
        element: (
          <RequireAuth>
            <PhoneConfirmPage />
          </RequireAuth>
        ),
      },
      {
        path: '/news',
        element: (
          <RequireAuth>
            <OnboardingProvider>
              <NewsPage />
            </OnboardingProvider>
          </RequireAuth>
        ),
      },
      {
        path: '/mehr',
        element: (
          <RequireAuth>
            <OnboardingProvider>
              <MehrPage />
            </OnboardingProvider>
          </RequireAuth>
        ),
      },
      {
        path: '/video-call',
        element: (
          <RequireAuth>
            <Suspense fallback={<Preloader />}>
              <ZoomMeetingComponent />
            </Suspense>
          </RequireAuth>
        ),
      },

      {
        path: '/diashow',
        children: [
          {
            index: true,
            element: (
              <RequireAuth>
                <OnboardingProvider>
                  <DiashowPage />
                </OnboardingProvider>
              </RequireAuth>
            ),
          },
          {
            path: 'photo',
            children: [
              {
                index: true,
                element: (
                  <RequireAuth>
                    <Photo />
                  </RequireAuth>
                ),
              },
              { path: 'preview', element: <PhotoPreview /> },
            ],
          },
          {
            path: 'video',
            children: [
              {
                index: true,
                element: (
                  <RequireAuth>
                    <Video />
                  </RequireAuth>
                ),
              },
              { path: 'preview', element: <VideoPreview /> },
            ],
          },
        ],
      },
      {
        path: '/logout',
        element: (
          <RequireAuth>
            <Logout />
          </RequireAuth>
        ),
      },
      {
        path: '/change-password',
        element: (
          <RequireAuth>
            <ChangePassword />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export default routes;
