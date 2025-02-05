import React from 'react'
import Layout from '../../Components/Layout';
import BreadCrumb from '../../Components/BreadCrumb';
import ContentTitle from '../../Components/ContentTitle';
import FilterInput from '../../Components/FilterInput';
import { PageBasicProps } from '../../AppMain';
import { useParams } from 'react-router-dom';

const ArtistDetailsPage: React.FC<PageBasicProps> = ({ themeMode, type }) => {

  return (
    <div>
      <Layout themeMode={themeMode} type={type}>
        <div className="flex justify-center">
          <div className="container">
            {!type && (
              <div className="md:mt-12 mt-8">
                <BreadCrumb />
              </div>
            )}
            <div className="md:mt-7 mt-10">
              <ContentTitle titleType="TOP HITS" title="Our Top Artists details" />
            </div>
            <div>
            <div>
            </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default ArtistDetailsPage