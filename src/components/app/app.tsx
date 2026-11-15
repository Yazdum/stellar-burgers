import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { selectIngredientsError, selectIngredientsLoading } from '@services/selectors';
import { fetchIngredients } from '@services/slices/ingredients';
import { checkUserAuth } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  const location = useLocation();
  const background = (location.state as { background?: Location } | null)?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {ingredientsError ? (
        <p className={`${styles.message} text text_type_main-medium`}>
          {ingredientsError}
        </p>
      ) : (
        <>
          <Routes location={background ?? location}>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/:number" element={<OrderPage />} />
            <Route path="/ingredients/:id" element={<IngredientPage />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/orders"
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
          {background && (
            <Routes>
              <Route path="/ingredients/:id" element={<IngredientModal />} />
              <Route path="/feed/:number" element={<OrderModal />} />
              <Route
                path="/profile/orders/:number"
                element={
                  <ProtectedRoute>
                    <OrderModal />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

const IngredientPage = (): React.JSX.Element => {
  return (
    <main className={styles.detailPageWrap}>
      <h2 className={`${styles.detailHeader} text text_type_main-large`}>
        Детали ингредиента
      </h2>
      <IngredientDetails />
    </main>
  );
};

const IngredientModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleClose = (): void => {
    void navigate(-1);
  };
  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderPage = (): React.JSX.Element => {
  const { number } = useParams();
  return (
    <main className={styles.detailPageWrap}>
      <h2 className={`${styles.detailHeader} text text_type_digits-default`}>
        #{number}
      </h2>
      <OrderInfo />
    </main>
  );
};

const OrderModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { number } = useParams();
  const handleClose = (): void => {
    void navigate(-1);
  };
  return (
    <Modal title={`#${number ?? ''}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

export default App;
