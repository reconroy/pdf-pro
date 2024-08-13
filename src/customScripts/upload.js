// validation.js
import { toast } from 'react-toastify';

export const validateFileCount = (files) => {
    if (files.length < 2) {
        toast.error('Please select at least 2 files.');
        return false;
    }
    return true;
};
