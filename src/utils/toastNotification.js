import { toast } from 'react-toastify';
import * as Constants from '../Constants';
import 'react-toastify/dist/ReactToastify.css';

class toastNotification {

    constructor(message, toastType, timeout = false) {
        this.message = message
        this.timeout = timeout
        this.options = {
            type: toastType,
            autoClose: timeout,
            closeOnClick: true,
            position: "top-center",
            draggable: false,

        }
        this.toastId = ""
    }

    show() {
        this.toastId = toast(this.message, this.options)
    }

    update(message, toastType, timeout = false) {
        toast.update(this.toastId, { render: message, type: toastType, autoClose: timeout });
    }

    hide() {
        toast.dismiss(this.toastId)
    }

    checkForDuplicates(message)
    {
        if (!toast.isActive(this.toastId)) {
            this.toastId = toast(message, this.options);
        }
    }
}

export default toastNotification