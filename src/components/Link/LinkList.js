import React from "react";
import {FirebaseContext} from "../../firebase";
import LinkItem from "./LinkItem";


function LinkList(props) {
  const {firebase} = React.useContext(FirebaseContext)
  const [cursor, setCursor] = React.useState(null)
  const [links, setLinks] = React.useState([])
  const isNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top')
  const page = Number(props.match.params.page)
   const LINKS_PER_PAGE = 3;


  React.useEffect(() => {
    const unsub =  getLinks();
    return () => unsub()
  }, [isTopPage, page])

  function getLinks() {
    const hasCursor = Boolean(cursor)
    if(isTopPage) {
      return  firebase.db
          .collection('links')
          .orderBy('voteCount', 'desc')
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot)

    } else if(page === 1) {
      return  firebase.db
          .collection('links')
          .orderBy('created', 'desc')
          .limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot)
    } else  if (hasCursor) {
      return  firebase.db
          .collection('links')
          .orderBy('created', 'desc')
          .startAfter(cursor.created)
          .limit(LINKS_PER_PAGE).onSnapshot(handleSnapshot)
    }


  }

  function handleSnapshot(snapshot){
    const links = snapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data()}
    })
    const lastLink = links[links.length - 1]
    setLinks(links)
    setCursor(lastLink)
  }

  function visitPreviousPage() {
    if(page > 1) {
      props.history.push(`/new/${page - 1}`)
    }
  }

  function visitNextPage() {
    if(page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE +  1 : 0;

  return (
      <div>
        {links.map((link, index) => {
        return  <LinkItem key={link.id} showCount={true} link={link} index={index + pageIndex} />
        })}
        {isNewPage && (
            <div className='pagination' >
              <div className='pointer mr2' onClick={visitPreviousPage}>Previous</div>
              <div className='pointer' onClick={visitNextPage} >Next</div>
            </div>
        )}
      </div>
  )
}

export default LinkList;
