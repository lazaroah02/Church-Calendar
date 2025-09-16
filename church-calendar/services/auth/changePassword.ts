import {CHANGE_PASSWORD_URL} from '../../settings.js'

export function changePassword({newPassword1, newPassword2, token}){
    return fetch(CHANGE_PASSWORD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Token ${token}`
        },
        body: JSON.stringify({new_password1: newPassword1, new_password2: newPassword2})
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        if(data.detail == "New password has been saved."){
            return "Password change successfuly"
        }
        else{
            throw new Error('Error al cambiar la contraseña. Inténtelo más tarde')
        }
    })
    
}