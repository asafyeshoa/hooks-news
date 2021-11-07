import React from "react";
import useFormValidation from "../Auth/useFormValidation";
import validateCreateLink from "../Auth/validateCreateLink";
import {FirebaseContext} from "../../firebase";

const INITIAL_STATE = {
  description: '',
  url: ''
}

function CreateLink(props) {
    const {firebase, user} = React.useContext(FirebaseContext)
  const {handlerChange, values, errors,} = useFormValidation(INITIAL_STATE, validateCreateLink, handleCreateLink)

    function handleCreateLink() {
      if (!user) {
          props.history.push('/login')
      } else {
          const {url, description} = values
          const newLink = {
              url,
              description,
              postedBy: {
                  id: user.uid,
                  name: user.displayName
              },
              voteCount: 0,
              votes: [],
              comments: [],
              created: Date.now()
          }
          firebase.db.collection('links').add(newLink)
          props.history.push('/')
      }
    }


  return (
      <form onSubmit={handleCreateLink} className="flex flex-column mt3" >
        <input
        name="description"
        placeholder="A description for your link"
        autoComplete="off"
        type="text"
        onChange={handlerChange}
        value={values.description}
        className={errors.description && 'error-input'}
        />
          {errors.description && <p className="error-text" >{errors.description}</p>}

        <input
            name="url"
            placeholder="The URL for your link"
            autoComplete="off"
            type="url"
            onChange={handlerChange}
            value={values.url}
            className={errors.url && 'error-input'}
        />
          {errors.url && <p className="error-text" >{errors.url}</p>}

          <button className="button" type="submit"> Submit </button>

      </form>
  )
}

export default CreateLink;
