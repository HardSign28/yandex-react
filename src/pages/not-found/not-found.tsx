import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import type React from 'react';

import styles from './not-found.module.css';

type Star = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  dur: number;
  begin: number;
  colorClass: string;
};

const NUM_STARS = 100;

const NotFound: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: NUM_STARS }).map(() => {
        const cx = Math.random() * 1000;
        const cy = Math.random() * 600;
        const r = Math.random();
        const dur = Math.random() * 3 + 2;
        const begin = Math.random() * 3;
        const colorIndex = Math.ceil(Math.random() * 3);
        const colorClass = (styles as Record<string, string>)[`color-${colorIndex}`];
        return {
          id: uuidv4(),
          cx,
          cy,
          r,
          dur,
          begin,
          colorClass,
        };
      }),
    []
  );

  return (
    <div className={styles.bg}>
      <svg
        id="starfield"
        className={styles.bg}
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Starfield background"
      >
        {stars.map(({ id, cx, cy, r, dur, begin, colorClass }) => (
          <circle
            key={id}
            className={`${styles.star} ${colorClass}`}
            cx={cx}
            cy={cy}
            r={r}
            pointerEvents="none"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${begin}s`}
            />
          </circle>
        ))}
      </svg>
      <div className={styles.page}>
        <h1 className="text text_type_digits-large">404</h1>
        <div className="text text_type_main-default text-center mb-10">
          Такой страницы не существует
          <br />
          или она была перемещена
        </div>
        <Button
          onClick={() => void navigate('/')}
          htmlType="button"
          type="primary"
          size="large"
        >
          На главную
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
