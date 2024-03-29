export default function validateCreateLink(values) {

    let errors = {}
    if(!values.description){
        errors.description = 'Description required'
    } else if(values.description.length < 10){
        errors.description = 'Description must be at least 6 characters'
    }

    if(!values.url) {
        errors.url = 'URL required'
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = 'URL most be valid'
    }
    return errors

}
