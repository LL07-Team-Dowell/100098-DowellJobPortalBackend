export const formatSubprojectStringItemToHTML = (strPassed) => {
    if (!strPassed) return strPassed;

    const extractedContent = strPassed.split('<@')[1];
    if (!extractedContent) return strPassed;

    const [ startIndex, endIndex ] = [
        strPassed.indexOf('<@'),
        strPassed.indexOf('!>')
    ]

    const [
        subProject,
        project,
        listingId,
    ] = [
        extractedContent.split('~')[0],
        extractedContent.split('~')[1],
        extractedContent.split('~')[2]?.split('!>')[0],
    ]

    const stringToReplace = strPassed.substring(startIndex, endIndex + 2);
    const newStringWithHTMLContent = strPassed.replace(stringToReplace, `<p><span class='sub__At__Selection'>@${subProject}<span class='project__Tooltip'>Project: ${project}</span><span class='listing__Id'>${listingId}</span></span></p> `);

    return newStringWithHTMLContent;
}