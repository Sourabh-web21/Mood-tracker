import Navbar from '../components/navbar'

function main_layout({children,username,setUsername}) {
  return (
    <>
      <Navbar username={username} setUsername={setUsername}/>
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-blue-100'>
        {children}
      </div>
    </>
  )
}

export default main_layout
