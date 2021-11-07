import React from "react";
import {Link, withRouter} from "react-router-dom";
import {getDomain} from "../../utils";
import {FirebaseContext} from "../../firebase";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'


function LinkItem(link, index, showCount,history) {
    const {firebase, user} = React.useContext(FirebaseContext)
    function handleVote() {
        if(!user){
            history.push('/login')
        } else {
            const voteRef =  firebase.db.collection('links').doc(link.link.id)
            voteRef.get().then(doc => {
                if(doc.exists) {
                 const previousVotes = doc.data().votes;
                 const vote = {votedBy: {id: user.uid, name: user.displayName}}
                 const updatedVotes = [...previousVotes, vote]
                    const voteCount = updatedVotes.length
                 voteRef.update({votes: updatedVotes, voteCount})
                }
            })
        }
    }
    function handleDeleteLink() {
        const linkRef =  firebase.db.collection('links').doc(link.link.id)
        linkRef.delete().then( () => {
            console.log('delete', link.link.id)
        }).catch(err => {
            console.log('err', err.message)
        })

    }
    const postedByAuthUser = user && user.uid === link.link.postedBy.id
  return (
      <div className="flex items-start mt2" >
        <div className="flex items-center" >
          {showCount && <span className='grey' >{index}.</span>}
          <div className="vote-button" onClick={handleVote}>^</div>
        </div>

        <div className='ml1' >
        <div>

            <a href={link.url} className='black no-underline' >{link.link.description}</a>{" "}

            <span className="link">({getDomain(link.link.url)})</span>
        </div>
          <div className="f6 1h-copy gray" >
            {link.link.voteCount} votes by {link.link.postedBy.name} {formatDistanceToNow(link.link.created)}
            {" | "}
            <Link to={`/link/${link.link.id}`}>
              {link.link.comments.length > 0
                ? `${link.link.comments.length} comments`
                  : 'Discuss'
              }
            </Link>
              {postedByAuthUser && (
                  <>
                      {" | "}
                      <span className='delete-button' onClick={handleDeleteLink}>delete</span>
                  </>
              )}
          </div>
        </div>

  </div>
  )
}

export default withRouter(LinkItem);
