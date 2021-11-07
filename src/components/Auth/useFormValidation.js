import React from "react";

function useFormValidation(initialState, validate, authenticate) {
    const [values, setValues] = React.useState(initialState)
    const [errors, setErrors] = React.useState({})
    const [isSubmitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        if(isSubmitting) {
        const noErrors =  Object.keys(errors).length === 0
            if(noErrors) {
                authenticate()
                setSubmitting(false)
            } else {
                setSubmitting(false)
            }
        }
    }, [errors])

    function handlerChange(event) {
        event.persist()
        setValues(prevValues =>({
            ...prevValues,
            [event.target.name]: event.target.value
        }))
    }


    function handleBlur() {
        const validationErrors =  validate(values)
        setErrors(validationErrors)
        setSubmitting(true)

    }

    function handleSubmit(event) {
        event.preventDefault()
        const validationErrors =  validate(values)
        setErrors(validationErrors)
    }

    return {handlerChange, handleBlur, handleSubmit, values, errors, isSubmitting}
}

export default useFormValidation;
