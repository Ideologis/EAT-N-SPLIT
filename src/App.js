import { useState } from 'react'
import './App.css'
const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0
  }
]
function Button ({ children, whenClick }) {
  return (
    <button className='button' onClick={whenClick}>
      {children}
    </button>
  )
}

function App () {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  function handleShowAddFriend () {
    setShowAddFriend(show => !show)
  }
  function handleAddFriend (itemFriend) {
    setFriends(friends => [...friends, itemFriend])
    setShowAddFriend(false)
  }
  function handleSelection (friend) {
    // setSelectedFriend(friend)
    setSelectedFriend(curr => (curr?.id === friend.id ? null : friend))

    setShowAddFriend(false)
  }

  function handleSplitBill (bill) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + bill }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          myFriends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button whenClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          chosenfriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  )
}

function FriendList ({ myFriends, onSelection, selectedFriend }) {
  return (
    <ul>
      {myFriends.map(friend => (
        <Friend
          key={friend.id}
          friendProps={friend}
          onSelection={onSelection}
          onSelectedFriend={selectedFriend || {}}
        />
      ))}
    </ul>
  )
}
function Friend ({ friendProps, onSelection, onSelectedFriend }) {
  const isSelected = onSelectedFriend?.id === friendProps.id

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friendProps.image} alt={friendProps.name} />
      <h3>{friendProps.name}</h3>
      {friendProps.balance < 0 && (
        <p className='red'>
          You owe {friendProps.name} ${Math.abs(friendProps.balance)}
        </p>
      )}
      {friendProps.balance > 0 && (
        <p className='red'>
          {friendProps.name} owes you ${Math.abs(friendProps.balance)}
        </p>
      )}
      {friendProps.balance === 0 && (
        <p className='red'>You and {friendProps.name} are even</p>
      )}
      <Button whenClick={() => onSelection(friendProps)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  )
}

function FormAddFriend ({ onAddFriend }) {
  const [name, setName] = useState('')
  const [Image, setImage] = useState('https://i.pravatar.cc/48')
  function handleSubmit (e) {
    e.preventDefault()
    if (!name || !Image) return

    const id = crypto.randomUUID()

    const newFriend = {
      id,
      name,
      Image: `${Image}?=${id}`,
      balance: 0
    }

    onAddFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      <label>Image URL</label>
      <input
        type='text'
        value={Image}
        onChange={e => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill ({ chosenfriend, onSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setpaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handleSubmit (e) {
    e.preventDefault()
    if (!bill || !paidByUser) return
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>split a bill with {chosenfriend?.name}</h2>
      <label> 💵 Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={e => setBill(Number(e.target.value))}
      />

      <label> 🙂 Your expenses</label>
      <input
        type='text'
        value={paidByUser}
        onChange={e =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label> 😎 {chosenfriend?.name} expenses</label>
      <input type='text' disabled value={paidByFriend} />

      <label> 😁 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{chosenfriend?.name}'s</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}
export default App
