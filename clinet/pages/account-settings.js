import React, {useEffect, useState } from 'react';
import Head from 'next/head';
import { AgentAccountSettingsPage } from 'containers/Agent/';
import axiosInstance from 'components/axios';
import { getAPIData, processAPIData, getUserProfile } from 'library/helpers/get-api-data';

export default function accountSettingsPage() {

  const [data, setData] = useState(null)
  useEffect(() => {
    axiosInstance.get('/vendor/getProfile/').then((res)=>{
      const response = {
        "name": 'User Profile',
        "data": res.data,
      }
      setData(response);
    }).catch((err)=>{
      const response = {
        "name": 'User Profile',
        "data": "null",
      }
      setData(response);
    });
  },[])
  return (
    <>
      <Head>
        <title>Account Settings | Room eazy</title>
      </Head>
      <AgentAccountSettingsPage processedData={data} />
    </>
  );
}

// export async function getServerSideProps() {
//   const apiUrl = [
//     {
//       endpoint: 'agent',
//       name: 'agentProfile',
//     },
//   ];
//   const Request = () => {
//     return 
//   };
//   const pageData = await getUserProfile();
//   console.log('pageData');
//   console.log(pageData);
//   // const processedData = processAPIData(pageData);
//   return {
//     props: { pageData },
//   };
// }
