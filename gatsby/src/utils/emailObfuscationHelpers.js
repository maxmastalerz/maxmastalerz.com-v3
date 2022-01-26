import toast from 'react-hot-toast';

const alertEmailCopied = () => {
    toast.success(
        "Email copied to clipboard!",
        { duration: 2000, position: 'bottom-center' }
    );
};

export const getLiameym = async (e) => {
    let liameym = window.document.querySelector("#liameym1 span:nth-child(2)");
    let liameymText = liameym.textContent;

    if (navigator.clipboard && window.isSecureContext) { // Navigator clipboard api method - Needs secure context! (https)
        navigator.clipboard.writeText(liameymText)
            .then(() => { alertEmailCopied(); });
    } else { //fallback
        var range = document.createRange();
        range.selectNode(liameym);
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect
        alertEmailCopied();
    } 
};