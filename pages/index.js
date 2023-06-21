import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { useState, useEffect } from 'react';
import useSWR from 'swr'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const SWRfetcher = (...args) => fetch(...args).then(res => res.json()).then(data => JSON.stringify(data))

export default function Home({ allPostsData }) {
  // API call using just fetch
  const [fastAPIdata, setfastAPIdata] = useState('No data')

  useEffect(() => {
      setfastAPIdata('Fetching ...')
      fetch('http://localhost:8000/fetch')
        .then(res => res.json())
        .then(data => setfastAPIdata(JSON.stringify(data)))
    }, [])

  // API call using useSWR
  const { data : SWRdata, isLoading: SWRisLoading, isValidating: SWRisValidating } = useSWR('http://localhost:8000/swr', SWRfetcher)

  return (
    <Layout home>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog Entries ALMRIA HALU</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
        <hr/>
        <h2 className={utilStyles.headingLg}>NextJS API</h2>
        <Link href={`/api/hello`}>/api/hello</Link>
        <hr/>
        <h2 className={utilStyles.headingLg}>Form Samples</h2>
        <ul>
          <li><Link href={'/no-js-form'}>No-js form sample</Link></li>
          <li><Link href={'/js-form'}>JS form sample</Link></li>
        </ul>
        <hr/>
        <h2 className={utilStyles.headingLg}>FastAPI</h2>
        <p>
          Response from http://localhost:8000:
          <br/>
          <strong>{fastAPIdata}</strong>
        </p>
        <p>
          Same API call using <Link href='https://swr.vercel.app/'>SWR</Link>:
          <br/>
          <strong>
          {SWRisValidating ? 'Validating...' : ''} {SWRisLoading ? 'Loading ...' : SWRdata}
          </strong>
        </p>
      </section>
    </Layout>
  );
}
