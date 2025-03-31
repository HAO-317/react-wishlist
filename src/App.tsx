import React, { useState, useEffect } from 'react';
import './App.css';

// 定义 Wish 接口
interface Wish {
  id: number;
  text: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

// 定义支持的语言类型
type SpeechLang = 'en-US' | 'de-DE' | 'zh-CN' | 'it-IT';

function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState<string>('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [speechLang, setSpeechLang] = useState<SpeechLang>('en-US');

  const deleteButtonText: Record<SpeechLang, string> = {
    'en-US': 'Delete',
    'de-DE': 'Zurückziehen',
    'zh-CN': '取消',
    'it-IT': 'Cancellare',
  };

  useEffect(() => {
    const storedWishes = localStorage.getItem('wishes');
    if (storedWishes) {
      const parsedWishes: Wish[] = JSON.parse(storedWishes);
      console.log('loading wish from localStorage', parsedWishes);
      setWishes(parsedWishes);
    } else {
      console.log('no wish in localStorage, list empty');
    }
  }, []);

  useEffect(() => {
    console.log('new list save to localStorage:', wishes);
    localStorage.setItem('wishes', JSON.stringify(wishes));
  }, [wishes]);

  const addWish = () => {
    if (newWish.trim() === '') {
      console.log('no input, cant add wish');
      return;
    }
    const wish: Wish = {
      id: Date.now(),
      text: newWish,
      priority: priority,
      completed: false,
    };
    console.log('add new wish', wish);
    setWishes([...wishes, wish]);
    console.log('wishlist after update', [...wishes, wish]);

    const utterance = new SpeechSynthesisUtterance(newWish);
    utterance.lang = speechLang;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((voice) => voice.lang === speechLang);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
      console.log('use speech', matchingVoice.name, 'language', matchingVoice.lang);
    } else {
      console.log(` ${speechLang} no fund, used default`);
    }

    window.speechSynthesis.speak(utterance);
    console.log(`play speech ( ${speechLang}):`, newWish);

    utterance.onend = () => {
      console.log('play end', newWish);
    };

    utterance.onerror = (event) => {
      console.error('error by play', event.error);
    };

    setNewWish('');
    setPriority('Low');
    console.log('reset input & priority: newWish=', newWish, 'priority=', priority);
  };

  const toggleComplete = (id: number) => {
    console.log('status finish wish ID:', id);
    const updatedWishes = wishes.map((wish) =>
      wish.id === id ? { ...wish, completed: !wish.completed } : wish
    );
    console.log('list after finish:', updatedWishes);
    setWishes(updatedWishes);
  };

  const deleteWish = (id: number) => {
    console.log('del wish & ID:', id);
    const updatedWishes = wishes.filter((wish) => wish.id !== id);
    console.log('wishlist after del', updatedWishes);
    setWishes(updatedWishes);
  };

  return (
    <div className="App">
      <h1>🎁🎄 My Wishlist 🎄🎁</h1>

      <div className="add-wish">
        <input
          type="text"
          placeholder="input your wish"
          value={newWish}
          onChange={(e) => {
            setNewWish(e.target.value);
            console.log('update input', e.target.value);
          }}
        />
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as 'Low' | 'Medium' | 'High');
            console.log('update priority', e.target.value);
          }}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <select
          value={speechLang}
          onChange={(e) => {
            setSpeechLang(e.target.value as SpeechLang);
            console.log('update language select', e.target.value);
          }}
        >
          <option value="en-US">English (US)</option>
          <option value="de-DE">German (DE)</option>
          <option value="zh-CN">Chinese (中文)</option>
          <option value="it-IT">Italiano (IT)</option>
        </select>
        <button onClick={addWish} style={{ backgroundColor: 'green', color: 'white' }}>
          Add Wish
        </button>
      </div>

      <div className="wish-list">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="wish-item"
            style={{
              backgroundColor:
                wish.priority === 'High' ? 'red' : wish.priority === 'Medium' ? 'yellow' : 'lightgreen',
              textDecoration: wish.completed ? 'line-through' : 'none',
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={wish.completed}
                onChange={() => toggleComplete(wish.id)}
              />
              <span>{wish.text}</span>
            </div>

            <button
              onClick={() => deleteWish(wish.id)}
              style={{ backgroundColor: 'orangered', color: 'white' }}
            >
              {deleteButtonText[speechLang] || 'Delete'} ↩
            </button>
          </div>
        ))}
      </div>
      <h3>🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁🎄🎁</h3>
    </div>
  );
}

export default App;