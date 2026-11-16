import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { selectUser } from '@services/selectors';
import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(selectUser)?.name;
  const location = useLocation();
  const background = (location.state as { background?: { pathname: string } } | null)
    ?.background;
  const pathname = background?.pathname ?? location.pathname;

  return <AppHeaderUI userName={userName} pathname={pathname} />;
};
