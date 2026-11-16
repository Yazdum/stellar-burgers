import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({
  userName,
  pathname,
}: TAppHeaderUIProps): React.JSX.Element => {
  const isConstructorActive = pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </Link>
          <Link
            to="/feed"
            className={`${styles.link} ${isFeedActive ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>
        <Link className={styles.logo} to="/">
          <Logo className="" />
        </Link>
        <Link
          to="/profile"
          className={`${styles.link_position_last} ${styles.link} ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
