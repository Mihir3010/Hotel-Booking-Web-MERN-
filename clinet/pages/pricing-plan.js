import React from 'react';
import Head from 'next/head';
import Pricing from 'containers/Pricing/Pricing';

export default function pricingPage() {
  return (
    <>
      <Head>
        <title>Pricing plan | Room eazy</title>
      </Head>
      <Pricing />
    </>
  );
}
