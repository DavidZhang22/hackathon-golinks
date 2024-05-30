import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import {get, post} from './helper'

function App() {

  const [username, setUsername] = useState('')
  const [data, setData] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchGithubData() {

    const url  = '/github/' + username
    await get(url).then((data) => {
      if(!data || !data.success){
        setData(null)
        return
      }
      setData(data.data)
    })
  }

  function roundTo(num, precision) {
    const factor = Math.pow(10, precision)
    return Math.round(num * factor) / factor
  }


  useEffect(() => {

    console.log(data)  

  }, [username, data]);

  return (
    <div className="App">
      <header className="App-header">
        <input  className='App-input' 
                value = {username} 
                onChange={(e)=>setUsername(e.target.value)}
                placeholder ='Enter Github Username'
        >
        </input>
        <button className='App-button' onClick={fetchGithubData}>Fetch</button>

        {data?<div className= 'App-col'>
          <div className='App-row'>
            <img src={data.avatar_url} className='App-logo' alt="logo" />
            <a href = {data.html_url} className='App-link'><text className='lg-text'>{data.login}</text></a>
          </div>
          <text className='text-sm'> Public Repos: {data.public_repos} | </text> 
          <text className='text-sm'> Followers: {data.followers} |</text>
          <text className='text-sm'> Fork Count: {data.fork_count}  </text>
          <div className='App-row'>
            <text className='text-lg'> REPOS</text>
          </div>
        <div className='App-row'>
        
          <div className='App-col'>
            Languages
            {

            data.langs.map((lang) => {

              return <div className='App-col'>
                
                <text className='text-sm'>{lang[0]}</text>
                <text className='text-sm'>{roundTo(100*lang[1]/data.langs_sum, 1)}%</text>
              </div>

            })}
          </div>
          <div className='App-col'>{data.repos.map((repo)=>{
            return <div className='App-col2'>
              <a className = 'App-link' href = {repo.url}><text className='lg-text'>{repo.name}</text></a>
              <text className='text-sm'>{repo.description}</text>
            </div>
          })}</div>
        </div>

        </div>: 
        <div className='App-content'>No User found</div>}
      </header>
    </div>
  );
}

export default App;
