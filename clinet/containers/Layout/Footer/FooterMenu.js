import React from 'react';
import Link from 'next/link';

import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  PRIVACY_PAGE,
  PRICING_PLAN_PAGE,
  AGENT_PROFILE_PAGE,
} from '../../../settings/constant';

const FooterMenu = () => {
  return (
    <ul className="ant-menu">
      <li>
        <Link href={`${HOME_PAGE}`}>
          <a>Hotels</a>
        </Link>
      </li>
      <li>
        <Link href={`${LISTING_POSTS_PAGE}`}>
          <a>Listing</a>
        </Link>
      </li>
      <li>
        <Link href={`${PRIVACY_PAGE}`}>
          <a>Privacy</a>
        </Link>
      </li>
      <li>
      </li>
    </ul>
  );
};

export default FooterMenu;
