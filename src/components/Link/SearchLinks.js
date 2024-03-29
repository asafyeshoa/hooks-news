import React from "react";
import firebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const {firebase} = React.useContext(firebaseContext)
  const [links, setLinks] = React.useState([])
  const [filteredLinks, setFilteredLinks] = React.useState([])
  const [filter, setFilter] = React.useState('')

  React.useEffect(() => {
    getInitialLinks()
  }, [])

  function getInitialLinks(){
  firebase.db.collection('links').get().then(snapshot => {
    const links = snapshot.docs.map(doc => {
      return {id: doc.id, ...doc.data()}
    })
    setLinks(links)
  })
  }

  function handleSearch(event) {
    event.preventDefault()
    const query = filter.toLowerCase()
   const matchedLinks = links.filter(link => {
    return link.description.toLowerCase().includes(query)
      || link.url.toLowerCase().includes(query) || link.postedBy.name.toLowerCase().includes(query)
    })
    setFilteredLinks(matchedLinks)
  }

  return (
      <div>
      <form onSubmit={handleSearch} >
        <div>
          Search <input onChange={event => setFilter(event.target.value)}  />
          <button>OK</button>
        </div>
      </form>
        {filteredLinks.map((link, index) => {
        return  <LinkItem key={link.id} showCount={false} link={link} index={index}/>
        })}
      </div>
  )
}

export default SearchLinks;
