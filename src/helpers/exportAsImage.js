// https://blog.logrocket.com/export-react-components-as-images-html2canvas/
import html2canvas from "html2canvas";
export default async function exportAsImage(element, imageFileName) {
    const html = document.getElementsByTagName("html")[0];
    const body = document.getElementsByTagName("body")[0];
    let htmlWidth = html.clientWidth;
    let bodyWidth = body.clientWidth;
    const newWidth = element.scrollWidth - element.clientWidth;
    if (newWidth > element.clientWidth) {
        htmlWidth += newWidth;
        bodyWidth += newWidth;
    }
    html.style.width = htmlWidth + "px";
    body.style.width = bodyWidth + "px";
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, imageFileName);
    html.style.width = null;
    body.style.width = null;
}