import { PageBasicProps } from "../../AppMain"
import Layout from "../../Components/Layout"
import avatar from "../../assets/svg/artists1.svg"

const CommentSection: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  return (
    <Layout themeMode={themeMode} type={type} >

      <div className="flex justify-between items-center mt-12">
        <h2 className="text-xl font-semibold" style={{ color: themeMode ? "black" : "#fff" }}>Comments</h2>
        <button className="font-semibold" style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>View All Comments</button>
      </div>

    </Layout>
  )
}

export default CommentSection