  import axios from 'axios';
import { useEffect, useState } from "react";
import History_card from '../components/history_Card';
const API_URL = import.meta.env.VITE_API_URL;



  function history() {
      const [history,setHistory]=useState([]);
      const token = localStorage.getItem("token");

const fetchHistory = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(res.data);
  } catch (err) {
    console.error(err);
  }
};

      useEffect(()=>{
          fetchHistory()
      },[])
    return (
        <>
        {/* existing mood selection + tracks */}
        {history.length>0 ?(
        <div className="mt-6 text-center ">
          <h2 className="text-xl font-bold">Mood History</h2>
          <div className="mt-2 flex gap-10 h-fit flex-wrap justify-center">
            {history.map((entry, i) => (
              <History_card key={i} className="w-72 p-4 border rounded-xl shadow bg-white text-left">
                <span className="font-semibold">{entry.mood}--   {new Date(entry.date).toLocaleString()}</span> 
             
                <ul>
                  {entry.tracks.map((t, j) => (
                    <li key={j}>
                      <a href={t.url} target="_blank" rel="noopener noreferrer">
                        🎵 {t.name} - {t.artist}
                
                      </a>
                    </li>
                  ))}
                </ul>
              </History_card>
            ))}
          </div>
        </div>) :(
        <div className='text-center text-2xl'>
          No history Found
        </div>
        )}
      </>
    )
  }

  export default history
