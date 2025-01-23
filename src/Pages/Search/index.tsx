import BreadCrumb from "../../Components/BreadCrumb";
import Layout from "../../Components/Layout";

const SearchMainPage = ({ themeMode, type }: any) => {
  return (
    <Layout themeMode={themeMode} type={type}>
     <div className="flex justify-center">
        <div className="container">
        {type ? (
              ""
            ) : (
              <div className="md:mt-12 mt-8">
                <BreadCrumb />
              </div>
            )}
            <div>
                <h1 className="text-[#252733] font-bold text-5xl text-start mt-5 mb-16">You searched for “Lorum Ipsum”</h1>
            </div>

            <div>
                
            </div>
        </div>
     </div>
    </Layout>
  );
};

export default SearchMainPage;
