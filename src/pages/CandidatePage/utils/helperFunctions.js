export const handleShareBtnClick = async (titleToShare, linkDescription, linkToShare) => {
    
    const jobDataToShare = {
        title: titleToShare,
        text: linkDescription,
        url: linkToShare,
    }

    try {

        await navigator.share(jobDataToShare);

    } catch (err) {
        console.log(err);
    }
}