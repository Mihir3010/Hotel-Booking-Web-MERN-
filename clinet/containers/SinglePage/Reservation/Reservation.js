import React, { Fragment } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Card from 'components/UI/Card/Card';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import RenderReservationForm from './RenderReservationForm';
import { useState } from 'react'

const CardHeader = ({ priceStyle, pricePeriodStyle, linkStyle , numberOfDays, days ,rooms}) => {

  // const totalPrice = 1620 * days ;
  
  return (
    <Fragment>
      <Heading
        content={
          <Fragment>
             <Text as="span" content="" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      />
      <Link href="/#1">
        <a style={{ ...linkStyle }}>Contact Hotel</a>
      </Link>
    </Fragment>
  );
};

export default function Reservation({ linkStyle }) {
  const [days, setDays] = useState(0)
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader days={days} />}
      content={<RenderReservationForm setDays={setDays} />}
      footer={
        <p>
          Special offers available.
          <Link href="/#1">
            <a style={{ ...linkStyle }}>See details</a>
          </Link>
        </p>
      }
    />
  );
}

CardHeader.propTypes = {
  priceStyle: PropTypes.object,
  pricePeriodStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

CardHeader.defaultProps = {
  priceStyle: {
    color: '#2C2C2C',
    fontSize: '25px',
    fontWeight: '700',
  },
  pricePeriodStyle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};
